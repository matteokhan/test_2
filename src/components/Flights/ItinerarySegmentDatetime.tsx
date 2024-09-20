import { Stack, Typography } from '@mui/material'

export const ItinerarySegmentDatetime = ({
  time,
  date,
  daysSinceTravelStart,
}: {
  time: string
  date: string
  daysSinceTravelStart?: number
}) => {
  return (
    <Stack width="48px" minWidth="48px" alignItems="flex-end">
      <Typography
        variant="labelLg"
        color="leclerc.red.main"
        fontWeight={600}
        data-testid="itinerarySegmentDatetime-time">
        {time}
      </Typography>
      <Typography variant="labelSm" data-testid="itinerarySegmentDatetime-date">
        {date}
      </Typography>
      {daysSinceTravelStart != undefined && daysSinceTravelStart > 0 && (
        <Typography
          variant="bodySm"
          color="grey.700"
          data-testid="flightRouteDetails-daysSinceTravelStart">
          J+{daysSinceTravelStart}
        </Typography>
      )}
    </Stack>
  )
}
