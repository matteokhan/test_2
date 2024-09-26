'use client'

import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { SectionContainer } from '@/components'
import Link from 'next/link'
import { useFlights } from '@/contexts'
import { useLocationData } from '@/services'
import { locationName } from '@/utils'
import dayjs from 'dayjs'

export const SelectedFlightInfoTopbar = () => {
  const { firstSegment, lastSegment, totalPassengers, setFlightDetailsOpen, isOneWay } =
    useFlights()

  // Depending on whether the flight is round trip or one way, the departure location and
  // destination location will be different'
  const departureLocation = firstSegment ? firstSegment.from : ''
  const departureDate = firstSegment ? firstSegment.date : ''
  const destinationLocation = lastSegment ? (isOneWay ? lastSegment.to : lastSegment?.from) : ''
  const destinationDate = lastSegment ? (isOneWay ? lastSegment.date : lastSegment?.date) : ''

  const { data: departureLocationData } = useLocationData({
    locationCode: departureLocation,
  })
  const { data: arrivalLocationData } = useLocationData({
    locationCode: destinationLocation,
  })

  return (
    <Box
      sx={{
        borderRadius: 0,
        borderBottom: 1,
        borderColor: 'grey.200',
      }}>
      <SectionContainer
        sx={{
          height: 60,
          alignItems: 'center',
          gap: 0.8,
        }}>
        <Stack width="100%" height="56px" alignItems="center" direction="row">
          <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
            <Link
              href="/flights"
              style={{ textDecoration: 'none' }}
              data-testid="selectedFlightInfoTopbar-goToFlightsButton">
              <Stack
                direction="row"
                alignItems="center"
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}>
                <IconButton aria-label="back" color="primary">
                  <ArrowBackIcon data-testid={null} />
                </IconButton>
                <Typography
                  variant="labelLg"
                  color="primary"
                  ml={1}
                  sx={{
                    '&:hover': {
                      cursor: 'pointer',
                    },
                  }}>
                  Retour aux résultats
                </Typography>
              </Stack>
            </Link>
            <Stack direction="row" gap={1}>
              <Stack direction="row" gap={2} alignItems="center">
                <Stack direction="row" gap={1}>
                  <Typography variant="titleMd" data-testid="selectedFlightInfoTopbar-from">
                    {locationName(departureLocationData)} ({departureLocation})
                  </Typography>
                  <SwapHorizIcon data-testid={null} />
                  <Typography variant="titleMd" data-testid="selectedFlightInfoTopbar-to">
                    {locationName(arrivalLocationData)} ({destinationLocation})
                  </Typography>
                </Stack>
                <Stack direction="row" gap={1}>
                  {isOneWay && (
                    <Typography
                      variant="bodyMd"
                      data-testid="selectedFlightInfoTopbar-depatureArrivalDates">
                      Le {dayjs(departureDate).format('DD-MM')}
                    </Typography>
                  )}
                  {!isOneWay && (
                    <Typography
                      variant="bodyMd"
                      data-testid="selectedFlightInfoTopbar-depatureArrivalDates">
                      Du {dayjs(departureDate).format('DD-MM')} au{' '}
                      {dayjs(destinationDate).format('DD-MM')}
                    </Typography>
                  )}
                  <Typography variant="bodyMd">-</Typography>
                  <Typography
                    variant="bodyMd"
                    data-testid="selectedFlightInfoTopbar-totalPassengers">
                    {totalPassengers} {totalPassengers > 1 ? 'voyageurs' : 'voyageur'}
                  </Typography>
                  {/* TODO: Fix baggages */}
                  {/* <Typography variant="bodyMd">-</Typography>
                  <Typography variant="bodyMd" data-testid="selectedFlightInfoTopbar-baggages">
                    N bagages
                  </Typography> */}
                </Stack>
              </Stack>
              <Button onClick={() => setFlightDetailsOpen(true)}>Voir le détail du vol</Button>
            </Stack>
          </Stack>
        </Stack>
      </SectionContainer>
    </Box>
  )
}
