import React from 'react'
import { Box, Skeleton, Stack } from '@mui/material'

export const AgencySkeleton = () => {
  return (
    <Box p={2} borderBottom="1px solid" borderColor="grey.200" data-testid="agencySkeleton">
      <Skeleton variant="text" width={250} height={24} />
      <Skeleton variant="text" width={250} height={24} />
      <Skeleton variant="text" width={250} height={24} />
      <Stack direction="row" pt={2} justifyContent="flex-end" gap={1}>
        <Skeleton variant="rectangular" width={120} height={40} />
        <Skeleton variant="rectangular" width={120} height={40} />
      </Stack>
    </Box>
  )
}
