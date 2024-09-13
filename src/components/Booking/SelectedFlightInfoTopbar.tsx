'use client'

import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { SectionContainer } from '@/components'
import Link from 'next/link'
import { useFlights } from '@/contexts'
import { useAirportData } from '@/services'
import { airportName } from '@/utils'
import dayjs from 'dayjs'

export const SelectedFlightInfoTopbar = () => {
  const { firstSegment, lastSegment, totalPassengers, setFlightDetailsOpen } = useFlights()

  const { data: departureAirportData } = useAirportData({
    airportCode: firstSegment?.from ? firstSegment.from : '',
  })
  const { data: arrivalAirportData } = useAirportData({
    airportCode: lastSegment?.from ? lastSegment.from : '',
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
                    {airportName(departureAirportData)} ({firstSegment?.from})
                  </Typography>
                  <SwapHorizIcon data-testid={null} />
                  <Typography variant="titleMd" data-testid="selectedFlightInfoTopbar-to">
                    {airportName(arrivalAirportData)} ({lastSegment?.from})
                  </Typography>
                </Stack>
                <Stack direction="row" gap={1}>
                  <Typography
                    variant="bodyMd"
                    data-testid="selectedFlightInfoTopbar-depatureArrivalDates">
                    Du {dayjs(firstSegment?.date).format('DD-MM')} au{' '}
                    {dayjs(lastSegment?.date).format('DD-MM')}
                    {}
                  </Typography>
                  <Typography variant="bodyMd">-</Typography>
                  <Typography
                    variant="bodyMd"
                    data-testid="selectedFlightInfoTopbar-totalPassengers">
                    {totalPassengers} voyageurs
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
