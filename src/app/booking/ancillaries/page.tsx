'use client'

import React, { useEffect } from 'react'
import {
  BookingStepActions,
  SimpleContainer,
  AncilliaryService,
  PassengerAncillariesSkeleton,
  LccAncilliaryService,
} from '@/components'
import { useBooking } from '@/contexts'
import { Alert, Stack, Grid } from '@mui/material'
import { useAncillaries, useLCCAncillaries, useSelectAncillaries, useUpdateOrder } from '@/services'
import WarningIcon from '@mui/icons-material/Warning'
import { AncillariesQueryResult, Ancillary, GDSType, UpdateOrderParams } from '@/types'
import useMetadata from '@/contexts/useMetadata'
import { getAncillaryServices } from '@/utils'

export default function AncillariesPage() {
  useMetadata('Options')
  const [isNavigating, setIsNavigating] = React.useState(false)
  const {
    goPreviousStep,
    goNextStep,
    passengers,
    setPassengers,
    order,
    setOrder,
    ancillaries,
    setAncillaries,
    selectedFare,
  } = useBooking()
  const { mutate: selectAncillaries, isPending: isSelectingAncillaries } = useSelectAncillaries()

  if (!passengers || !order || !selectedFare) {
    // TODO: log this somewhere
    // TODO: Warn the user that something went wrong
    return null
  }
  const {
    data: ancillariesResponse,
    isSuccess,
    isFetching,
  } = useAncillaries({ orderId: order.id, gdsType: selectedFare.gdsType })
  const {
    data: lccAncillaries,
    isSuccess: lccIsSuccess,
    isFetching: isFetchingLcc,
  } = useLCCAncillaries({
    solutionId: selectedFare.id,
    gdsType: selectedFare.gdsType,
    orderId: order.id,
  })
  const { mutate: updateOrder, isPending: isUpdatingOrder } = useUpdateOrder()

  const isLoading =
    isFetching || isSelectingAncillaries || isNavigating || isFetchingLcc || isUpdatingOrder

  useEffect(() => {
    if (ancillariesResponse) setAncillaries(ancillariesResponse.ancillaries)
  }, [ancillariesResponse])

  const handleSubmit = () => {
    if (selectedFare.gdsType === GDSType.REGULAR) {
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
    } else if (selectedFare.gdsType === GDSType.LOW_COST_CARRIER) {
      const newOrder: UpdateOrderParams = {
        orderId: order.id,
        passengers: passengers,
      }
      updateOrder(newOrder, {
        onSuccess: (data) => {
          setOrder(data)
          setIsNavigating(true)
          goNextStep()
        },
        onError: (error) => {
          // TODO: log this somewhere
          // TODO: Warn the user that something went wrong
        },
      })
    }
  }

  const getPassengerData = (ancillariesResponse: AncillariesQueryResult, ancillary: Ancillary) => {
    const remotePassengerData = ancillariesResponse.passengers.find(
      (p) => p.id === Number(ancillary.passenger),
    )
    return remotePassengerData
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
      {selectedFare.gdsType === GDSType.REGULAR &&
        ancillaries &&
        !isFetching &&
        isSuccess &&
        ancillaries.map((ancillary) => {
          const passengerData = getPassengerData(ancillariesResponse, ancillary)
          const [outboundServices, inboundServices] = getAncillaryServices(
            ancillary,
            ancillariesResponse,
            selectedFare,
          )
          return (
            <SimpleContainer
              key={ancillary.passenger}
              title={`Passager : ${passengerData?.firstName} ${passengerData?.lastName}`}>
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
                        inboundService={inboundServices.find(
                          (anc) => anc.code === service.code && anc.name === service.name,
                        )}
                      />
                    ))}
                </Grid>
              </Stack>
            </SimpleContainer>
          )
        })}
      {/* TODO: Uncomment this block when LCC ancillaries work as expected */}
      {/* {selectedFare.gdsType === GDSType.LOW_COST_CARRIER &&
        lccAncillaries &&
        !isFetchingLcc &&
        lccIsSuccess &&
        lccAncillaries &&
        passengers
          .filter((p) => ['ADT', 'CHD'].includes(p.type))
          .map((passengerData, index) => {
            return (
              <SimpleContainer
                key={index}
                title={`Passager : ${passengerData?.firstName} ${passengerData?.lastName}`}>
                <Stack gap={2} sx={{ pt: { xs: 3, lg: 4 } }}>
                  <Alert severity="info" icon={<WarningIcon fontSize="inherit" />}>
                    L’achat de bagages après la réservation revient plus cher. Ajoutez-les
                    maintenant et économisez pour vous faire encore plus plaisir pendant votre
                    voyage.
                  </Alert>
                  <Grid container spacing={2} data-testid="ancillariesPage-options">
                    {lccAncillaries
                      .filter((a) => Number(a.price) > 0)
                      .map((ancillary, index) => (
                        <LccAncilliaryService
                          disabled={isLoading}
                          key={index}
                          ancillaryService={ancillary}
                          onSelectService={(service) => {
                            passengerData.ancillaries.push(service)
                            setPassengers((prev) => [...prev])
                          }}
                          onUnselectService={(service) => {
                            passengerData.ancillaries = passengerData.ancillaries.filter(
                              (anc) =>
                                !(
                                  anc.code === service.code &&
                                  anc.price === service.price &&
                                  anc.baggageWeight === service.baggageWeight &&
                                  anc.price === service.price
                                ),
                            )
                            setPassengers((prev) => [...prev])
                          }}
                          selected={passengerData.ancillaries.some(
                            (anc) =>
                              anc.code === ancillary.code &&
                              anc.price === ancillary.price &&
                              anc.baggageWeight === ancillary.baggageWeight &&
                              anc.price === ancillary.price,
                          )}
                        />
                      ))}
                  </Grid>
                </Stack>
              </SimpleContainer>
            )
          })} */}
      {selectedFare.gdsType === GDSType.LOW_COST_CARRIER &&
        !isFetchingLcc &&
        lccIsSuccess &&
        lccAncillaries && (
          <SimpleContainer title={`Passager : All`}>
            <Stack gap={2} sx={{ pt: { xs: 3, lg: 4 } }}>
              <Alert severity="info" icon={<WarningIcon fontSize="inherit" />}>
                L’achat de bagages après la réservation revient plus cher. Ajoutez-les maintenant et
                économisez pour vous faire encore plus plaisir pendant votre voyage.
              </Alert>
              <Grid container spacing={2} data-testid="ancillariesPage-options">
                {lccAncillaries
                  .filter((a) => Number(a.price) > 0)
                  .map((ancillary, index) => (
                    <LccAncilliaryService
                      key={index}
                      ancillaryService={ancillary}
                      onSelectService={(service) => {
                        passengers
                          .filter((p) => ['ADT', 'CHD'].includes(p.type))
                          .forEach((p) => {
                            p.ancillaries.push(service)
                          })
                        setPassengers((prev) => [...prev])
                      }}
                      onUnselectService={(service) => {
                        passengers
                          .filter((p) => ['ADT', 'CHD'].includes(p.type))
                          .forEach((p) => {
                            p.ancillaries = p.ancillaries.filter(
                              (anc) =>
                                !(
                                  anc.code === service.code &&
                                  anc.price === service.price &&
                                  anc.baggageWeight === service.baggageWeight &&
                                  anc.price === service.price
                                ),
                            )
                          })
                        setPassengers((prev) => [...prev])
                      }}
                      selected={passengers[0].ancillaries.some(
                        (anc) =>
                          anc.code === ancillary.code &&
                          anc.price === ancillary.price &&
                          anc.baggageWeight === ancillary.baggageWeight &&
                          anc.price === ancillary.price,
                      )}
                      disabled={
                        isLoading ||
                        (!passengers[0].ancillaries.some(
                          (anc) =>
                            anc.code === ancillary.code &&
                            anc.price === ancillary.price &&
                            anc.baggageWeight === ancillary.baggageWeight &&
                            anc.price === ancillary.price,
                        ) &&
                          passengers[0].ancillaries.length > 0)
                      }
                    />
                  ))}
              </Grid>
            </Stack>
          </SimpleContainer>
        )}
      <BookingStepActions
        onContinue={handleSubmit}
        onGoBack={goPreviousStep}
        isLoading={isLoading}
      />
    </>
  )
}
