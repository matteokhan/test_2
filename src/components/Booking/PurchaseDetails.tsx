'use client'

import { useBooking, useFlights } from '@/contexts'
import { Box, Paper, Stack, Typography } from '@mui/material'
import Image from 'next/image'

export const PurchaseDetails = () => {
  const { totalPassengers } = useFlights()
  const { selectedFlight, totalPrice } = useBooking()
  return (
    <Paper sx={{ paddingX: 4, paddingBottom: 4, paddingTop: 3, width: '389px' }}>
      <Typography variant="titleLg" paddingBottom={2}>
        Détails du prix
      </Typography>
      <Stack pt={1} gap={1} pb={2}>
        {/* TODO: Fix this pricing */}
        <Stack direction="row" width="100%" justifyContent="space-between">
          <Typography variant="bodyMd">{totalPassengers} x passager(s) (avec réduction)</Typography>
          <Typography variant="bodyMd" fontWeight={500}>
            {selectedFlight?.priceInfo.total} {selectedFlight?.priceInfo.currencySymbol}
          </Typography>
        </Stack>
        {/* TODO: make this dynamic when baggages enabled */}
        <Stack direction="row" width="100%" justifyContent="space-between">
          <Typography variant="bodyMd">1 x bagage(s) à main</Typography>
          <Typography variant="bodyMd" fontWeight={500}>
            Inclus
          </Typography>
        </Stack>
        {/* TODO: make this dynamic when insurances enabled */}
        <Stack direction="row" width="100%" justifyContent="space-between">
          <Typography variant="bodyMd">1 x assurance voyage</Typography>
          <Typography variant="bodyMd" fontWeight={500}>
            0€
          </Typography>
        </Stack>
        {/* TODO: make this dynamic when options enabled */}
        <Stack direction="row" width="100%" justifyContent="space-between">
          <Typography variant="bodyMd">1 x offre(s) de service Premium</Typography>
          <Typography variant="bodyMd" fontWeight={500}>
            0€
          </Typography>
        </Stack>
        {/* TODO: make this dynamic when seats enabled */}
        <Stack direction="row" width="100%" justifyContent="space-between">
          <Typography variant="bodyMd">1x siège(s) (SYD - DEL)</Typography>
          <Typography variant="bodyMd" fontWeight={500}>
            0€
          </Typography>
        </Stack>
      </Stack>
      <Stack pt={1} gap={1.25}>
        <Stack
          pt={2}
          borderTop="1px solid"
          borderColor="grey.400"
          direction="row"
          width="100%"
          justifyContent="space-between"
          alignItems="center">
          <Typography variant="titleMd">Prix total</Typography>
          <Typography variant="headlineSm" color="primary.main">
            {totalPrice} €
          </Typography>
        </Stack>
        <Stack
          px={1}
          py={0.75}
          borderRadius={1}
          bgcolor="leclerc.blueNotif.main"
          direction="row"
          gap={0.75}
          alignItems="center">
          <Typography variant="bodySm">Payez en plusieurs fois avec</Typography>
          <Box
            sx={{
              position: 'relative',
              height: 20,
              width: 55,
            }}>
            <Image src="/floa_logo.svg" alt="floa logo" fill />
          </Box>
        </Stack>
        <Typography variant="bodySm" color="grey.700">
          Tous frais, taxes, suppléments et frais de service Leclerc Voyages inclus
        </Typography>
        <Stack direction="row" pt={1} gap={0.75}>
          <Box
            sx={{
              position: 'relative',
              height: 23,
              width: 36,
            }}>
            <Image src="/ancv_logo.svg" alt="floa logo" fill />
          </Box>
          <Box
            sx={{
              position: 'relative',
              height: 23,
              width: 36,
            }}>
            <Image src="/ob_logo.svg" alt="floa logo" fill />
          </Box>
          <Box
            sx={{
              position: 'relative',
              height: 23,
              width: 36,
            }}>
            <Image src="/floa_logo_2.svg" alt="floa logo" fill />
          </Box>
        </Stack>
      </Stack>
    </Paper>
  )
}
