import { Stack, Typography } from '@mui/material'
import {
  AirplaneIcon,
  ItinerarySegmentDatetime,
  ItinerarySegmentDetails,
  ItineraryTimeline,
  TrainIcon,
} from '@/components'
import { RouteSegment } from '@/types'

export const ItinerarySegment = ({
  segment,
  isLastSegment = false,
}: {
  segment: RouteSegment
  isLastSegment?: boolean
}) => {
  return (
    <Stack gap={2} key={segment.id}>
      <Stack direction="row" gap={1}>
        {/* TODO: display month's name, not number */}
        <ItinerarySegmentDatetime
          time={segment.departureDateTime.split('T')[1].slice(0, 5)}
          date={segment.departureDateTime.split('T')[0].slice(5, 10)}
        />
        <ItineraryTimeline />
        {/* TODO: hardcoded data here */}
        <ItinerarySegmentDetails
          location={'Paris Gare de Massy'}
          locationCode={segment.departure}
        />
      </Stack>
      <Stack direction="row" gap={1}>
        <Stack width="48px" minWidth="48px" alignItems="flex-end" justifyContent="center">
          {/* TODO: hardcoded data here */}
          <Typography variant="bodySm" position="relative" top="5px">
            2h03mn
          </Typography>
        </Stack>
        {/* TODO: set the right icon */}
        {/* <ItineraryTimeline icon={<TrainIcon />} /> */}
        <ItineraryTimeline icon={<AirplaneIcon />} />
        <Stack flexGrow={1} justifyContent="flex-end">
          {/* TODO: hardcoded data here */}
          <Typography variant="bodySm">CORSAIR - 6168 - ALX6BPRT</Typography>
        </Stack>
      </Stack>
      <Stack direction="row" gap={1}>
        {/* TODO: display month's name, not number */}
        <ItinerarySegmentDatetime
          time={segment.arrivalDateTime.split('T')[1].slice(0, 5)}
          date={segment.arrivalDateTime.split('T')[0].slice(5, 10)}
        />
        <ItineraryTimeline noLine={isLastSegment} dotted={!isLastSegment} />
        {/* TODO: hardcoded data here */}
        <ItinerarySegmentDetails
          location={'Madrid ala madrid'}
          locationCode={segment.arrival}
          scaleDuration="3h42 mn"
          airportChange="3h40"
          luggageWarning={true}
        />
      </Stack>
    </Stack>
  )
}
