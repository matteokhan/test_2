import { useBooking } from '@/contexts'
import { Box, Stack, Typography } from '@mui/material'
import { getPassengerTypeDescription } from '@/utils'

export const PassengersSummary = () => {
  const { passengers } = useBooking()
  return (
    <Stack gap={2} data-testid="passengersSummary">
      {passengers.map((passenger, index) => (
        <Box
          key={index}
          pt={2}
          borderTop="1px solid"
          sx={{ borderColor: index === 0 ? 'transparent' : 'grey.400' }}>
          <Typography variant="bodyMd" fontWeight={500} data-testid="passengersSummary-name">
            {passenger.firstName} {passenger.lastName} -{' '}
            {passenger.salutation === 'Mr' ? 'homme' : 'femme'}
          </Typography>
          <Typography variant="bodyMd" color="grey.700" data-testid="passengersSummary-birthDate">
            {getPassengerTypeDescription(passenger.type)} -{' '}
            {passenger.dateOfBirth?.format('DD/MM/YYYY')}
          </Typography>
          {passenger?.email && (
            <Typography variant="bodyMd" color="grey.700" data-testid="passengersSummary-email">
              {passenger.email}
            </Typography>
          )}
          {passenger?.phoneNumber && (
            <Typography variant="bodyMd" color="grey.700" data-testid="passengersSummary-email">
              {passenger.phoneNumber}
            </Typography>
          )}
        </Box>
      ))}
    </Stack>
  )
}
