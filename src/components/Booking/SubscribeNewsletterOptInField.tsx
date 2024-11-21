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
          <>
            <Typography variant="bodySm" color="grey.800">
              En validant votre réservation, vous serez inscrit à notre newsletter voyage. Si vous
              ne souhaitez pas recevoir notre newsletter,{' '}
              <span
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() => setValue(false)}>
                cliquez ici
              </span>
              . Vous pouvez à tout moment utiliser le lien de désabonnement intégré dans la
              newsletter.
            </Typography>
            <Typography variant="bodySm" color="grey.800" style={{ marginTop: '20px' }}>
              La collecte de vos données personnelles est nécessaire pour la gestion de vos demandes
              de prestations. Vos données personnelles sont destinées à l'agence de voyages et à
              l'ensemble de nos partenaires fournisseurs des prestations de services. Nos
              partenaires peuvent être situées hors de l'Union Européenne.Vous disposez d'un droit
              d'accès, d'opposition et de rectification relativement à l'ensemble des données vous
              concernant auprès de votre agence E.Leclerc Voyages, en précisant vos noms, prénom et
              adresse. Vos données personnelles peuvent être conservées durant un délai de 3 ans à
              compter de la fin de la relation commerciale, sous réserve de la conservation des
              documents relatifs aux transactions commerciales qui sont conservés conformément à la
              loi durant 6 ans. Avec votre consentement, elles pourront vous permettre de recevoir
              des offres promotionnelles ou commerciales, par courrier électronique ou postal, de
              notre part ou de la part d'autres sociétés du mouvement E.Leclerc. Vous bénéficiez du
              droit d'introduire une réclamation auprès de la Comission Nationale Informatique et
              Libertés (CNIL).
            </Typography>
          </>
        )}
      </Box>
    </Stack>
  )
}
