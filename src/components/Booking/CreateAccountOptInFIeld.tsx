'use client'

import { Box, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material'
import { Field, FieldInputProps } from 'formik'

const CreateAccountOptIn = ({ ...props }: FieldInputProps<boolean>) => {
  return <FormControlLabel {...props} control={<Checkbox />} label />
}

export const CreateAccountOptInField = ({ name }: { name: string }) => {
  return (
    <Stack direction="row" alignItems="flex-start" pl={1}>
      <Field name={name} as={CreateAccountOptIn} />
      <Box position="relative" top="6px" right="8px">
        <Typography variant="bodySm" color="grey.800">
          Cochez cette case pour créer votre compte E.Leclerc Voyages afin de profiter de tous nos
          services en ligne. Vous déclarez avoir lu et accepter nos conditions d'utilisation du
          service.
        </Typography>
        <Typography variant="bodySm" color="grey.800" position="relative" top="6px">
          Vous recevrez un email à la fin de votre réservation vous permettant de finaliser la
          création.
        </Typography>
      </Box>
    </Stack>
  )
}
