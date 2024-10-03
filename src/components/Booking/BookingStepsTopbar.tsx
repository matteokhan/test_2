'use client'

import { Box, Stack } from '@mui/material'
import { BookingStep } from '@/components'
import { useBooking } from '@/contexts'

export const BookingStepsTopbar = () => {
  const { steps, currentStep } = useBooking()
  return (
    <Stack direction="row" justifyContent="center" pb={5}>
      <Stack
        mx="70px"
        maxWidth="850px"
        position="relative"
        width="100%"
        direction="row"
        justifyContent="space-between">
        <Box position="absolute" height="1px" width="100%" bgcolor="grey.500" top="4px"></Box>
        {steps.current
          .filter((s) => !s.skip)
          .map((step) => (
            <BookingStep
              key={step.name}
              step={step}
              isActive={steps.current[currentStep].code == step.code}
            />
          ))}
      </Stack>
    </Stack>
  )
}
