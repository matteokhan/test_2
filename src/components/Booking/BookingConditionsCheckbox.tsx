'use client'

import { Box, Checkbox, Stack, Typography } from '@mui/material'
import './BookingConditionsCheckbox.css'

export const BookingConditionsCheckbox = ({
  checked,
  onChange,
  destination,
  onFormalitiesClick,
  onChildrenFormalitiesClick,
  withChildren,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  destination?: string
  onFormalitiesClick?: () => void
  onChildrenFormalitiesClick?: () => void
  withChildren?: boolean
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
              Commande avec obligation de paiement
            </Typography>
          </li>
          <li>
            <a
              target="_blank"
              rel="noopener"
              href="https://www.leclercvoyages.com/editoContent?code=conditions_generales_de_vente">
              <Typography variant="bodySm" color="grey.800">
                Les conditions générales de vente
              </Typography>
            </a>
          </li>
          <li>
            <a
              target="_blank"
              rel="noopener"
              href="https://www.leclercvoyages.com/editoContent?code=conditions_particulieres_elv">
              <Typography variant="bodySm" color="grey.800">
                Les conditions particulières de vente Leclerc Voyages
              </Typography>
            </a>
          </li>
          {destination && (
            <li onClick={onFormalitiesClick}>
              <Typography
                variant="bodySm"
                color="grey.800"
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                Les formalités {destination}
              </Typography>
            </li>
          )}
          {withChildren && (
            <li onClick={onChildrenFormalitiesClick}>
              <Typography
                variant="bodySm"
                color="grey.800"
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                Les formalités pour les enfants
              </Typography>
            </li>
          )}
        </ul>
      </Box>
    </Stack>
  )
}
