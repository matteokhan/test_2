'use client'

import { useAirlinesData } from '@/services'
import { RouteCarrier, RouteSegmentCarrier } from '@/types'
import { Skeleton, Stack, Typography } from '@mui/material'
import Image from 'next/image'

export const FlightAirline = ({ carrier }: { carrier: RouteCarrier | RouteSegmentCarrier }) => {
  const { data: airlinesData } = useAirlinesData()
  return (
    <Stack gap={0.5} data-testid="flightAirline">
      {/* TODO: default image */}
      <Stack
        width="32px"
        height="32px"
        borderRadius="32px"
        border="1px solid"
        borderColor="grey.400"
        alignItems="center"
        justifyContent="center">
        {airlinesData ? (
          <Image
            src={airlinesData[carrier]?.logo_small_path || ''}
            alt={airlinesData ? airlinesData[carrier]?.name : 'Airline logo'}
            width={21}
            height={21}
            unoptimized={true}
          />
        ) : (
          <Skeleton variant="circular" width={32} height={32} />
        )}
      </Stack>
      <Typography variant="bodySm" color="grey.700" data-testid="flightAirline-name">
        {airlinesData ? airlinesData[carrier]?.name : ''}
      </Typography>
    </Stack>
  )
}
