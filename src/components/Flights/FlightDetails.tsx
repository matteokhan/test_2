import { Box, Chip, Stack, Typography } from '@mui/material'
import TrainIcon from '@mui/icons-material/Train'
import { CarryOnLuggageIcon, CheckedLuggageIcon, NoLuggageIcon } from '@/components'
import { Route } from '@/types'

export const FlightDetails = ({ route }: { route: Route; airline: string }) => {
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
  const numberDaysArrival = arrivalDateTime.getDate() - departureDateTime.getDate()
  const departureAirport = firstSegment.departure
  const departureCityCode = firstSegment.departureCityCode
  const arrivalAirport = lastSegment.arrival
  const arrivalCityCode = lastSegment.arrivalCityCode
  const carbonFootprint = 'carbonFootprint'
  const carryOnLuggage = false
  const checkedLuggage = false
  const noLuggage = route.baggages === 0

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

  const transformDuration = (duration: string, addMinutesSuffix: boolean = false): string => {
    const [hours, minutes] = duration.split(':').map(Number)
    const formattedDuration = `${hours}h${minutes.toString().padStart(2, '0')}`
    return addMinutesSuffix ? `${formattedDuration}mn` : formattedDuration
  }

  return (
    <Stack gap={4} direction="row">
      <Stack gap={1} minWidth="25%">
        <Stack gap={0.5}>
          <p>Logo</p>
          <Typography variant="bodySm" color="grey.700">
            {route.carrier}
          </Typography>
        </Stack>
        {tags && (
          <Stack direction="row">
            <Chip label={tags} sx={{ backgroundColor: 'grey.100' }} size="small" />
          </Stack>
        )}
      </Stack>
      <Stack flexGrow={1}>
        <Stack direction="row" justifyContent="space-between" gap={2}>
          <Typography variant="titleLg" color="leclerc.red.main">
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
          {numberDaysArrival > 0 && (
            <Typography variant="bodySm" color="grey.700">
              J+{numberDaysArrival}
            </Typography>
          )}
          <Typography variant="titleLg" color="leclerc.red.main">
            {arrivalTime}
          </Typography>
        </Stack>
        <Stack direction="row" gap={4.5}>
          <Stack gap={0.5} width="30%">
            <Typography variant="bodyMd">{departureAirport}</Typography>
            <Stack direction="row" alignItems="center" gap={0.5}>
              <Typography variant="labelLg">{departureCityCode}</Typography>
              {isTrain && <TrainIcon />}
            </Stack>
          </Stack>
          <Stack textAlign="center" width="40%" gap="2px">
            <Typography variant="bodySm">{transformDuration(travelTime, true)}</Typography>
            <Typography variant="bodySm" color="grey.700">
              {getScaleDetails()}
            </Typography>
            {route.airportChange && (
              <Typography variant="bodySm" color="leclerc.red.main">
                Changement d’aéroport
              </Typography>
            )}
          </Stack>
          <Stack gap={0.5} textAlign="right" width="30%">
            <Typography variant="bodyMd">{arrivalAirport}</Typography>
            <Stack direction="row" alignItems="center" gap={0.5} alignSelf="flex-end">
              <Typography variant="labelLg">{arrivalCityCode}</Typography>
            </Stack>
          </Stack>
        </Stack>
        {(carryOnLuggage || checkedLuggage || noLuggage) && (
          <Stack direction="row" justifyContent="space-between" pt={1} alignItems="center">
            <Stack direction="row">
              {carryOnLuggage && <CarryOnLuggageIcon />}
              {checkedLuggage && <CheckedLuggageIcon />}
              {noLuggage && <NoLuggageIcon />}
            </Stack>
            {false && (
              <Typography variant="bodySm" color="grey.700">
                {carbonFootprint}
              </Typography>
            )}
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}
