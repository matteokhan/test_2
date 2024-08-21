'use client'

import React from 'react'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { FlightRouteDetails } from '@/components'
import { Solution } from '@/types'
import { useBooking, useFlights } from '@/contexts'

export const FlightResult = ({
  result,
  correlationId,
}: {
  result: Solution
  correlationId: string
}) => {
  const { setPreSelectedFlight, setCorrelationId } = useBooking()
  const { setFlightDetailsOpen } = useFlights()
  const preSelectFlight = () => {
    setPreSelectedFlight(result)
    setCorrelationId(correlationId)
    setFlightDetailsOpen(true)
  }
  return (
    <Paper sx={{ padding: 2 }} data-testid="flightResult">
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
            <Typography variant="headlineSm" color="primary" data-testid="flightResult-totalPrice">
              {result.priceInfo.total}
              {result.priceInfo.currencySymbol}
            </Typography>
            {result.priceInfo.passengerNumber > 1 && (
              <Typography
                variant="bodySm"
                color="grey.800"
                data-testid="flightResult-pricePerPassenger">
                Vol pour {result.priceInfo.passengerNumber} voyageurs (
                {result.priceInfo.total / result.priceInfo.passengerNumber}
                {result.priceInfo.currencySymbol} par pers.)
              </Typography>
            )}
            {result.priceInfo.passengerNumber === 1 && (
              <Typography
                variant="bodySm"
                color="grey.800"
                data-testid="flightResult-pricePerPassenger">
                Vol pour {result.priceInfo.passengerNumber} voyageur
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
  )
}
