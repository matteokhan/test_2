import { Stack, Typography } from '@mui/material'

export const ItinerarySegmentDatetime = ({
  time,
  date,
  daysToArrival,
}: {
  time: string
  date: string
  daysToArrival?: number
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
      {daysToArrival != undefined && daysToArrival > 0 && (
        <Typography
          variant="bodySm"
          color="grey.700"
          data-testid="flightRouteDetails-daysToArrival">
          J+{daysToArrival}
        </Typography>
      )}
    </Stack>
  )
}
