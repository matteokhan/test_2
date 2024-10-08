import React from 'react'
import { Box, Skeleton, Stack } from '@mui/material'
import { SimpleContainer } from '@/components'

const AncillaryServiceSkeleton = () => {
  return (
    <Stack border="1px solid" borderColor="grey.400" borderRadius="6px" flexGrow={1} width="100%">
      <Stack sx={{ p: 2 }} flexGrow={1}>
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
        <Skeleton variant="text" sx={{ fontSize: '0.5rem' }} />
        <Stack pt={1} direction="row" gap={1}>
          <Skeleton variant="rectangular" height={32} width={66} />
          <Skeleton variant="rectangular" height={32} width={66} />
        </Stack>
      </Stack>
      <Stack
        borderTop="1px solid"
        borderColor="grey.400"
        py={2}
        sx={{ px: 2 }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        flexShrink={0}>
        <Box width={70}>
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '0.5rem' }} />
        </Box>
        <Skeleton variant="rectangular" height={32} width={66} />
      </Stack>
    </Stack>
  )
}

export const PassengerAncillariesSkeleton = () => {
  return (
    <SimpleContainer data-testid="ancillariesSkeleton">
      <Stack gap={2} sx={{ pt: { xs: 3, lg: 4 } }}>
        <Skeleton variant="rectangular" height={40} width="50%" />
        <Stack gap={2} direction="row">
          <AncillaryServiceSkeleton />
          <AncillaryServiceSkeleton />
        </Stack>
      </Stack>
    </SimpleContainer>
  )
}
