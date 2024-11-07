'use client'

import { useAgencySelector, useBooking, useFlights } from '@/contexts'
import { getFareData, getPaymentMethodData } from '@/utils'
import { Box, Paper, Stack, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import React from 'react'

type PurchaseDetailsProps = {
  onClose?: () => void
}

export const PurchaseDetails = ({ onClose }: PurchaseDetailsProps) => {
  const { totalPassengers } = useFlights()
  const { totalPrice, totalInsurancePrice, selectedInsurance, selectedFare, ancillaries } =
    useBooking()
  const { selectedAgency } = useAgencySelector()

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
                {selectedFare.priceInfo.total.toFixed(2)} €
              </Typography>
            </Stack>
            <Stack ml={2} gap={1}>
              {getFareData(selectedFare).services.map((service, index) => (
                <Stack direction="row" width="100%" justifyContent="space-between" key={index}>
                  <Typography variant="bodyMd">{service.name}</Typography>
                </Stack>
              ))}
            </Stack>
          </>
        )}
        {ancillaries.map((ancillary, ancillaryIndex) => (
          <React.Fragment key={ancillaryIndex}>
            {ancillary.segments.some((s) => s.ancillaries.some((a) => a.selected)) && (
              <Typography variant="bodyMd">
                Passenger {ancillary.passenger} - Ancillaries
              </Typography>
            )}
            {ancillary.segments
              .filter((segment) => segment.ancillaries.some((a) => a.selected))
              .map((segment, segmentIndex) => (
                <React.Fragment key={`${ancillaryIndex}-${segmentIndex}`}>
                  {segment.ancillaries
                    .filter((a) => a.selected)
                    .map((ancillary) => (
                      <Stack
                        key={`${ancillaryIndex}-${segmentIndex}-${ancillary.externalId}`}
                        data-testid="purchaseDetails-ancillary"
                        ml={2}>
                        <Stack direction="row" width="100%" justifyContent="space-between">
                          <Typography variant="bodyMd" data-testid="purchaseDetails-ancillary-name">
                            {ancillary.name} - {segment.segment == '1' && 'Aller'}{' '}
                            {segment.segment == '2' && 'Retour'}
                          </Typography>
                          <Typography
                            variant="bodyMd"
                            fontWeight={500}
                            data-testid="purchaseDetails-ancillary-price">
                            {ancillary.price.toFixed()}€
                          </Typography>
                        </Stack>
                      </Stack>
                    ))}
                </React.Fragment>
              ))}
          </React.Fragment>
        ))}
        {selectedInsurance && (
          <Stack direction="row" width="100%" justifyContent="space-between">
            <Typography variant="bodyMd" data-testid="purchaseDetails-insurances">
              {totalPassengers} x assurance voyage
            </Typography>
            <Typography
              variant="bodyMd"
              fontWeight={500}
              data-testid="purchaseDetails-insurancesPrice">
              {totalInsurancePrice.toFixed(2)}€
            </Typography>
          </Stack>
        )}
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
            {totalPrice.toFixed(2)} €
          </Typography>
        </Stack>
        <Typography variant="bodySm" color="grey.700">
          Tous frais, taxes, suppléments et frais de service Leclerc Voyages inclus
        </Typography>
        <Stack direction="row" pt={1} gap={0.75}>
          {selectedAgency?.available_contracts.map((contract) => {
            const { icon } = getPaymentMethodData({ contractCode: contract })
            return (
              <Box
                key={contract}
                sx={{
                  position: 'relative',
                }}>
                {icon}
              </Box>
            )
          })}
        </Stack>
      </Stack>
    </Paper>
  )
}
