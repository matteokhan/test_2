'use client'

import { Agency } from '@/types'
import { Box, Stack, Typography, Paper, Button } from '@mui/material'

type SelectAgencyFormProps = {
  onSelectAgency: ({ agency }: { agency: Agency }) => void
  agencies: Agency[] | undefined
}

export const SelectAgencyForm = ({ onSelectAgency, agencies }: SelectAgencyFormProps) => {
  return (
    <Stack maxWidth="590px" gap={1} data-testid="selectAgencyForm">
      {agencies?.slice(0, 3)?.map((agency) => {
        if (!agency) return
        return (
          <Paper
            sx={{ border: '1px solid', borderColor: 'grey.400', p: 2 }}
            key={agency.id}
            data-testid="selectAgencyForm-agency">
            <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
              <Box>
                <Typography variant="titleMd" data-testid="selectAgencyForm-agency-name">
                  {agency.name}
                </Typography>
                <Typography
                  variant="bodySm"
                  color="grey.700"
                  data-testid="selectAgencyForm-agency-address">
                  {agency.address}
                </Typography>
                <Typography
                  variant="bodySm"
                  color="grey.700"
                  data-testid="selectAgencyForm-agency-address2">
                  {agency.address2}
                </Typography>
                <Typography
                  variant="bodySm"
                  color="grey.700"
                  data-testid="selectAgencyForm-agency-phone">
                  Tel {agency.phone}
                </Typography>
              </Box>
              <Stack direction="row" pl={1.5} gap={1}>
                <Button
                  variant="text"
                  sx={{ px: 3 }}
                  data-testid="selectAgencyForm-agency-seeDetails">
                  Voir les infos
                </Button>
                <Button
                  variant="outlined"
                  sx={{ px: 3 }}
                  onClick={() => onSelectAgency({ agency })}
                  data-testid="selectAgencyForm-agency-selectAgencyButton">
                  Sélectionner
                </Button>
              </Stack>
            </Stack>
          </Paper>
        )
      })}
    </Stack>
  )
}
