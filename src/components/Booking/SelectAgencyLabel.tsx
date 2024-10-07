'use client'

import React from 'react'
import { useAgencySelector } from '@/contexts'
import { SectionContainer } from '@/components'
import { Box, Stack, Typography } from '@mui/material'

type SelectAgencyLabelProps = {
  openSelectionAgency: () => void
}

export const SelectAgencyLabel = ({ openSelectionAgency }: SelectAgencyLabelProps) => {
  const { selectedAgency } = useAgencySelector()

  return (
    <Box>
      {!selectedAgency && (
        <Typography
          sx={{
            cursor: {
              xs: 'none',
              lg: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
          }}
          data-testid="selectAgencyLabel-changeAgency"
          variant="titleSm"
          color="grey.600"
          onClick={() => openSelectionAgency()}>
          Veuillez sélectionner votre agence en ligne
        </Typography>
      )}
      {selectedAgency && (
        <Stack direction="row">
          <Typography
            data-testid="selectAgencyLabel-changeAgency"
            variant="titleSm"
            color="grey.600">
            Agence {selectedAgency.name}{' '}
          </Typography>
          <Typography
            data-testid="selectAgencyLabel-changeAgency"
            variant="titleSm"
            color="grey.600"
            sx={{
              cursor: {
                xs: 'none',
                lg: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                },
              },
            }}
            onClick={() => openSelectionAgency()}>
            {' '}
            - Changer d'agence
          </Typography>
        </Stack>
      )}
    </Box>
  )
}
