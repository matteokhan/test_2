'use client'

import React from 'react'
import { Box, Stack, Grid, Typography, Button, Checkbox, FormControlLabel } from '@mui/material'
import { AncillaryServiceInfo } from '@/types'
import CheckIcon from '@mui/icons-material/Check'

export const AncilliaryService = ({
  disabled,
  outboundService,
  inboundService,
  onSelectService,
  onUnselectService,
}: {
  disabled?: boolean
  outboundService: AncillaryServiceInfo
  inboundService?: AncillaryServiceInfo
  onSelectService: (service: AncillaryServiceInfo) => void
  onUnselectService: (service: AncillaryServiceInfo) => void
}) => {
  const isSelected = outboundService.selected || inboundService?.selected

  return (
    <Grid item xs={12} sm={6}>
      <Stack border="1px solid" borderColor="grey.400" borderRadius="6px" flexGrow={1} width="100%">
        <Stack sx={{ p: 2 }} flexGrow={1} data-testid="ancillaryService-item">
          <Typography variant="headlineMd" sx={{ fontSize: '16px !important', pb: 0.5 }}>
            {outboundService.name}
          </Typography>
          {/* TODO: This will be included on further phases */}
          {/* <Typography variant="bodySm" color="grey.700">
            À placer dans le compartiment supérieur - Max 158 cm ( hauteur + largeur + longueur)
          </Typography> */}
          <Stack pt={1} direction="row" gap={1}>
            <FormControlLabel
              disabled={disabled}
              control={
                <Checkbox
                  sx={{ ml: 0 }}
                  checked={outboundService.selected}
                  data-testid="ancillaryService-outboundCheckbox"
                  onClick={() => {
                    if (!outboundService.selected) {
                      onSelectService(outboundService)
                    } else {
                      onUnselectService(outboundService)
                    }
                  }}
                />
              }
              label="Aller"
            />
            {inboundService !== undefined && (
              <FormControlLabel
                disabled={disabled}
                control={
                  <Checkbox
                    checked={inboundService.selected}
                    data-testid="ancillaryService-inboundCheckbox"
                    onChange={() => {
                      if (!inboundService.selected) {
                        onSelectService(inboundService)
                      } else {
                        onUnselectService(inboundService)
                      }
                    }}
                  />
                }
                label="Retour"
              />
            )}
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
              +{(outboundService.price + (inboundService?.price || 0)).toFixed(2)}€
            </Typography>
          </Box>
          <Button
            disabled={disabled}
            data-testid="insuranceOption-selectButton"
            sx={{ px: 3 }}
            variant={isSelected ? 'contained' : 'outlined'}
            onClick={() => {
              if (isSelected) {
                inboundService && onUnselectService(inboundService)
                onUnselectService(outboundService)
              } else {
                inboundService && onSelectService(inboundService)
                onSelectService(outboundService)
              }
            }}
            startIcon={isSelected ? <CheckIcon /> : null}>
            {isSelected ? 'Sélectionné' : 'Sélectionner'}
          </Button>
        </Stack>
      </Stack>
    </Grid>
  )
}
