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
        minHeight: { xs: '100%', lg: 'unset' },
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
            Merci {order.client?.title == 'Mrs' ? 'Mme' : order.client?.title}{' '}
            {order.client?.last_name} pour votre réservation,
            <br />
            Votre réservation est confirmée
          </Typography>
          <Typography
            color="primary"
            variant="headlineSm"
            textAlign="center"
            data-testid="bookingConfirmation-bookingType">
            {order.search.search_data.segments.length === 1 ? 'Aller simple' : 'Aller-retour'}
          </Typography>
          <Stack direction="row" justifyContent="center" height={24} gap={1} alignItems="center">
            <Typography variant="bodyMd">Référence de votre réservation :</Typography>
            <Typography
              variant="bodyMd"
              color="primary"
              fontWeight={500}
              data-testid="bookingConfirmation-reference">
              {order.status__name === 'ERROR FLIGHT RESERVE AFTER PAYMENT'
                ? 'En attente de référence dossier'
                : order.ticket?.travel_data?.passenger_name_record}
            </Typography>
          </Stack>
          <Stack pt={1} pb={3} direction="column" gap={2}>
            {order.ticket?.travel_data?.transports?.map((transport, index) => (
              <Box key={index}>
                <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
                  <Typography variant="bodyMd" noWrap>
                    Itinéraire :
                  </Typography>

                  <Stack direction="row" alignItems="center">
                    <Typography
                      variant="bodyMd"
                      color="primary"
                      fontWeight={500}
                      data-testid="bookingConfirmation-departure">
                      {transport.departure_city_name}
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
                      {transport.arrival_city_name}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction="row" justifyContent="center" gap={1} alignItems="center">
                  <Typography variant="bodyMd" noWrap>
                    Heure de départ :
                  </Typography>
                  <Typography
                    variant="bodyMd"
                    color="primary"
                    fontWeight={500}
                    data-testid="bookingConfirmation-departureDate">
                    {dayjs(transport.service_period.start).format('DD/MM/YYYY - HH:mm')}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="center"
                  height={24}
                  gap={1}
                  alignItems="center">
                  <Typography variant="bodyMd" noWrap>
                    Heure d'arrivée :
                  </Typography>
                  <Typography
                    variant="bodyMd"
                    color="primary"
                    fontWeight={500}
                    data-testid="bookingConfirmation-arrivalDate">
                    {dayjs(transport.service_period.end).format('DD/MM/YYYY - HH:mm')}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Stack>
          <Stack alignItems="center">
            <Typography variant="headlineSm" display="flex" height={32}>
              Vous avez choisi l'agence
            </Typography>
            <Typography
              variant="headlineSm"
              color="primary"
              display="flex"
              textAlign="center"
              data-testid="bookingConfirmation-agencyName">
              {order.agency__name}
            </Typography>
            <Typography variant="headlineSm" display="flex" height={32}>
              pour votre réservation.
            </Typography>
            <Stack
              direction="row"
              justifyContent="center"
              gap={1}
              alignItems="center"
              pt={2}
              width="100%">
              <Typography
                variant="bodyMd"
                noWrap
                textOverflow="unset"
                maxWidth="50%"
                width="50%"
                textAlign="right">
                Address :
              </Typography>
              <Typography
                maxWidth="50%"
                width="50%"
                variant="bodyMd"
                color="primary"
                fontWeight={500}
                data-testid="bookingConfirmation-address">
                {order.agency_data?.address} - {order.agency_data?.city}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="center"
              gap={1}
              alignItems="center"
              pt={1}
              width="100%">
              <Typography variant="bodyMd" noWrap maxWidth="50%" width="50%" textAlign="right">
                Code postal :
              </Typography>
              <Typography
                maxWidth="50%"
                width="50%"
                variant="bodyMd"
                color="primary"
                fontWeight={500}
                data-testid="bookingConfirmation-postalCode">
                {order.agency_data?.postal_code}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="center"
              gap={1}
              alignItems="center"
              pt={1}
              width="100%">
              <Typography variant="bodyMd" noWrap maxWidth="50%" width="50%" textAlign="right">
                Téléphone :
              </Typography>
              <Typography
                maxWidth="50%"
                width="50%"
                variant="bodyMd"
                color="primary"
                fontWeight={500}
                data-testid="bookingConfirmation-phone">
                {order.agency_data?.phone}
              </Typography>
            </Stack>
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
