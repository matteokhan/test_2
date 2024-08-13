'use client'

import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { SectionContainer } from '@/components'
import Link from 'next/link'
import { useFlights } from '@/contexts'

export const SelectedFlightInfoTopbar = () => {
  const { firstSegment, lastSegment, totalPassengers } = useFlights()
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
            {/* TODO: hardcoded data here */}
            <Stack direction="row" gap={1}>
              <Stack direction="row" gap={2} alignItems="center">
                <Stack direction="row" gap={1}>
                  <Typography variant="titleMd" data-testid="selectedFlightInfoTopbar-from">
                    {firstSegment?.from} ({firstSegment?.from})
                  </Typography>
                  <SwapHorizIcon data-testid={null} />
                  <Typography variant="titleMd" data-testid="selectedFlightInfoTopbar-to">
                    {lastSegment?.to} ({lastSegment?.to})
                  </Typography>
                </Stack>
                <Stack direction="row" gap={1}>
                  {/* TODO: Fix return date */}
                  <Typography
                    variant="bodyMd"
                    data-testid="selectedFlightInfoTopbar-depatureArrivalDates">
                    Du {firstSegment?.date.substring(5)} au {lastSegment?.date?.substring(5)}
                  </Typography>
                  <Typography variant="bodyMd">-</Typography>
                  <Typography
                    variant="bodyMd"
                    data-testid="selectedFlightInfoTopbar-totalPassengers">
                    {totalPassengers} voyageurs
                  </Typography>
                  {/* TODO: Fix baggages */}
                  <Typography variant="bodyMd">-</Typography>
                  <Typography variant="bodyMd" data-testid="selectedFlightInfoTopbar-baggages">
                    N bagages
                  </Typography>
                </Stack>
              </Stack>
              {/* TODO: Show flight details */}
              <Button>Voir le détail du vol</Button>
            </Stack>
          </Stack>
        </Stack>
      </SectionContainer>
    </Box>
  )
}
