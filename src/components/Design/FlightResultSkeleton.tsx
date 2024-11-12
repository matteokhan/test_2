import React from 'react'
import { Box, Paper, Skeleton, Stack } from '@mui/material'

export const FlightResultSkeleton = () => {
  return (
    <Paper sx={{ padding: 2 }} data-testid="flightResultSkeleton">
      {/* Desktop */}
      <Stack gap={5.5} direction="row" display={{ xs: 'none', lg: 'flex' }} className="desktop">
        <Stack flexGrow={1}>
          <Stack gap={4} direction="row">
            <Box minWidth="25%" maxWidth="25%">
              <Skeleton variant="rectangular" height={118} />
            </Box>
            <Stack flexGrow={1}>
              <Skeleton variant="rectangular" height={118} />
            </Stack>
          </Stack>
          <Stack gap={4} direction="row">
            <Stack minWidth="25%"></Stack>
            <Box flexGrow={1} py={2}>
              <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
            </Box>
          </Stack>
          <Stack gap={4} direction="row">
            <Box minWidth="25%" maxWidth="25%">
              <Skeleton variant="rectangular" height={118} />
            </Box>
            <Stack flexGrow={1}>
              <Skeleton variant="rectangular" height={118} />
            </Stack>
          </Stack>
        </Stack>
        <Stack gap={1} minWidth="23%" alignSelf="flex-end">
          <Skeleton variant="rectangular" width={167} height={154} />
        </Stack>
      </Stack>

      {/* Mobile */}
      <Stack gap={1} display={{ xs: 'flex', lg: 'none' }} className="mobile">
        <Skeleton variant="rectangular" height={64} />
        <Skeleton variant="rectangular" height={64} />
        <Skeleton variant="rectangular" height={64} />
      </Stack>
    </Paper>
  )
}
