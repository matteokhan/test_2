import { Route } from '@/types'
import { Box, Stack, Typography } from '@mui/material'
import { ItinerarySegment } from '@/components'

export const ItineraryRoute = ({ route }: { route: Route }) => {
  return (
    <Box maxWidth="590px" border="1px solid" borderColor="grey.400" borderRadius={1}>
      <Box py={1.5} px={2}>
        {/* TODO: hardcoded data here */}
        <Typography variant="titleMd">Lyon - Point à Pitre</Typography>
        <Typography variant="bodyMd" color="grey.800">
          9 juin 2024 - durée 28h45mn - 1 escale (3h40)
        </Typography>
      </Box>
      <Stack p={2} gap={2}>
        {route.segments.map((segment, index) => (
          <ItinerarySegment segment={segment} isLastSegment={index === route.segments.length - 1} />
        ))}
      </Stack>
    </Box>
  )
}
