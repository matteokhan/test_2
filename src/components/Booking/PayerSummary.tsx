import { useBooking } from '@/contexts'
import { Box, Typography } from '@mui/material'

export const PayerSummary = () => {
  const { payer } = useBooking()
  return (
    <Box pt={2} data-testid="payerSummary">
      <Typography variant="bodyMd" fontWeight={500} data-testid="payerSummary-name">
        {payer?.firstName} {payer?.lastName} - {payer?.salutation === 'Mr' ? 'homme' : 'femme'}
      </Typography>
      {/* TODO: Hardcoded data here. Or maybe payer is always adult */}
      <Typography variant="bodyMd" color="grey.700" data-testid="payerSummary-birthDate">
        Adulte - {payer?.dateOfBirth?.format('DD/MM/YYYY')}
      </Typography>
      <Typography variant="bodyMd" color="grey.700" data-testid="payerSummary-email">
        {payer?.email}
      </Typography>
      <Typography variant="bodyMd" color="grey.700" data-testid="payerSummary-phone">
        (+{payer?.phoneCode}) {payer?.phoneNumber}
      </Typography>
      <Box pt={1}>
        <Typography variant="bodyMd" color="grey.700" data-testid="payerSummary-address">
          {payer?.address}
        </Typography>
        <Typography variant="bodyMd" color="grey.700" data-testid="payerSummary-city">
          {payer?.city}
        </Typography>
        <Typography variant="bodyMd" color="grey.700" data-testid="payerSummary-country">
          {payer?.country}
        </Typography>
      </Box>
    </Box>
  )
}
