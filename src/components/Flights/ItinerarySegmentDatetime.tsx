import { Stack, Typography } from '@mui/material'

export const ItinerarySegmentDatetime = ({ time, date }: { time: string; date: string }) => {
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
    </Stack>
  )
}
