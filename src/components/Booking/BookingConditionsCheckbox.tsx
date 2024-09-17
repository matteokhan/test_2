'use client'

import { Box, Checkbox, Stack, Typography } from '@mui/material'
import './BookingConditionsCheckbox.css'

export const BookingConditionsCheckbox = ({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
}) => {
  return (
    <Stack direction="row" alignItems="flex-start">
      <Checkbox
        checked={checked}
        data-testid="bookingConditionsCheckbox"
        onChange={(ev) => onChange(ev.target.checked)}
      />
      <Box position="relative" top="6px" left="14px">
        <ul>
          <li>
            <Typography variant="bodySm" color="grey.800">
              Les conditions générales de vente
            </Typography>
          </li>
          <li>
            <Typography variant="bodySm" color="grey.800">
              Les conditions particulières de vente Leclerc Voyages
            </Typography>
          </li>
          <li>
            <Typography variant="bodySm" color="grey.800">
              Les conditions particulières de vente de l’organisateur technique
            </Typography>
          </li>
          <li>
            <Typography variant="bodySm" color="grey.800">
              Les formalités Tunisie
            </Typography>
          </li>
        </ul>
      </Box>
    </Stack>
  )
}
