import React from 'react'
import { Box, Stack } from '@mui/material'

type PropsWithIcon = {
  icon: React.ReactNode
  noLine?: never
  dotted?: never
}

type PropsWithoutIcon = {
  icon?: never
  noLine?: boolean
  dotted?: boolean
}

type ItineraryTimelineProps = PropsWithIcon | PropsWithoutIcon

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  noLine = false,
  dotted = false,
  icon,
}) => {
  return (
    <Stack position="relative" top="5px" {...(icon && { justifyContent: 'center' })}>
      <Stack width="24px" alignItems="center">
        {!icon && <Box width="7px" height="7px" borderRadius="7px" bgcolor="black"></Box>}
        {icon && (
          <Stack
            bgcolor="white"
            zIndex={10}
            width="24px"
            height="24px"
            justifyContent="center"
            alignItems="center"
            data-testid="itineraryTimeline-icon">
            {icon}
          </Stack>
        )}
        {!noLine && (
          <Box
            width="1px"
            position="absolute"
            top={0}
            bottom={-16}
            sx={{
              background: dotted
                ? 'repeating-linear-gradient(to bottom, black, black 4px, transparent 4px, transparent 8px)'
                : 'black',
            }}
            left={11}></Box>
        )}
      </Stack>
    </Stack>
  )
}
