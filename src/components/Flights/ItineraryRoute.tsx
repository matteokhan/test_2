import { Route } from '@/types'
import { Alert, Box, Stack, Typography } from '@mui/material'
import { AirplaneIcon, TrainIcon } from '@/components'

export const ItineraryRoute = ({ route }: { route: Route }) => {
  return (
    <Box maxWidth="590px" border="1px solid" borderColor="grey.400" borderRadius={1}>
      <Box py={1.5} px={2}>
        <Typography variant="titleMd">Lyon - Point à Pitre</Typography>
        <Typography variant="bodyMd" color="grey.800">
          9 juin 2024 - durée 28h45mn - 1 escale (3h40)
        </Typography>
      </Box>
      <Stack p={2} gap={2}>
        {/* Train Segment */}
        <Stack gap={2}>
          {/* Departure */}
          <Stack direction="row" gap={1}>
            <Stack width="48px" alignItems="flex-end">
              <Typography variant="labelLg" color="leclerc.red.main" fontWeight={600}>
                06:30
              </Typography>
              <Typography variant="labelSm">18 mai</Typography>
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
                <Typography variant="bodyMd">Lyon Gare de Part-Dieu</Typography>
                <Typography variant="labelLg">XDY</Typography>
              </Stack>
            </Box>
          </Stack>
          {/* Kind */}
          <Stack direction="row" gap={1}>
            <Stack width="48px" alignItems="flex-end" justifyContent="center">
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
                  <TrainIcon />
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
            <Box flexGrow={1}>
              <Stack direction="row" justifyContent="space-between" width="100%">
                <Box>
                  <Typography variant="bodySm">Lyon Gare de Part-Dieu</Typography>
                  <Typography variant="titleSm">Lyon Gare de Part-Dieu</Typography>
                </Box>
                <Typography variant="labelLg">XDY</Typography>
              </Stack>
            </Box>
          </Stack>
          {/* Destination */}
          <Stack direction="row" gap={1}>
            <Stack width="48px" alignItems="flex-end">
              <Typography variant="labelLg" color="leclerc.red.main" fontWeight={600}>
                06:30
              </Typography>
              <Typography variant="labelSm">18 mai</Typography>
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
                  sx={{
                    background:
                      'repeating-linear-gradient(to bottom, black, black 4px, transparent 4px, transparent 8px)',
                  }}
                  left={11}></Box>
              </Stack>
            </Box>
            <Box flexGrow={1}>
              <Stack direction="row" justifyContent="space-between" width="100%">
                <Box>
                  <Typography variant="bodyMd">Lyon Gare de Part-Dieu</Typography>
                  <Typography variant="bodyMd">Lyon Gare de Part-Dieu</Typography>
                  <Alert>Come on! Com</Alert>
                </Box>
                <Typography variant="labelLg">XDY</Typography>
              </Stack>
            </Box>
          </Stack>
        </Stack>
        {/* Plane Segment */}
        <Stack gap={2}>
          {/* Departure */}
          <Stack direction="row" gap={1}>
            <Stack width="48px" alignItems="flex-end">
              <Typography variant="labelLg" color="leclerc.red.main" fontWeight={600}>
                06:30
              </Typography>
              <Typography variant="labelSm">18 mai</Typography>
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
                <Typography variant="bodyMd">Lyon Gare de Part-Dieu</Typography>
                <Typography variant="labelLg">XDY</Typography>
              </Stack>
            </Box>
          </Stack>
          {/* Kind */}
          <Stack direction="row" gap={1}>
            <Stack width="48px" alignItems="flex-end" justifyContent="center">
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
            <Box flexGrow={1}>
              <Stack direction="row" justifyContent="space-between" width="100%">
                <Box>
                  <Typography variant="bodySm">Lyon Gare de Part-Dieu</Typography>
                  <Typography variant="bodyMd">Lyon Gare de Part-Dieu</Typography>
                  <Typography variant="bodyMd">Lyon Gare de Part-Dieu</Typography>
                </Box>
                <Typography variant="labelLg">XDY</Typography>
              </Stack>
            </Box>
          </Stack>
          {/* Destination */}
          <Stack direction="row" gap={1}>
            <Stack width="48px" alignItems="flex-end">
              <Typography variant="labelLg" color="leclerc.red.main" fontWeight={600}>
                06:30
              </Typography>
              <Typography variant="labelSm">18 mai</Typography>
            </Stack>
            {/* Timeline */}
            <Box position="relative" top="5px">
              <Stack width="24px" alignItems="center">
                <Box width="7px" height="7px" borderRadius="7px" bgcolor="black"></Box>
              </Stack>
            </Box>
            <Box flexGrow={1}>
              <Stack direction="row" justifyContent="space-between" width="100%">
                <Box>
                  <Typography variant="bodyMd">Lyon Gare de Part-Dieu</Typography>
                  <Typography variant="bodyMd">Lyon Gare de Part-Dieu</Typography>
                </Box>
                <Typography variant="labelLg">XDY</Typography>
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}
