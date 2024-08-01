import { Alert, Box, Stack, Typography } from '@mui/material'
import { AirplaneIcon, TrainIcon } from '@/components'
import { RouteSegment } from '@/types'

export const ItinerarySegment = ({
  segment,
  segmentIndex,
  totalSegments,
}: {
  segment: RouteSegment
  segmentIndex: number
  totalSegments: number
}) => {
  return (
    <Stack gap={2} key={segment.id}>
      {/* Departure */}
      <Stack direction="row" gap={1}>
        <Stack width="48px" minWidth="48px" alignItems="flex-end">
          <Typography variant="labelLg" color="leclerc.red.main" fontWeight={600}>
            {segment.departureDateTime.split('T')[1].slice(0, 5)}
          </Typography>
          {/* TODO: display month's name, not number */}
          <Typography variant="labelSm">
            {segment.departureDateTime.split('T')[0].slice(5, 10)}
          </Typography>
        </Stack>
        {/* Timeline */}
        <Box position="relative" top="5px">
          <Stack width="24px" alignItems="center">
            <Box width="7px" height="7px" borderRadius="7px" bgcolor="black"></Box>
            <Box
              width="1px"
              position="absolute"
              top={0}
              bottom={-16}
              bgcolor="black"
              left={11}></Box>
          </Stack>
        </Box>
        <Box flexGrow={1}>
          <Stack direction="row" justifyContent="space-between" width="100%">
            {/* TODO: Hardcoded data here */}
            <Typography variant="bodyMd">Lyon Gare de Part-Dieu</Typography>
            <Typography variant="labelLg">{segment.departure}</Typography>
          </Stack>
        </Box>
      </Stack>
      {/* Kind */}
      <Stack direction="row" gap={1}>
        <Stack width="48px" minWidth="48px" alignItems="flex-end" justifyContent="center">
          {/* TODO: hardcoded data here */}
          <Typography variant="bodySm" position="relative" top="5px">
            2h03mn
          </Typography>
        </Stack>
        {/* Timeline */}
        <Stack position="relative" top="5px" justifyContent="center">
          <Stack width="24px" alignItems="center">
            <Stack
              bgcolor="white"
              zIndex={10}
              width="24px"
              height="24px"
              justifyContent="center"
              alignItems="center">
              {/* TODO: need to put the right icon depending of the kind of segment, if train or airplain */}
              {/* <TrainIcon /> */}
              <AirplaneIcon />
            </Stack>
            <Box
              width="1px"
              position="absolute"
              top={0}
              bottom={-16}
              bgcolor="black"
              left={11}></Box>
          </Stack>
        </Stack>
        <Stack flexGrow={1} justifyContent="flex-end">
          {/* TODO: hardcoded data here */}
          <Typography variant="bodySm">CORSAIR - 6168 - ALX6BPRT</Typography>
        </Stack>
      </Stack>
      {/* Destination */}
      <Stack direction="row" gap={1}>
        <Stack width="48px" minWidth="48px" alignItems="flex-end">
          <Typography variant="labelLg" color="leclerc.red.main" fontWeight={600}>
            {segment.arrivalDateTime.split('T')[1].slice(0, 5)}
          </Typography>
          {/* TODO: display month's name, not number */}
          <Typography variant="labelSm">
            {segment.arrivalDateTime.split('T')[0].slice(5, 10)}
          </Typography>
        </Stack>
        {/* Timeline */}
        {/* If last segment, no timeline */}
        <Box position="relative" top="5px">
          <Stack width="24px" alignItems="center">
            <Box width="7px" height="7px" borderRadius="7px" bgcolor="black"></Box>
            {segmentIndex < totalSegments && (
              <Box
                width="1px"
                position="absolute"
                top={0}
                bottom={-16}
                sx={{
                  background:
                    'repeating-linear-gradient(to bottom, black, black 4px, transparent 4px, transparent 8px)',
                }}
                left={11}></Box>
            )}
          </Stack>
        </Box>
        <Box flexGrow={1}>
          <Stack direction="row" justifyContent="space-between" width="100%">
            {/* This is the right side of the route, we can put as many details here as we want */}
            <Box>
              {/* TODO: hardcoded data here */}
              <Typography variant="bodyMd">Paris Gare de Massy</Typography>
              <Typography variant="bodySm" color="grey.700">
                Durée de l'escale : 3h42 mn
              </Typography>
              <Typography variant="bodySm" color="leclerc.red.light">
                changement d'aéroport (3h40)
              </Typography>
              <Box pt={1}>
                <Alert severity="warning">Vous devez récupérer et réenregistrer vos bagages</Alert>
              </Box>
            </Box>
            <Typography variant="labelLg">{segment.arrival}</Typography>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  )
}
