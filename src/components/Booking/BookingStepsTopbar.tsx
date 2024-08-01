import { Box, Stack } from '@mui/material'
import { BookingStep } from '@/components'
import { BookingStep as BookingStepType } from '@/types'

export const BookingStepsTopbar = ({ steps }: { steps: BookingStepType[] }) => {
  return (
    <Stack direction="row" justifyContent="center" pb={4}>
      <Stack
        mx="70px"
        maxWidth="850px"
        position="relative"
        width="100%"
        direction="row"
        justifyContent="space-between">
        <Box position="absolute" height="1px" width="100%" bgcolor="grey.500" top="4px"></Box>
        {steps.map((step) => (
          <BookingStep key={step.name} step={step} />
        ))}
      </Stack>
    </Stack>
  )
}
