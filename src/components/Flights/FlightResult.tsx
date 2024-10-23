'use client'

import React from 'react'
import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material'
import { FlightRouteDetails } from '@/components'
import { Solution } from '@/types'
import { useBooking, useFlights } from '@/contexts'

export const FlightResult = ({ result }: { result: Solution }) => {
  const { setPreSelectedFlight } = useBooking()
  const { setFlightDetailsOpen } = useFlights()
  const preSelectFlight = () => {
    setPreSelectedFlight(result)
    setFlightDetailsOpen(true)
  }

  const passengersDescription = () => `Vol pour ${result.priceInfo.passengerNumber} voyageurs (
      ${result.adults.number} adultes
      ${result.childrens?.number ? ', ' + result.childrens.number + ' enfants' : ''}
      ${result.infants?.number ? ', ' + result.infants.number + ' bébés' : ''})`

  return (
    <>
      {/* Desktop */}
      <Paper
        sx={{ padding: 2, display: { xs: 'none', lg: 'block' } }}
        data-testid="flightResult"
        className="desktop">
        <Stack gap={5.5} direction="row">
          <Stack flexGrow={1}>
            {result.routes.map((route, index, routes) => (
              <React.Fragment key={route.id}>
                <FlightRouteDetails route={route} />
                {index < result.routes.length - 1 && (
                  <Stack gap={4} direction="row">
                    <Stack minWidth="25%"></Stack>
                    <Stack
                      flexGrow={1}
                      direction="row"
                      py={2}
                      position="relative"
                      justifyContent="center"
                      alignItems="center">
                      <Box position="absolute" width="100%" height="1px" bgcolor="grey.400"></Box>
                      <Typography
                        zIndex="10"
                        variant="bodySm"
                        bgcolor="common.white"
                        px="10px"
                        color="grey.700"
                        data-testid="flightResult-nightsAt">
                        {routes[index + 1].nightsBeforeRoute} nuits à{' '}
                        {routes[index + 1].segments[0].departure}
                      </Typography>
                    </Stack>
                  </Stack>
                )}
              </React.Fragment>
            ))}
          </Stack>
          <Stack gap={1} maxWidth="23%" minWidth="23%" alignSelf="flex-end">
            <Stack>
              <Typography
                variant="headlineSm"
                color="primary"
                data-testid="flightResult-totalPrice">
                {result.priceInfo.total}
                {result.priceInfo.currencySymbol}
              </Typography>
              {result.priceInfo.passengerNumber > 1 && (
                <Typography
                  variant="bodySm"
                  color="grey.800"
                  data-testid="flightResult-passengersDescription">
                  {passengersDescription()}
                </Typography>
              )}
              {result.priceInfo.passengerNumber === 1 && (
                <Typography
                  variant="bodySm"
                  color="grey.800"
                  data-testid="flightResult-passengersDescription">
                  Vol pour {result.priceInfo.passengerNumber} voyageur (
                  {`${result.adults.number} adulte`})
                </Typography>
              )}
            </Stack>
            <Button
              variant="outlined"
              sx={{ width: 'fit-content', paddingX: 3 }}
              onClick={preSelectFlight}
              data-testid="flightResult-seeDetailsButton">
              Voir le détail
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Mobile */}
      <Paper
        sx={{ py: 2, display: { xs: 'block', lg: 'none' } }}
        data-testid="flightResult"
        className="mobile">
        <Stack gap={1.5}>
          <Stack flexGrow={1}>
            {result.routes.map((route, index, routes) => (
              <React.Fragment key={route.id}>
                <Box px={2}>
                  <FlightRouteDetails route={route} />
                </Box>
                {index < result.routes.length - 1 && (
                  <Stack gap={4} direction="row" width="100%">
                    <Stack
                      flexGrow={1}
                      direction="row"
                      py={2}
                      position="relative"
                      justifyContent="center"
                      alignItems="center">
                      <Box position="absolute" width="100%" height="1px" bgcolor="grey.400"></Box>
                      <Typography
                        zIndex="10"
                        variant="bodySm"
                        bgcolor="common.white"
                        px="10px"
                        color="grey.700"
                        data-testid="flightResult-nightsAt">
                        {routes[index + 1].nightsBeforeRoute} nuits à{' '}
                        {routes[index + 1].segments[0].departure}
                      </Typography>
                    </Stack>
                  </Stack>
                )}
              </React.Fragment>
            ))}
          </Stack>
          <Divider sx={{ borderColor: 'grey.400' }} />
          <Stack direction="row" justifyContent="space-between" alignItems="flex-end" px={2}>
            <Stack>
              <Typography
                variant="headlineSm"
                color="primary"
                data-testid="flightResult-totalPrice">
                {result.priceInfo.total}
                {result.priceInfo.currencySymbol}
              </Typography>
              {result.priceInfo.passengerNumber > 1 && (
                <Typography
                  variant="bodySm"
                  color="grey.800"
                  data-testid="flightResult-passengersDescription">
                  {passengersDescription()}
                </Typography>
              )}
              {result.priceInfo.passengerNumber === 1 && (
                <Typography
                  variant="bodySm"
                  color="grey.800"
                  data-testid="flightResult-passengersDescription">
                  Vol pour {result.priceInfo.passengerNumber} voyageur (
                  {`${result.adults.number} adulte`})
                </Typography>
              )}
            </Stack>
            <Button
              variant="outlined"
              sx={{ width: 'fit-content', paddingX: 3 }}
              onClick={preSelectFlight}
              data-testid="flightResult-seeDetailsButton">
              Voir le détail
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </>
  )
}
