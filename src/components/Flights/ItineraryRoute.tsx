import { Route } from '@/types'
import { Box, Stack, Typography } from '@mui/material'
import { ItinerarySegment } from '@/components'
import { transformDuration } from '@/utils'

export const ItineraryRoute = ({ route }: { route: Route }) => {
  const departure = route.segments[0].departure
  const arrival = route.segments[route.segments.length - 1].arrival

  const departureDate = new Date(route.segments[0].departureDateTime)
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  return (
    <Box maxWidth="590px" border="1px solid" borderColor="grey.400" borderRadius={1}>
      <Box py={1.5} px={2}>
        <Typography variant="titleMd">
          {departure} - {arrival}
        </Typography>
        <Typography variant="bodyMd" color="grey.800">
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
