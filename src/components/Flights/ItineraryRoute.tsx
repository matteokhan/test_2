import { Route } from '@/types'
import { Box, Stack, SxProps, Typography } from '@mui/material'
import { ItinerarySegment } from '@/components'
import { airportName, transformDuration } from '@/utils'
import { useAirportData } from '@/services'

export const ItineraryRoute = ({ route, sx }: { route: Route; sx?: SxProps }) => {
  const departure = route.segments[0].departure
  const arrival = route.segments[route.segments.length - 1].arrival

  const departureDate = new Date(route.segments[0].departureDateTime)
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  const { data: departureAirportData } = useAirportData({ airportCode: departure })
  const { data: arrivalAirportData } = useAirportData({ airportCode: arrival })

  return (
    <Box
      maxWidth="590px"
      borderRadius={1}
      bgcolor="white"
      sx={{ ...sx }}
      data-testid="itineraryRoute">
      <Box py={1.5} px={2}>
        <Typography variant="titleMd" data-testid="itineraryRoute-departureAndArrival">
          {airportName(departureAirportData)} - {airportName(arrivalAirportData)}
        </Typography>
        <Typography variant="bodyMd" color="grey.800" data-testid="itineraryRoute-durationDetails">
          {departureDate.toLocaleDateString(undefined, dateOptions)} - durée{' '}
          {transformDuration(route.travelTime, true)}{' '}
          {route.stopNumber > 0 && (
            <span>
              - {route.stopNumber} escale ({transformDuration(route.totalStopDuration)})
            </span>
          )}
        </Typography>
      </Box>
      <Stack p={2} gap={2}>
        {route.segments.map((segment, index) => (
          <ItinerarySegment
            key={segment.id}
            segment={segment}
            indexSegment={index}
            allSegments={route.segments}
            isLastSegment={index === route.segments.length - 1}
          />
        ))}
      </Stack>
    </Box>
  )
}
