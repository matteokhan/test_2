import { Alert, Box, Paper, Stack, Typography } from '@mui/material'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import Image from 'next/image'

export const BookingConfirmation = () => {
  return (
    <Paper sx={{ width: '100%', p: 4 }}>
      <Stack alignItems="center">
        <Box width={140} height={140} position="relative">
          <Image src="/design_1.svg" alt="voyages image" fill />
        </Box>
        <Stack p={3} gap={1.2} alignItems="center">
          <Typography variant="headlineMd" textAlign="center">
            Merci M. Calando,
            <br />
            Votre réservation est confirmée
          </Typography>
          <Box pb={3}>
            <Stack direction="row" justifyContent="center" height={24} alignItems="center" gap={1}>
              <Typography variant="bodyMd">Itinéraire :</Typography>
              <Stack direction="row" alignItems="center">
                <Typography variant="bodyMd" color="primary" fontWeight={500}>
                  Paris
                </Typography>
                <SwapHorizIcon
                  sx={{
                    width: 24,
                    height: 24,
                  }}
                />
                <Typography variant="bodyMd" color="primary" fontWeight={500}>
                  Djerba
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" justifyContent="center" height={24} gap={1}>
              <Typography variant="bodyMd">Date de départ :</Typography>
              <Typography variant="bodyMd" color="primary" fontWeight={500}>
                17/05/2024
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="center" height={24} gap={1}>
              <Typography variant="bodyMd">Référence de votre réservation :</Typography>
              <Typography variant="bodyMd" color="primary" fontWeight={500}>
                X125-DF
              </Typography>
            </Stack>
          </Box>
          <Stack alignItems="center">
            <Typography variant="headlineSm" display="flex" height={32}>
              Vous avez choisi l'agence
            </Typography>
            <Typography variant="headlineSm" color="primary" display="flex" height={32}>
              Voyages E.Leclerc Riorges
            </Typography>
            <Typography variant="headlineSm" display="flex" height={32}>
              pour votre réservation.
            </Typography>
          </Stack>
          <Typography variant="bodyMd" textAlign="center">
            Pour toute demande relative à votre dossier,
            <br /> veuillez contacter votre agence.{' '}
          </Typography>
        </Stack>
        <Alert>
          Un email de confirmation vous a été envoyé avec
          <br /> toutes les informations relatives à votre dossier
        </Alert>
      </Stack>
    </Paper>
  )
}
