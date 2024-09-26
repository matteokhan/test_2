'use client'

import { Box, Button, IconButton, Paper, Stack, Typography } from '@mui/material'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBack from '@mui/icons-material/ArrowBack'
import { ItineraryRoute } from '@/components'
import { useBooking, useFlights } from '@/contexts'
import { MouseEventHandler } from 'react'
import { useLocationData } from '@/services'
import { locationName } from '@/utils'
import { Solution } from '@/types'

type BaseFlightDetailsProps = {
  isLoading?: boolean
  onClose: MouseEventHandler<HTMLButtonElement>
  withControls?: boolean
}

type FlightDetailsWithControls = BaseFlightDetailsProps & {
  withControls?: true
  onSelectFlight: ({ flight }: { flight: Solution }) => void
}

type FlightDetailsWithoutControls = BaseFlightDetailsProps & {
  withControls?: false
  onSelectFlight?: never
}

type FlightDetailsProps = FlightDetailsWithControls | FlightDetailsWithoutControls

export const FlightDetails = ({
  isLoading,
  onClose,
  onSelectFlight,
  withControls = true,
}: FlightDetailsProps) => {
  const { preSelectedFlight } = useBooking()

  const departure = preSelectedFlight?.routes[0]?.segments[0]?.departure
  const arrival =
    preSelectedFlight?.routes[0]?.segments[preSelectedFlight?.routes[0]?.segments?.length - 1]
      ?.arrival

  const { data: departureLocationData } = useLocationData({
    locationCode: departure ? departure : '',
  })
  const { data: arrivalLocationData } = useLocationData({ locationCode: arrival ? arrival : '' })

  return (
    <>
      {preSelectedFlight && (
        <>
          {/* Desktop */}
          <Stack
            width="544px"
            bgcolor="grey.200"
            height="100%"
            justifyContent="space-between"
            sx={{ display: { xs: 'none', lg: 'flex' } }}
            data-testid="flightDetails">
            <Stack overflow="hidden">
              <Paper elevation={2} sx={{ borderRadius: 0, py: 1.5, px: 2, zIndex: 10 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Stack direction="row" gap={1} alignItems="center">
                    <Typography variant="titleMd" data-testid="flightDetails-departure">
                      {locationName(departureLocationData)} ({departure})
                    </Typography>
                    <SwapHorizIcon data-testid={null} />
                    <Typography variant="titleMd" data-testid="flightDetails-arrival">
                      {locationName(arrivalLocationData)} ({arrival})
                    </Typography>
                  </Stack>
                  <IconButton
                    aria-label="close"
                    onClick={onClose}
                    data-testid="flightDetails-close">
                    <CloseIcon data-testid={null} />
                  </IconButton>
                </Stack>
              </Paper>
              <Stack px={4} py={2} gap={2} overflow="scroll" flexGrow={1}>
                <Stack gap={1} data-testid="flightDetails-itinerary">
                  <Stack height="37px" justifyContent="center">
                    <Typography variant="titleMd">Détails du voyage</Typography>
                  </Stack>
                  {preSelectedFlight.routes.map((route) => (
                    <ItineraryRoute key={route.id} route={route} />
                  ))}
                </Stack>
              </Stack>
            </Stack>
            {withControls && onSelectFlight && (
              <Paper elevation={2} sx={{ borderRadius: 0, p: 2 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Box>
                    <Typography
                      variant="headlineSm"
                      color="primary.main"
                      height="30px"
                      data-testid="flightDetails-price">
                      {preSelectedFlight.priceInfo.total.toFixed(2)}{' '}
                      {preSelectedFlight.priceInfo.currencySymbol}{' '}
                    </Typography>
                    <Typography variant="bodySm" color="grey.800">
                      A partir de
                    </Typography>
                  </Box>
                  <Button
                    disabled={isLoading}
                    variant="contained"
                    size="medium"
                    sx={{ height: 'auto', width: '128px' }}
                    onClick={() => onSelectFlight({ flight: preSelectedFlight })}
                    data-testid="flightDetails-selectFlightButton">
                    Sélectionner
                  </Button>
                </Stack>
              </Paper>
            )}
          </Stack>

          {/* Mobile */}
          <Stack
            sx={{ display: { xs: 'flex', lg: 'none' } }}
            width="100%"
            bgcolor="grey.200"
            height="100%"
            justifyContent="space-between">
            <Stack overflow="hidden">
              <Paper elevation={2} sx={{ borderRadius: 0, py: 3, px: 2, zIndex: 10 }}>
                <Stack direction="row" gap={1}>
                  <IconButton
                    aria-label="close"
                    onClick={onClose}
                    data-testid="flightDetailsMobile-close"
                    sx={{ color: '#49454F', padding: 0 }}>
                    <ArrowBack data-testid={null} />
                  </IconButton>
                  <Stack direction="row" gap={1} alignItems="center">
                    <Typography variant="titleMd" sx={{ textWrap: 'nowrap' }}>
                      {locationName(departureLocationData)} ({departure})
                    </Typography>
                    <SwapHorizIcon data-testid={null} />
                    <Typography variant="titleMd" sx={{ textWrap: 'nowrap' }}>
                      {locationName(arrivalLocationData)} ({arrival})
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
              <Stack px={2} py={2} gap={2} overflow="scroll" flexGrow={1}>
                <Stack gap={1}>
                  <Stack height="37px" justifyContent="center">
                    <Typography variant="titleMd">Détails du voyage</Typography>
                  </Stack>
                  {preSelectedFlight.routes.map((route) => (
                    <ItineraryRoute key={route.id} route={route} />
                  ))}
                </Stack>
              </Stack>
            </Stack>
            {withControls && onSelectFlight && (
              <Paper elevation={2} sx={{ borderRadius: 0, p: 2 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Box>
                    <Typography
                      variant="headlineSm"
                      color="primary.main"
                      height="30px"
                      data-testid="flightDetails-price">
                      {preSelectedFlight.priceInfo.total.toFixed(2)}{' '}
                      {preSelectedFlight.priceInfo.currencySymbol}{' '}
                    </Typography>
                    <Typography variant="bodySm" color="grey.800">
                      A partir de
                    </Typography>
                  </Box>
                  <Button
                    disabled={isLoading}
                    variant="contained"
                    size="medium"
                    sx={{ height: 'auto', width: '128px' }}
                    onClick={() => onSelectFlight({ flight: preSelectedFlight })}
                    data-testid="flightDetails-selectFlight">
                    Sélectionner
                  </Button>
                </Stack>
              </Paper>
            )}
          </Stack>
        </>
      )}
    </>
  )
}
