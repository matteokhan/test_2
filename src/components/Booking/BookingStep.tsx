import { BookingStep as BookingStepType } from '@/types'
import { Box, Typography } from '@mui/material'

export const BookingStep = ({ step }: { step: BookingStepType }) => {
  return (
    <Box
      width="9px"
      height="9px"
      borderRadius="10px"
      position="relative"
      sx={{ bgcolor: step.isActive ? 'primary.main' : 'grey.500' }}>
      <Typography
        sx={{ color: step.isActive ? 'primary.main' : 'grey.600' }}
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
