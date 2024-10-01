'use client'

import { useBooking, useFlights } from '@/contexts'
import { getFareData } from '@/utils'
import { Box, Paper, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import CloseIcon from '@mui/icons-material/Close'

type PurchaseDetailsProps = {
  onClose?: () => void
}

export const PurchaseDetails = ({ onClose }: PurchaseDetailsProps) => {
  const { totalPassengers } = useFlights()
  const { totalPrice, totalInsurancePrice, selectedInsurance, selectedFare } = useBooking()
  return (
    <Paper
      sx={{
        paddingX: { xs: 2, lg: 4 },
        paddingBottom: 4,
        paddingTop: { xs: 1.5, lg: 3 },
        width: { xs: 'unset', lg: '389px' },
      }}
      data-testid="purchaseDetails">
      <Typography variant="titleLg" paddingBottom={2} sx={{ display: { xs: 'none', lg: 'block' } }}>
        Détails du prix
      </Typography>
      {onClose && (
        <Stack justifyContent="space-between" alignItems="center" direction="row" paddingBottom={2}>
          <Typography variant="titleLg">Détails du prix</Typography>
          <CloseIcon onClick={() => onClose()} />
        </Stack>
      )}
      <Stack pt={1} gap={1} pb={2}>
        {selectedFare && (
          <>
            <Stack direction="row" width="100%" justifyContent="space-between">
              <Typography variant="bodyMd" data-testid="purchaseDetails-totalPassengers">
                {totalPassengers} x passager(s)
              </Typography>
              <Typography
                variant="bodyMd"
                fontWeight={500}
                data-testid="purchaseDetails-passengersPrice">
                {selectedFare.priceInfo.total} €
              </Typography>
            </Stack>
            <Stack ml={2} gap={1}>
              {getFareData(selectedFare).services.map((service) => (
                <Stack
                  direction="row"
                  width="100%"
                  justifyContent="space-between"
                  key={service.name}>
                  <Typography variant="bodyMd">{service.name}</Typography>
                  <Typography variant="bodyMd" fontWeight={500}>
                    inclus
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </>
        )}
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
              {totalPassengers} x assurance voyage
            </Typography>
            <Typography
              variant="bodyMd"
              fontWeight={500}
              data-testid="purchaseDetails-insurancesPrice">
              {totalInsurancePrice}€
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
          alignItems="center"
          display="none">
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
            <Image src="/ancv_logo.svg" alt="ancv logo" fill />
          </Box>
          <Box
            sx={{
              position: 'relative',
              height: 23,
              width: 36,
            }}>
            <Image src="/ob_logo.svg" alt="ob logo" fill />
          </Box>
          <Box
            sx={{
              position: 'relative',
              height: 23,
              width: 36,
              display: 'none',
            }}>
            <Image src="/floa_logo_2.svg" alt="floa logo" fill />
          </Box>
        </Stack>
      </Stack>
    </Paper>
  )
}
