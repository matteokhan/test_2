import { BookingStep as BookingStepType } from '@/types'
import { Box, Typography } from '@mui/material'

export const BookingStep = ({ step, isActive }: { step: BookingStepType; isActive: boolean }) => {
  return (
    <Box
      width="9px"
      height="9px"
      borderRadius="10px"
      position="relative"
      sx={{ bgcolor: isActive ? 'primary.main' : 'grey.500' }}
      data-testid="bookingStep">
      <Typography
        sx={{ color: isActive ? 'primary.main' : 'grey.600' }}
        variant="labelMd"
        left="-75px"
        textAlign="center"
        noWrap
        position="absolute"
        width="160px"
        top="16px">
        {step.name}
      </Typography>
    </Box>
  )
}
