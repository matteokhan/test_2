import { Box, Chip, Stack, Typography } from '@mui/material'
import TrainIcon from '@mui/icons-material/Train'
import { CarryOnLuggageIcon, CheckedLuggageIcon, NoLuggageIcon } from '@/components'
import { Route } from '@/types'

export const FlightDetails = ({ route, airline }: { route: Route; airline: string }) => {
  const { segments, travelTime } = route
  const firstSegment = segments[0]
  const lastSegment = segments[segments.length - 1]
  const tags = firstSegment.equipment == 'TRN' ? 'Vol + train' : null
  const departureDateTime = new Date(firstSegment.departureDateTime)
  const departureTime =
    departureDateTime.getHours().toString().padStart(2, '0') +
    ':' +
    departureDateTime.getMinutes().toString().padStart(2, '0')
  const arrivalDateTime = new Date(lastSegment.arrivalDateTime)
  const arrivalTime =
    arrivalDateTime.getHours().toString().padStart(2, '0') +
    ':' +
    arrivalDateTime.getMinutes().toString().padStart(2, '0')
  const departureAirport = firstSegment.departure
  const departureCityCode = firstSegment.departureCityCode
  const arrivalAirport = lastSegment.arrival
  const arrivalCityCode = lastSegment.arrivalCityCode
  const carbonFootprint = 'carbonFootprint'
  const scalesDetails = 'scalesDetails'
  const carryOnLuggage = true
  const checkedLuggage = true
  const noLuggage = true

  return (
    <Stack gap={4} direction="row">
      <Stack gap={1} minWidth="25%">
        <Stack gap={0.5}>
          <p>Logo</p>
          <Typography variant="bodySm" color="grey.700">
            {airline}
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
          <Typography variant="titleLg" color="leclerc.red.main">
            {arrivalTime}
          </Typography>
        </Stack>
        <Stack direction="row" gap={4.5}>
          <Stack gap={0.5} width="30%">
            <Typography variant="bodyMd">{departureAirport}</Typography>
            <Stack direction="row" alignItems="center" gap={0.5}>
              <Typography variant="labelLg">{departureCityCode}</Typography>
              <TrainIcon />
            </Stack>
          </Stack>
          <Stack textAlign="center" width="40%" gap="2px">
            <Typography variant="bodySm">{travelTime}</Typography>
            <Typography variant="bodySm" color="grey.700">
              {scalesDetails}
            </Typography>
            <Typography variant="bodySm" color="leclerc.red.main">
              Changement d’aéroport
            </Typography>
          </Stack>
          <Stack gap={0.5} textAlign="right" width="30%">
            <Typography variant="bodyMd">{arrivalAirport}</Typography>
            <Stack direction="row" alignItems="center" gap={0.5} alignSelf="flex-end">
              <Typography variant="labelLg">{arrivalCityCode}</Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack direction="row" justifyContent="space-between" pt={1} alignItems="center">
          <Stack direction="row">
            {carryOnLuggage && <CarryOnLuggageIcon />}
            {checkedLuggage && <CheckedLuggageIcon />}
            {noLuggage && <NoLuggageIcon />}
          </Stack>
          <Typography variant="bodySm" color="grey.700">
            {carbonFootprint}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}
