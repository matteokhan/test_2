'use client'

import React, { useEffect } from 'react'
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
  const [outboundSelected, setOutboundSelected] = React.useState<boolean>(outboundService.selected)
  const [inboundSelected, setInboundSelected] = React.useState<boolean>(
    inboundService?.selected || false,
  )
  const isSelected = outboundSelected || inboundSelected

  useEffect(() => {
    if (outboundSelected) {
      onSelectService(outboundService)
    } else {
      onUnselectService(outboundService)
    }
  }, [outboundSelected])

  useEffect(() => {
    if (inboundService) {
      if (inboundSelected) {
        onSelectService(inboundService)
      } else {
        onUnselectService(inboundService)
      }
    }
  }, [inboundSelected])

  return (
    <Grid item xs={12} sm={6}>
      <Stack border="1px solid" borderColor="grey.400" borderRadius="6px" flexGrow={1} width="100%">
        <Stack sx={{ p: 2 }} flexGrow={1}>
          <Typography variant="headlineMd" sx={{ fontSize: '16px !important', pb: 0.5 }}>
            {outboundService.name}
          </Typography>
          <Typography variant="bodySm" color="grey.700">
            À placer dans le compartiment supérieur - Max 158 cm ( hauteur + largeur + longueur)
          </Typography>
          <Stack pt={1} direction="row" gap={1}>
            <FormControlLabel
              disabled={disabled}
              control={
                <Checkbox
                  sx={{ ml: 0 }}
                  checked={outboundSelected}
                  data-testid="bookingConditionsCheckbox"
                  onChange={(ev) => setOutboundSelected(ev.target.checked)}
                />
              }
              label="Aller"
            />
            {inboundService !== undefined && (
              <FormControlLabel
                disabled={disabled}
                control={
                  <Checkbox
                    checked={inboundSelected}
                    data-testid="bookingConditionsCheckbox"
                    onChange={(ev) => setInboundSelected(ev.target.checked)}
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
              +{outboundService.price}€
            </Typography>
            <Typography variant="bodySm" noWrap>
              par trajet
            </Typography>
          </Box>
          <Button
            disabled={disabled}
            data-testid="insuranceOption-selectButton"
            sx={{ px: 3 }}
            variant={isSelected ? 'contained' : 'outlined'}
            onClick={() => {
              if (isSelected) {
                setInboundSelected(false)
                setOutboundSelected(false)
              } else {
                setInboundSelected(true)
                setOutboundSelected(true)
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
