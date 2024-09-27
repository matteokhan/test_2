'use client'

import { useAirlinesData } from '@/services'
import { RouteCarrier, RouteSegmentCarrier } from '@/types'
import { Skeleton, Stack, SxProps, Typography } from '@mui/material'
import Image from 'next/image'

export const FlightAirline = ({
  carrier,
  sx,
}: {
  carrier: RouteCarrier | RouteSegmentCarrier
  sx?: SxProps
}) => {
  const { data: airlinesData } = useAirlinesData()
  return (
    <Stack gap={0.5} sx={{ ...sx }} data-testid="flightAirline">
      {/* TODO: default image */}
      <Stack
        width="35px"
        height="35px"
        borderColor="grey.400"
        alignItems="center"
        justifyContent="center">
        {airlinesData ? (
          <Image
            src={airlinesData[carrier]?.logo_small_path || ''}
            alt={airlinesData ? airlinesData[carrier]?.name : 'Airline logo'}
            width={35}
            height={35}
            unoptimized={true}
          />
        ) : (
          <Skeleton variant="rectangular" width={35} height={35} />
        )}
      </Stack>
      <Typography variant="bodySm" color="grey.700" data-testid="flightAirline-name">
        {airlinesData ? airlinesData[carrier]?.name : ''}
      </Typography>
    </Stack>
  )
}
