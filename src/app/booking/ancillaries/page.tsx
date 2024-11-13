'use client'

import React, { useEffect } from 'react'
import {
  BookingStepActions,
  SimpleContainer,
  AncilliaryService,
  PassengerAncillariesSkeleton,
} from '@/components'
import { useBooking } from '@/contexts'
import { Alert, Stack, Grid } from '@mui/material'
import { useAncillaries, useSelectAncillaries } from '@/services'
import WarningIcon from '@mui/icons-material/Warning'
import { AncillaryServiceInfo } from '@/types'

export default function AncillariesPage() {
  const [isNavigating, setIsNavigating] = React.useState(false)
  const { goPreviousStep, goNextStep, passengers, order, ancillaries, setAncillaries } =
    useBooking()
  const { mutate: selectAncillaries, isPending: isSelectingAncillaries } = useSelectAncillaries()

  if (!passengers || !order) {
    // TODO: log this somewhere
    // TODO: Warn the user that something went wrong
    return null
  }
  const { data: remoteAncillaries, isSuccess, isFetching } = useAncillaries({ orderId: order.id })
  const isLoading = isFetching || isSelectingAncillaries || isNavigating

  useEffect(() => {
    if (remoteAncillaries) setAncillaries(remoteAncillaries.ancillaries)
  }, [remoteAncillaries])

  const handleSubmit = () => {
    selectAncillaries(
      {
        orderId: order.id,
        ancillaries: ancillaries
          .flatMap((anc) => anc.segments)
          .flatMap((seg) => seg.ancillaries)
          .filter((anc) => anc.selected),
      },
      {
        onSuccess: () => {
          setIsNavigating(true)
          goNextStep()
        },
        onError: (error) => {
          // TODO: log this somewhere
          // TODO: Warn the user that something went wrong
        },
      },
    )
  }

  return (
    <>
      {isFetching && (
        <Stack>
          {passengers.map((_) => (
            <PassengerAncillariesSkeleton />
          ))}
        </Stack>
      )}
      {ancillaries &&
        !isFetching &&
        isSuccess &&
        ancillaries.map((ancillary) => {
          const remotePassengerData = remoteAncillaries.passengers.find(
            (p) => p.id === Number(ancillary.passenger),
          )
          if (!remotePassengerData)
            throw Error("Can't find passenger index in remote passengers info")
          const passengerData = passengers.find(
            (p) =>
              p.firstName.toLowerCase() === remotePassengerData.firstName.toLowerCase() &&
              p.lastName.toLowerCase() === remotePassengerData.lastName.toLowerCase() &&
              p.dateOfBirth?.year() === remotePassengerData.dateOfBirth.year &&
              p.dateOfBirth?.month() + 1 === remotePassengerData.dateOfBirth.month &&
              p.dateOfBirth?.date() === remotePassengerData.dateOfBirth.day,
          )
          if (!passengerData) throw Error("Can't find passenger index in local passengers info")
          const totalSegments = ancillary.segments.length
          let outboundServices: AncillaryServiceInfo[] = []
          if (totalSegments > 0) {
            outboundServices = ancillary.segments[0].ancillaries.filter((service) =>
              ancillary.segments.every((segment) =>
                segment.ancillaries.some((anc) => anc.code === service.code),
              ),
            )
          }
          let inboundServices: AncillaryServiceInfo[] = []
          if (totalSegments > 1) {
            inboundServices = ancillary.segments[1].ancillaries.filter((service) =>
              ancillary.segments.every((segment) =>
                segment.ancillaries.some((anc) => anc.code === service.code),
              ),
            )
          }
          return (
            <SimpleContainer
              key={ancillary.passenger}
              title={`Passenger : ${passengerData?.firstName} ${passengerData?.lastName}`}>
              <Stack gap={2} sx={{ pt: { xs: 3, lg: 4 } }}>
                <Alert severity="info" icon={<WarningIcon fontSize="inherit" />}>
                  L’achat de bagages après la réservation revient plus cher. Ajoutez-les maintenant
                  et économisez pour vous faire encore plus plaisir pendant votre voyage.
                </Alert>
                <Grid container spacing={2} data-testid="ancillariesPage-options">
                  {outboundServices.length > 0 &&
                    outboundServices.map((service) => (
                      <AncilliaryService
                        disabled={isLoading}
                        key={service.externalId}
                        outboundService={service}
                        onSelectService={(service) => {
                          const segmentIndex = ancillary.segments.findIndex((seg) =>
                            seg.ancillaries.some((anc) => anc.externalId === service.externalId),
                          )
                          if (segmentIndex !== -1) {
                            const ancIndex = ancillary.segments[segmentIndex].ancillaries.findIndex(
                              (anc) => anc.externalId === service.externalId,
                            )
                            if (ancIndex !== -1) {
                              ancillary.segments[segmentIndex].ancillaries[ancIndex].selected = true
                              setAncillaries((prev) => [...prev])
                            }
                          }
                        }}
                        onUnselectService={(service) => {
                          const segmentIndex = ancillary.segments.findIndex((seg) =>
                            seg.ancillaries.some((anc) => anc.externalId === service.externalId),
                          )
                          if (segmentIndex !== -1) {
                            const ancIndex = ancillary.segments[segmentIndex].ancillaries.findIndex(
                              (anc) => anc.externalId === service.externalId,
                            )
                            if (ancIndex !== -1) {
                              ancillary.segments[segmentIndex].ancillaries[ancIndex].selected =
                                false
                              setAncillaries((prev) => [...prev])
                            }
                          }
                        }}
                        inboundService={inboundServices.find((anc) => anc.code === service.code)}
                      />
                    ))}
                </Grid>
              </Stack>
            </SimpleContainer>
          )
        })}
      <BookingStepActions
        onContinue={handleSubmit}
        onGoBack={goPreviousStep}
        isLoading={isLoading}
      />
    </>
  )
}
