'use client'

import { useBooking, useFlights } from '@/contexts'
import { Box, Paper, Stack, Typography } from '@mui/material'
import Image from 'next/image'

export const PurchaseDetails = () => {
  const { totalPassengers } = useFlights()
  const { selectedFlight, totalPrice, selectedInsurance } = useBooking()
  return (
    <Paper
      sx={{ paddingX: 4, paddingBottom: 4, paddingTop: 3, width: '389px' }}
      data-testid="purchaseDetails">
      <Typography variant="titleLg" paddingBottom={2}>
        Détails du prix
      </Typography>
      <Stack pt={1} gap={1} pb={2}>
        <Stack direction="row" width="100%" justifyContent="space-between">
          <Typography variant="bodyMd" data-testid="purchaseDetails-totalPassengers">
            {totalPassengers} x passager(s)
          </Typography>
          <Typography
            variant="bodyMd"
            fontWeight={500}
            data-testid="purchaseDetails-passengersPrice">
            {selectedFlight?.priceInfo.total} {selectedFlight?.priceInfo.currencySymbol}
          </Typography>
        </Stack>
        {/* TODO: make this dynamic when baggages enabled */}
        {/* <Stack direction="row" width="100%" justifyContent="space-between">
          <Typography variant="bodyMd" data-testid="purchaseDetails-baggages">
            1 x bagage(s) à main
          </Typography>
          <Typography variant="bodyMd" fontWeight={500} data-testid="purchaseDetails-baggagesPrice">
            Inclus
          </Typography>
        </Stack> */}
        {/* TODO: make this dynamic when insurances enabled */}
        {selectedInsurance && (
          <Stack direction="row" width="100%" justifyContent="space-between">
            <Typography variant="bodyMd" data-testid="purchaseDetails-insurances">
              1 x assurance voyage
            </Typography>
            <Typography
              variant="bodyMd"
              fontWeight={500}
              data-testid="purchaseDetails-insurancesPrice">
              {selectedInsurance.amount * totalPassengers}€
            </Typography>
          </Stack>
        )}
        {/* TODO: make this dynamic when options enabled */}
        {/* <Stack direction="row" width="100%" justifyContent="space-between">
          <Typography variant="bodyMd" data-testid="purchaseDetails-options">
            1 x offre(s) de service Premium
          </Typography>
          <Typography variant="bodyMd" fontWeight={500} data-testid="purchaseDetails-optionsPrice">
            0€
          </Typography>
        </Stack> */}
        {/* TODO: make this dynamic when seats enabled */}
        {/* <Stack direction="row" width="100%" justifyContent="space-between">
          <Typography variant="bodyMd" data-testid="purchaseDetails-seats">
            1x siège(s) (SYD - DEL)
          </Typography>
          <Typography variant="bodyMd" fontWeight={500} data-testid="purchaseDetails-seatsPrice">
            0€
          </Typography>
        </Stack> */}
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
          <Typography
            variant="headlineSm"
            color="primary.main"
            data-testid="purchaseDetails-totalPrice">
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
