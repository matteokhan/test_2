'use client'

import React from 'react'
import { Box, Stack, Grid, Typography, Button } from '@mui/material'
import { LCCAncillary } from '@/types'
import CheckIcon from '@mui/icons-material/Check'

const getLccAncillaryRouteCoverage = (ancillaryService: LCCAncillary) => {
  switch (ancillaryService.legIndex) {
    case 0:
      return 'Aller - Retour'
    case 1:
      return 'Aller uniquement'
    default:
      return 'Retour uniquement'
  }
}

export const LccAncilliaryService = ({
  disabled,
  ancillaryService,
  onSelectService,
  onUnselectService,
  selected,
}: {
  disabled?: boolean
  ancillaryService: LCCAncillary
  onSelectService: (service: LCCAncillary) => void
  onUnselectService: (service: LCCAncillary) => void
  selected: boolean
}) => {
  return (
    <Grid item xs={12} sm={6}>
      <Stack border="1px solid" borderColor="grey.400" borderRadius="6px" flexGrow={1} width="100%">
        <Stack sx={{ p: 2 }} flexGrow={1} data-testid="ancillaryService-item">
          <Typography variant="headlineMd" sx={{ fontSize: '16px !important', pb: 0.5 }}>
            {`${ancillaryService.baggagePieces} baggages pour ${ancillaryService.baggageWeight}kg maximum`}
          </Typography>
          <Stack pt={1} direction="row" gap={1}>
            <Typography>{getLccAncillaryRouteCoverage(ancillaryService)}</Typography>
          </Stack>
        </Stack>
        <Stack
          borderTop="1px solid"
          borderColor="grey.400"
          py={2}
          sx={{ px: 2 }}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          flexShrink={0}>
          <Box>
            <Typography variant="titleLg" color="primary" data-testid="insuranceOption-price">
              +{Number(ancillaryService.price).toFixed(2)}€
            </Typography>
          </Box>
          <Button
            disabled={disabled}
            data-testid="insuranceOption-selectButton"
            sx={{ px: 3 }}
            variant={selected ? 'contained' : 'outlined'}
            onClick={() => {
              if (selected) {
                onUnselectService(ancillaryService)
              } else {
                onSelectService(ancillaryService)
              }
            }}
            startIcon={selected ? <CheckIcon /> : null}>
            {selected ? 'Sélectionné' : 'Sélectionner'}
          </Button>
        </Stack>
      </Stack>
    </Grid>
  )
}
