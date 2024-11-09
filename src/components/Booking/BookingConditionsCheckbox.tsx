'use client'

import { Box, Checkbox, Stack, Typography } from '@mui/material'
import './BookingConditionsCheckbox.css'

export const BookingConditionsCheckbox = ({
  checked,
  onChange,
  destination,
  onFormalitiesClick,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  destination?: string
  onFormalitiesClick?: () => void
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
          {destination && (
            <li onClick={onFormalitiesClick}>
              <Typography
                variant="bodySm"
                color="grey.800"
                sx={{ cursor: 'pointer', textDecoration: 'underline' }}>
                Les formalités {destination}
              </Typography>
            </li>
          )}
        </ul>
      </Box>
    </Stack>
  )
}
