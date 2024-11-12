import { Box, Chip, Stack, Typography } from '@mui/material'
import TrainIcon from '@mui/icons-material/Train'
import { CarryOnLuggageIcon, CheckedLuggageIcon, FlightAirline, NoLuggageIcon } from '@/components'
import { Route } from '@/types'
import { locationNameExtension, transformDuration } from '@/utils'
import { useLocationData } from '@/services'
import { calculateDaysBetween } from '@/utils'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const FlightRouteDetails = ({ route }: { route: Route }) => {
  const { segments, travelTime } = route
  const firstSegment = segments[0]
  const lastSegment = segments[segments.length - 1]
  const hasTrainSegment = segments.some((segment) => segment.equipment === 'TRN')
  const tags = hasTrainSegment ? 'Vol + train' : null
  const departureDateTime = dayjs(firstSegment.departureDateTime).utc()
  const departureTime = departureDateTime.format('HH:mm')
  const arrivalDateTime = dayjs(lastSegment.arrivalDateTime).utc()
  const arrivalTime = arrivalDateTime.format('HH:mm')
  const daysToArrival = calculateDaysBetween(departureDateTime, arrivalDateTime)
  const departureLocation = firstSegment.departure
  const departureCityCode = firstSegment.departureCityCode
  const arrivalLocation = lastSegment.arrival
  const arrivalCityCode = lastSegment.arrivalCityCode
  const carbonFootprint = 'carbonFootprint'
  const carryOnLuggage = false
  const checkedLuggage = false
  const noLuggage = route.baggages === 0
  const { data: departureLocationData } = useLocationData({ locationCode: departureLocation })
  const { data: arrivalLocationData } = useLocationData({ locationCode: arrivalLocation })

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
    <>
      {/* Desktop */}
      <Stack
        gap={4}
        direction="row"
        sx={{ display: { xs: 'none', lg: 'flex' } }}
        className="desktop">
        <Stack gap={1} minWidth="25%" maxWidth="25%">
          <FlightAirline carrier={route.carrier} />
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
                color="leclerc.red.main"
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
              <Typography variant="bodyMd" data-testid="flightRouteDetails-departureLocation">
                {locationNameExtension(departureLocationData)}
              </Typography>
              <Stack direction="row" alignItems="center" gap={0.5}>
                <Typography variant="labelLg" data-testid="flightRouteDetails-departureCityCode">
                  {departureCityCode}
                </Typography>
                {hasTrainSegment && <TrainIcon data-testid="flightRouteDetails-trainIcon" />}
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
              <Typography variant="bodyMd" data-testid="flightRouteDetails-arrivalLocation">
                {locationNameExtension(arrivalLocationData)}
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

      {/* Mobile */}
      <Stack gap={1.5} sx={{ display: { xs: 'flex', lg: 'none' } }} className="mobile">
        <Stack gap={1} direction="row" justifyContent="space-between" alignItems="center">
          <FlightAirline
            carrier={route.carrier}
            sx={{ gap: 1, flexDirection: 'row', alignItems: 'center', width: '100%' }}
          />
          {tags && (
            <Stack direction="row" data-testid="flightRouteDetails-tags">
              <Chip label={tags} sx={{ backgroundColor: 'grey.100' }} size="small" />
            </Stack>
          )}
        </Stack>
        <Stack gap={1}>
          <Stack direction="row" gap={5} alignItems="center">
            <Box width="60px" minWidth="60px" textAlign="right">
              <Typography
                variant="titleLg"
                color="leclerc.red.main"
                data-testid="flightRouteDetails-departureTime"
                fontSize="22px">
                {departureTime}
              </Typography>
            </Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexGrow={1}
              gap={2}>
              <Stack direction="row" alignItems="center" justifyContent="flex-start" gap={0.5}>
                <Typography variant="bodyMd" data-testid="flightRouteDetails-departureLocation">
                  {locationNameExtension(departureLocationData)}
                </Typography>
                {hasTrainSegment && <TrainIcon data-testid="flightRouteDetails-trainIcon" />}
              </Stack>
              <Typography variant="labelLg" data-testid="flightRouteDetails-departureCityCode">
                {departureCityCode}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row" gap={5}>
            <Box width="60px" minWidth="60px" textAlign="right">
              <Typography variant="bodySm" data-testid="flightRouteDetails-duration">
                {transformDuration(travelTime, true)}
              </Typography>
            </Box>
            <Stack direction="row" gap={1}>
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
          </Stack>
          <Stack direction="row" gap={5}>
            <Box width="60px" minWidth="60px" textAlign="right" position="relative">
              <Typography
                variant="titleLg"
                color="leclerc.red.main"
                data-testid="flightRouteDetails-arrivalTime"
                fontSize="22px">
                {arrivalTime}
              </Typography>
              {daysToArrival > 0 && (
                <Box sx={{ position: 'absolute', right: '-32px', top: '2px' }}>
                  {' '}
                  <Typography
                    variant="bodySm"
                    color="leclerc.red.main"
                    data-testid="flightRouteDetails-daysToArrival">
                    J+{daysToArrival}
                  </Typography>
                </Box>
              )}
            </Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexGrow={1}
              gap={2}>
              <Typography variant="bodyMd" data-testid="flightRouteDetails-arrivalLocation">
                {locationNameExtension(arrivalLocationData)}
              </Typography>
              <Typography variant="labelLg" data-testid="flightRouteDetails-arrivalCityCode">
                {arrivalCityCode}
              </Typography>
            </Stack>
          </Stack>
          {(carryOnLuggage || checkedLuggage || noLuggage) && (
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" data-testid="flightRouteDetails-luggageDetails">
                {carryOnLuggage && (
                  <CarryOnLuggageIcon data-testid="flightRouteDetails-carryOnLuggage" />
                )}
                {checkedLuggage && (
                  <CheckedLuggageIcon data-testid="flightRouteDetails-checkedLuggage" />
                )}
                {noLuggage && <NoLuggageIcon data-testid="flightRouteDetails-noLuggage" />}
              </Stack>

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
    </>
  )
}
