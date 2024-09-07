'use client'

import { Box, Stack, Typography } from '@mui/material'
import { FieldHookConfig, useField } from 'formik'

export const SubscribeNewsletterOptInField = ({ ...props }: FieldHookConfig<boolean>) => {
  const [_, { value: optIn }, { setValue }] = useField(props)
  return (
    <Stack direction="row" alignItems="flex-start">
      <Box>
        {!optIn && (
          <Typography variant="bodySm" color="grey.800">
            Si vous souhaitez recevoir notre newsletter voyage,{' '}
            <span
              style={{ textDecoration: 'underline', cursor: 'pointer' }}
              onClick={() => setValue(true)}>
              cliquez ici
            </span>
            .
          </Typography>
        )}
        {optIn && (
          <Typography variant="bodySm" color="grey.800">
            En validant votre réservation, vous serez inscrit à notre newsletter voyage. Si vous ne
            souhaitez pas recevoir notre newsletter,{' '}
            <span
              style={{ textDecoration: 'underline', cursor: 'pointer' }}
              onClick={() => setValue(false)}>
              cliquez ici
            </span>
            . Vous pouvez à tout moment utiliser le lien de désabonnement intégré dans la
            newsletter.
          </Typography>
        )}
      </Box>
    </Stack>
  )
}
