import { Alert, Box, Paper, Stack, Typography } from '@mui/material'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import Image from 'next/image'
import { OrderDto } from '@/types'
import dayjs from 'dayjs'

export const BookingConfirmation = ({ order }: { order: OrderDto }) => {
  return (
    <Paper
      sx={{
        width: '100%',
        p: { xs: 2, lg: 4 },
        pt: { xs: 3, lg: 4 },
        height: { xs: '100%', lg: 'unset' },
        borderRadius: { xs: 0, lg: '6px' },
      }}
      data-testid="bookingConfirmation">
      <Stack alignItems="center">
        <Box width={140} height={140} position="relative">
          <Image src="/design_1.svg" alt="voyages image" fill />
        </Box>
        <Stack p={3} gap={1.2} alignItems="center">
          <Typography
            variant="headlineMd"
            textAlign="center"
            data-testid="bookingConfirmation-confirmationText">
            Merci {order.client?.title}. {order.client?.last_name} pour votre réservation,
            <br />
            Votre réservation est confirmée
          </Typography>
          <Box pb={3}>
            <Stack direction="row" justifyContent="center" height={24} alignItems="center" gap={1}>
              <Typography variant="bodyMd">Itinéraire :</Typography>
              <Stack direction="row" alignItems="center">
                <Typography
                  variant="bodyMd"
                  color="primary"
                  fontWeight={500}
                  data-testid="bookingConfirmation-departure">
                  {order.ticket?.travel_data?.departure_city_name}
                </Typography>
                <SwapHorizIcon
                  sx={{
                    width: 24,
                    height: 24,
                  }}
                />
                <Typography
                  variant="bodyMd"
                  color="primary"
                  fontWeight={500}
                  data-testid="bookingConfirmation-destination">
                  {order.ticket?.travel_data?.return_city_name}
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" justifyContent="center" height={24} gap={1} alignItems="center">
              <Typography variant="bodyMd">Date de départ :</Typography>
              <Typography
                variant="bodyMd"
                color="primary"
                fontWeight={500}
                data-testid="bookingConfirmation-departureDate">
                {dayjs(order.ticket?.travel_data?.trip_start_date).format('DD/MM/YYYY')}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="center" height={24} gap={1} alignItems="center">
              <Typography variant="bodyMd">Référence de votre réservation :</Typography>
              <Typography
                variant="bodyMd"
                color="primary"
                fontWeight={500}
                data-testid="bookingConfirmation-reference">
                {order.ticket?.travel_data?.passenger_name_record}
              </Typography>
            </Stack>
          </Box>
          <Stack alignItems="center">
            <Typography variant="headlineSm" display="flex" height={32}>
              Vous avez choisi l'agence
            </Typography>
            <Typography
              variant="headlineSm"
              color="primary"
              display="flex"
              height={32}
              data-testid="bookingConfirmation-agencyName">
              {order.agency__name}
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
