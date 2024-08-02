'use client'

import { Box, Button, IconButton, Paper, Stack, Typography } from '@mui/material'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import CloseIcon from '@mui/icons-material/Close'
import { ItineraryRoute } from '@/components'
import { useBooking } from '@/contexts'
import { MouseEventHandler } from 'react'
import { useRouter } from 'next/navigation'

export const FlightDetails = ({ onClose }: { onClose: MouseEventHandler<HTMLButtonElement> }) => {
  const { preSelectedFlight, setSelectedFlight, steps, setCurrentStep } = useBooking()
  const router = useRouter()

  const selectFlight = () => {
    setSelectedFlight(preSelectedFlight)
    setCurrentStep(0)
    router.push(steps[0].url)
  }

  return (
    <Stack width="444px" bgcolor="grey.200" height="100%" justifyContent="space-between">
      <Stack overflow="hidden">
        <Paper elevation={2} sx={{ borderRadius: 0, py: 1.5, px: 2, zIndex: 10 }}>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row" gap={1} alignItems="center">
              {/* TODO: hardcoded data */}
              <Typography variant="titleMd">HARDCODED (PAR)</Typography>
              <SwapHorizIcon />
              <Typography variant="titleMd">HARDCODED (PAR)</Typography>
            </Stack>
            <IconButton aria-label="close" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </Paper>
        <Stack px={4} py={2} gap={2} overflow="scroll" flexGrow={1}>
          <Stack gap={1}>
            <Stack height="37px" justifyContent="center">
              <Typography variant="titleMd">Détails du voyage</Typography>
            </Stack>
            {preSelectedFlight?.routes.map((route) => (
              <ItineraryRoute key={route.id} route={route} />
            ))}
          </Stack>
        </Stack>
      </Stack>
      <Paper elevation={2} sx={{ borderRadius: 0, p: 2 }}>
        <Stack direction="row" justifyContent="space-between">
          <Box>
            {/* TODO: fix per person price */}
            <Typography variant="headlineSm" color="primary.main" height="30px">
              {preSelectedFlight?.priceInfo.total} {preSelectedFlight?.priceInfo.currencySymbol}{' '}
            </Typography>
            <Typography variant="bodySm" color="grey.800">
              Par personne
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="medium"
            sx={{ height: 'auto', width: '128px' }}
            onClick={selectFlight}>
            Sélectionner
          </Button>
        </Stack>
      </Paper>
    </Stack>
  )
}
