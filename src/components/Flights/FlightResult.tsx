import React from 'react'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { FlightDetails } from '@/components'
import { Solution } from '@/types'

export const FlightResult = ({ result }: { result: Solution }) => {
  return (
    <Paper sx={{ padding: 2 }}>
      <Stack gap={5.5} direction="row">
        <Stack flexGrow={1}>
          {result.routes.map((route, index, routes) => (
            <React.Fragment key={route.id}>
              <FlightDetails route={route} airline={result.platingCarrier} />
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
                      color="grey.700">
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
            <Typography variant="headlineSm" color="primary">
              {result.priceInfo.total}
              {result.priceInfo.currencySymbol}
            </Typography>

            {/* TODO: Hardcoded data here */}
            <Typography variant="bodySm" color="grey.800">
              Vol + hôtel pour 2 voyageurs (1325€ par pers.)
            </Typography>
          </Stack>
          <Button variant="outlined" sx={{ width: 'fit-content', paddingX: 3 }}>
            Voir le détail
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}
