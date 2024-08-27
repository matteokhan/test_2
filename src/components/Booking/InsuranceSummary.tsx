import { useBooking } from '@/contexts'
import { Box, Typography } from '@mui/material'

export const InsuranceSummary = () => {
  const { selectedInsurance } = useBooking()
  return (
    <Box pt={2} data-testid="payerSummary">
      <Typography variant="bodyMd" fontWeight={500} data-testid="payerSummary-name">
        {selectedInsurance ? selectedInsurance.title : 'Sans assurance'}
      </Typography>
    </Box>
  )
}
