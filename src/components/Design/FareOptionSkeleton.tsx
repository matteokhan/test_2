import React from 'react'
import { Box, Skeleton, Stack } from '@mui/material'

export const FareOptionSkeleton = () => {
  return (
    <Box
      border="1px solid"
      borderColor="grey.400"
      borderRadius="6px"
      data-testid="fareOptionSkeleton">
      <Stack direction={{ xs: 'column', lg: 'row' }} gap={{ xs: 1, lg: 4 }} p={3}>
        <Box width={{ xs: '100%', lg: '50%' }}>
          <Skeleton variant="text" width="100%" height={24} />
          <Skeleton variant="text" width="100%" height={20} />
        </Box>
        <Stack gap={1} width={{ xs: '100%', lg: '50%' }} py={0.5}>
          <Skeleton variant="rectangular" width="100%" height={150} />
        </Stack>
      </Stack>
      <Stack
        borderTop="1px solid"
        borderColor="grey.400"
        py={2}
        sx={{ px: { xs: 2, lg: 3 } }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={1.5}>
        <Skeleton variant="text" width={100} height={50} />
        <Skeleton variant="text" width={100} height={50} />
      </Stack>
    </Box>
  )
}
