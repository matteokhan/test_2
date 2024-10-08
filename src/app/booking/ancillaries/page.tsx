'use client'

import React, { useEffect } from 'react'
import { BookingStepActions, BookingStepActionsMobile, SimpleContainer } from '@/components'
import { useBooking } from '@/contexts'
import {
  Alert,
  Box,
  Stack,
  Grid,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import { useAncillaries, useSelectAncillaries } from '@/services'
import WarningIcon from '@mui/icons-material/Warning'
import { AncillaryServiceInfo } from '@/types'
import CheckIcon from '@mui/icons-material/Check'

const AncilliaryService = ({
  disabled,
  outboundService,
  inboundService,
  onSelectService,
  onUnselectService,
}: {
  disabled?: boolean
  outboundService: AncillaryServiceInfo
  inboundService?: AncillaryServiceInfo
  onSelectService: (service: AncillaryServiceInfo) => void
  onUnselectService: (service: AncillaryServiceInfo) => void
}) => {
  const [outboundSelected, setOutboundSelected] = React.useState<boolean>(outboundService.selected)
  const [inboundSelected, setInboundSelected] = React.useState<boolean>(
    inboundService?.selected || false,
  )
  const isSelected = outboundSelected || inboundSelected

  useEffect(() => {
    if (outboundSelected) {
      onSelectService(outboundService)
    } else {
      onUnselectService(outboundService)
    }
  }, [outboundSelected])

  useEffect(() => {
    if (inboundService) {
      if (inboundSelected) {
        onSelectService(inboundService)
      } else {
        onUnselectService(inboundService)
      }
    }
  }, [inboundSelected])

  return (
    <Grid item xs={12} sm={6}>
      <Stack border="1px solid" borderColor="grey.400" borderRadius="6px" flexGrow={1} width="100%">
        <Stack sx={{ p: 2 }} flexGrow={1}>
          <Typography variant="headlineMd" sx={{ fontSize: '16px !important', pb: 0.5 }}>
            {outboundService.name}
          </Typography>
          <Typography variant="bodySm" color="grey.700">
            À placer dans le compartiment supérieur - Max 158 cm ( hauteur + largeur + longueur)
          </Typography>
          <Stack pt={1} direction="row" gap={1}>
            <FormControlLabel
              disabled={disabled}
              control={
                <Checkbox
                  sx={{ ml: 0 }}
                  checked={outboundSelected}
                  data-testid="bookingConditionsCheckbox"
                  onChange={(ev) => setOutboundSelected(ev.target.checked)}
                />
              }
              label="Aller"
            />
            {inboundService !== undefined && (
              <FormControlLabel
                disabled={disabled}
                control={
                  <Checkbox
                    checked={inboundSelected}
                    data-testid="bookingConditionsCheckbox"
                    onChange={(ev) => setInboundSelected(ev.target.checked)}
                  />
                }
                label="Retour"
              />
            )}
          </Stack>
        </Stack>
        <Stack
          borderTop="1px solid"
          borderColor="grey.400"
          py={2}
          sx={{ px: 2 }}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          flexShrink={0}>
          <Box>
            <Typography variant="titleLg" color="primary" data-testid="insuranceOption-price">
              +{outboundService.price}€
            </Typography>
            <Typography variant="bodySm" noWrap>
              par trajet
            </Typography>
          </Box>
          <Button
            disabled={disabled}
            data-testid="insuranceOption-selectButton"
            sx={{ px: 3 }}
            variant={isSelected ? 'contained' : 'outlined'}
            onClick={() => {
              if (isSelected) {
                setInboundSelected(false)
                setOutboundSelected(false)
              } else {
                setInboundSelected(true)
                setOutboundSelected(true)
              }
            }}
            startIcon={isSelected ? <CheckIcon /> : null}>
            {isSelected ? 'Sélectionné' : 'Sélectionner'}
          </Button>
        </Stack>
      </Stack>
    </Grid>
  )
}

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
    if (remoteAncillaries) setAncillaries(remoteAncillaries)
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
      {ancillaries &&
        !isFetching &&
        isSuccess &&
        ancillaries.map((ancillary) => {
          const passengerData = passengers[+ancillary.passenger - 1]
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
              title={`Passenger ${ancillary.passenger} : ${passengerData.firstName} ${passengerData.lastName}`}>
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
                        key={service.code}
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
      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        <BookingStepActions
          onContinue={handleSubmit}
          onGoBack={goPreviousStep}
          isLoading={isLoading}
        />
      </Box>
      <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
        <BookingStepActionsMobile
          onContinue={handleSubmit}
          onGoBack={goPreviousStep}
          isLoading={isLoading}
        />
      </Box>
    </>
  )
}
