import { Stack, Typography } from '@mui/material'
import {
  AirplaneIcon,
  ItinerarySegmentDatetime,
  ItinerarySegmentDetails,
  ItineraryTimeline,
  TrainIcon,
} from '@/components'
import { RouteSegment } from '@/types'
import { transformDuration } from '@/utils/date'

export const ItinerarySegment = ({
  segment,
  indexSegment,
  allSegments,
  isLastSegment = false,
}: {
  segment: RouteSegment
  indexSegment: number
  allSegments: RouteSegment[]
  isLastSegment?: boolean
}) => {
  let nextSegment = undefined
  let scaleTime = undefined
  let airportChange = false
  if (!isLastSegment) {
    nextSegment = allSegments[indexSegment + 1]
    scaleTime = nextSegment.timeBeforeSegment
    airportChange = nextSegment.departureCityCode != segment.arrivalCityCode
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  }

  const getSegmentIcon = () => {
    if (segment.equipment == 'TRN') {
      return <TrainIcon />
    } else {
      return <AirplaneIcon />
    }
  }

  return (
    <Stack gap={2} key={segment.id}>
      <Stack direction="row" gap={1}>
        <ItinerarySegmentDatetime
          time={segment.departureDateTime.split('T')[1].slice(0, 5)}
          date={new Date(segment.departureDateTime).toLocaleDateString(undefined, dateOptions)}
        />
        <ItineraryTimeline />
        <ItinerarySegmentDetails
          location={segment.departure}
          locationCode={segment.departureCityCode}
        />
      </Stack>
      <Stack direction="row" gap={1}>
        <Stack width="48px" minWidth="48px" alignItems="flex-end" justifyContent="center">
          <Typography variant="bodySm" position="relative" top="5px">
            {transformDuration(segment.duration, true)}
          </Typography>
        </Stack>
        <ItineraryTimeline icon={getSegmentIcon()} />
        <Stack flexGrow={1} justifyContent="flex-end">
          <Typography variant="bodySm">
            {segment.carrier} - {segment.flightNumber} - {segment.fare?.fareBasis}
          </Typography>
        </Stack>
      </Stack>
      <Stack direction="row" gap={1}>
        <ItinerarySegmentDatetime
          time={segment.arrivalDateTime.split('T')[1].slice(0, 5)}
          date={new Date(segment.arrivalDateTime).toLocaleDateString(undefined, dateOptions)}
        />
        <ItineraryTimeline noLine={isLastSegment} dotted={!isLastSegment} />
        <ItinerarySegmentDetails
          location={segment.arrival}
          locationCode={segment.arrivalCityCode}
          scaleDuration={transformDuration(scaleTime)}
          airportChange={airportChange}
        />
      </Stack>
    </Stack>
  )
}
