import { Chip, Stack, Typography } from '@mui/material'
import {
  AirplaneIcon,
  FlightAirline,
  ItinerarySegmentDatetime,
  ItinerarySegmentDetails,
  ItineraryTimeline,
  TrainIcon,
} from '@/components'
import { RouteCarrier, RouteSegment, RouteSegmentCarrier } from '@/types'
import { transformDuration } from '@/utils/date'
import { useAirportData } from '@/services'
import { airportNameExtension } from '@/utils'

export const ItinerarySegment = ({
  carrier,
  segment,
  indexSegment,
  allSegments,
  isLastSegment = false,
}: {
  carrier: RouteCarrier | RouteSegmentCarrier
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
  const tags = segment.equipment == 'TRN' ? 'Vol + train' : null

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  }

  const { data: departureAirportData } = useAirportData({ airportCode: segment.departureCityCode })
  const { data: arrivalAirportData } = useAirportData({ airportCode: segment.arrivalCityCode })

  const getSegmentIcon = () => {
    if (segment.equipment == 'TRN') {
      return <TrainIcon />
    } else {
      return <AirplaneIcon />
    }
  }

  return (
    <Stack direction="row" gap={3}>
      <Stack gap={1} width={126}>
        <FlightAirline carrier={carrier} />
        {tags && (
          <Stack direction="row" data-testid="flightRouteDetails-tags">
            <Chip label={tags} sx={{ backgroundColor: 'grey.100' }} size="small" />
          </Stack>
        )}
      </Stack>
      <Stack gap={2} key={segment.id} width="100%">
        <Stack direction="row" gap={1}>
          <ItinerarySegmentDatetime
            time={segment.departureDateTime.split('T')[1].slice(0, 5)}
            date={new Date(segment.departureDateTime).toLocaleDateString(undefined, dateOptions)}
          />
          <ItineraryTimeline />
          <ItinerarySegmentDetails
            location={airportNameExtension(departureAirportData)}
            locationCode={segment.departureCityCode}
          />
        </Stack>
        <Stack direction="row" gap={1}>
          <Stack width="48px" minWidth="48px" alignItems="flex-end" justifyContent="center">
            <Typography
              variant="bodySm"
              position="relative"
              top="5px"
              data-testid="itinerarySegment-duration">
              {transformDuration(segment.duration, true)}
            </Typography>
          </Stack>
          <ItineraryTimeline icon={getSegmentIcon()} />
          <Stack flexGrow={1} justifyContent="flex-end">
            <Typography variant="bodySm" data-testid="itinerarySegment-carrierInfo">
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
            location={airportNameExtension(arrivalAirportData)}
            locationCode={segment.arrivalCityCode}
            scaleDuration={transformDuration(scaleTime)}
            airportChange={airportChange}
          />
        </Stack>
      </Stack>
    </Stack>
  )
}
