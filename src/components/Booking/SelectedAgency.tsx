'use client'

import { Agency } from '@/types'
import { Box, Stack, Typography, Paper, Button } from '@mui/material'

type SelectedAgencyProps = {
  onChangeAgency: () => void
  agency: Agency
}

export const SelectedAgency = ({ onChangeAgency, agency }: SelectedAgencyProps) => {
  return (
    <Stack maxWidth="590px" gap={1} data-testid="selectedAgency">
      <Paper
        sx={{ border: '1px solid', borderColor: 'grey.400', p: 2 }}
        data-testid="selectedAgency-agency">
        <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
          <Box>
            <Typography variant="titleMd" data-testid="selectedAgency-agency-name">
              {agency.name}
            </Typography>
            <Typography
              variant="bodySm"
              color="grey.700"
              data-testid="selectedAgency-agency-address">
              {agency.address}
            </Typography>
            <Typography
              variant="bodySm"
              color="grey.700"
              data-testid="selectedAgency-agency-address2">
              {agency.address2}
            </Typography>
            <Typography variant="bodySm" color="grey.700" data-testid="selectedAgency-agency-phone">
              Tel {agency.phone}
            </Typography>
          </Box>
          <Stack direction="row" pl={1.5} gap={1}>
            <Button variant="text" sx={{ px: 3 }} data-testid="selectedAgency-agency-seeDetails">
              Voir les infos
            </Button>
            <Button
              variant="outlined"
              sx={{ px: 3 }}
              onClick={() => onChangeAgency()}
              data-testid="selectedAgency-agency-changeAgencyButton">
              Changer d'agence
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  )
}
