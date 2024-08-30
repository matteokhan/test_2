'use client'

import { Agency } from '@/types'
import { Box, Stack, Typography, Paper, Button } from '@mui/material'

type SelectAgencyBaseProps = {
  agency: Agency
  onChange?: () => void
  onSelect?: ({ agency }: { agency: Agency }) => void
  isSelected?: boolean
}

type SelectAgencySelectedProps = {
  isSelected: true
  onChange: () => void
}

type SelectAgencyNotSelectedProps = {
  isSelected?: false
  onSelect: ({ agency }: { agency: Agency }) => void
}

type SelectAgencyProps = SelectAgencyBaseProps &
  (SelectAgencySelectedProps | SelectAgencyNotSelectedProps)

export const SelectAgency = ({ onChange, onSelect, agency, isSelected }: SelectAgencyProps) => {
  return (
    <Paper
      sx={{ border: '1px solid', borderColor: 'grey.400', p: 2, maxWidth: '590px' }}
      data-testid="selectAgency">
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
        <Box>
          <Typography variant="titleMd" data-testid="selectAgency-name">
            {agency.name}
          </Typography>
          <Typography variant="bodySm" color="grey.700" data-testid="selectAgency-address">
            {agency.address}
          </Typography>
          <Typography variant="bodySm" color="grey.700" data-testid="selectAgency-address2">
            {agency.address2}
          </Typography>
          <Typography variant="bodySm" color="grey.700" data-testid="selectAgency-phone">
            Tel {agency.phone}
          </Typography>
        </Box>
        <Stack direction="row" pl={1.5} gap={1}>
          <Button variant="text" sx={{ px: 3 }} data-testid="selectAgency-seeDetailsButton">
            Voir les infos
          </Button>
          {isSelected && (
            <Button
              variant="outlined"
              sx={{ px: 3 }}
              onClick={() => onChange()}
              data-testid="selectAgency-changeAgencyButton">
              Changer d'agence
            </Button>
          )}
          {!isSelected && (
            <Button
              variant="outlined"
              sx={{ px: 3 }}
              onClick={() => onSelect({ agency })}
              data-testid="selectAgency-selectAgencyButton">
              Sélectionner
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  )
}
