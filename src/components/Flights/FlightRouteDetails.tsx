import { Box, Chip, Stack, Typography } from '@mui/material'
import TrainIcon from '@mui/icons-material/Train'
import { CarryOnLuggageIcon, CheckedLuggageIcon, NoLuggageIcon } from '@/components'
import { Route } from '@/types'
import { transformDuration } from '@/utils'
import Image from 'next/image'
import { useAirlinesData, useAirportData } from '@/services'

export const FlightRouteDetails = ({ route }: { route: Route }) => {
  const { data: airlinesData } = useAirlinesData()
  const { segments, travelTime } = route
  const firstSegment = segments[0]
  const lastSegment = segments[segments.length - 1]
  const isTrain = firstSegment.equipment == 'TRN'
  const tags = firstSegment.equipment == 'TRN' ? 'Vol + train' : null
  const departureDateTime = new Date(firstSegment.departureDateTime)
  const departureTime =
    departureDateTime.getUTCHours().toString().padStart(2, '0') +
    ':' +
    departureDateTime.getUTCMinutes().toString().padStart(2, '0')
  const arrivalDateTime = new Date(lastSegment.arrivalDateTime)
  const arrivalTime =
    arrivalDateTime.getUTCHours().toString().padStart(2, '0') +
    ':' +
    arrivalDateTime.getUTCMinutes().toString().padStart(2, '0')
  const daysToArrival = arrivalDateTime.getDate() - departureDateTime.getDate()
  const departureAirport = firstSegment.departure
  const departureCityCode = firstSegment.departureCityCode
  const arrivalAirport = lastSegment.arrival
  const arrivalCityCode = lastSegment.arrivalCityCode
  const carbonFootprint = 'carbonFootprint'
  const carryOnLuggage = false
  const checkedLuggage = false
  const noLuggage = route.baggages === 0
  const { data: departureAirportData } = useAirportData({ airportCode: departureAirport })
  const { data: arrivalAirportData } = useAirportData({ airportCode: arrivalAirport })

  const getScaleDetails = () => {
    if (!route.totalStopDuration) {
      return ''
    }
    if (route.stopNumber === 0) {
      return ''
    }
    if (route.stopNumber === 1) {
      return '1 escale (' + transformDuration(route.totalStopDuration) + ')'
    }
    if (route.stopNumber >= 2) {
      return route.stopNumber + ' escales (' + transformDuration(route.totalStopDuration) + ')'
    }
  }

  return (
    <Stack gap={4} direction="row">
      <Stack gap={1} minWidth="25%" maxWidth="25%">
        <Stack gap={0.5}>
          {/* TODO: default image */}
          <Stack
            width="32px"
            height="32px"
            borderRadius="32px"
            border="1px solid"
            borderColor="grey.400"
            alignItems="center"
            justifyContent="center">
            <Image
              src={airlinesData ? airlinesData[route.carrier]?.logo_small_path || '' : ''}
              alt="Airline logo"
              width={21}
              height={21}
              unoptimized={true}
            />
          </Stack>
          <Typography variant="bodySm" color="grey.700" data-testid="flightRouteDetails-carrier">
            {airlinesData ? airlinesData[route.carrier]?.name : ''}
          </Typography>
        </Stack>
        {tags && (
          <Stack direction="row" data-testid="flightRouteDetails-tags">
            <Chip label={tags} sx={{ backgroundColor: 'grey.100' }} size="small" />
          </Stack>
        )}
      </Stack>
      <Stack flexGrow={1}>
        <Stack direction="row" justifyContent="space-between" gap={2}>
          <Typography
            variant="titleLg"
            color="leclerc.red.main"
            data-testid="flightRouteDetails-departureTime">
            {departureTime}
          </Typography>
          <Stack
            flexGrow={1}
            direction="row"
            position="relative"
            justifyContent="center"
            alignItems="center">
            <Box borderRadius="4px" width="7px" height="7px" bgcolor="grey.900"></Box>
            <Box width="100%" height="1px" bgcolor="grey.900"></Box>
            <Box borderRadius="4px" width="7px" height="7px" bgcolor="grey.900"></Box>
          </Stack>
          {daysToArrival > 0 && (
            <Typography
              variant="bodySm"
              color="grey.700"
              data-testid="flightRouteDetails-daysToArrival">
              J+{daysToArrival}
            </Typography>
          )}
          <Typography
            variant="titleLg"
            color="leclerc.red.main"
            data-testid="flightRouteDetails-arrivalTime">
            {arrivalTime}
          </Typography>
        </Stack>
        <Stack direction="row" gap={4.5}>
          <Stack gap={0.5} width="30%">
            <Typography variant="bodyMd" data-testid="flightRouteDetails-departureAirport">
              {departureAirportData ? departureAirportData.name : ''}
            </Typography>
            <Stack direction="row" alignItems="center" gap={0.5}>
              <Typography variant="labelLg" data-testid="flightRouteDetails-departureCityCode">
                {departureCityCode}
              </Typography>
              {isTrain && <TrainIcon data-testid="flightRouteDetails-trainIcon" />}
            </Stack>
          </Stack>
          <Stack textAlign="center" width="40%" gap="2px">
            <Typography variant="bodySm" data-testid="flightRouteDetails-duration">
              {transformDuration(travelTime, true)}
            </Typography>
            <Typography
              variant="bodySm"
              color="grey.700"
              data-testid="flightRouteDetails-scaleDetails">
              {getScaleDetails()}
            </Typography>
            {route.airportChange && (
              <Typography
                variant="bodySm"
                color="leclerc.red.main"
                data-testid="flightRouteDetails-changeAirportWarning">
                Changement d’aéroport
              </Typography>
            )}
          </Stack>
          <Stack gap={0.5} textAlign="right" width="30%">
            <Typography variant="bodyMd" data-testid="flightRouteDetails-arrivalAirport">
              {arrivalAirportData ? arrivalAirportData.name : ''}
            </Typography>
            <Stack direction="row" alignItems="center" gap={0.5} alignSelf="flex-end">
              <Typography variant="labelLg" data-testid="flightRouteDetails-arrivalCityCode">
                {arrivalCityCode}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        {(carryOnLuggage || checkedLuggage || noLuggage) && (
          <Stack direction="row" justifyContent="space-between" pt={1} alignItems="center">
            <Stack direction="row" data-testid="flightRouteDetails-luggageDetails">
              {carryOnLuggage && (
                <CarryOnLuggageIcon data-testid="flightRouteDetails-carryOnLuggage" />
              )}
              {checkedLuggage && (
                <CheckedLuggageIcon data-testid="flightRouteDetails-checkedLuggage" />
              )}
              {noLuggage && <NoLuggageIcon data-testid="flightRouteDetails-noLuggage" />}
            </Stack>
            {/* TODO: enable carbon footprint when available */}
            {false && (
              <Typography
                variant="bodySm"
                color="grey.700"
                data-testid="flightRouteDetails-carbonFootprint">
                {carbonFootprint}
              </Typography>
            )}
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}
