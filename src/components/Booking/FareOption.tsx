import { Box, Button, Stack, Typography } from '@mui/material'
import { Solution } from '@/types'
import CheckIcon from '@mui/icons-material/Check'
import { getFareData } from '@/utils'

export const FareOption = ({
  basePrice,
  fare,
  onSelect,
  isSelected,
}: {
  basePrice: number
  fare: Solution
  onSelect: (fare: Solution) => void
  isSelected: boolean
}) => {
  const fareData = getFareData(fare)
  return (
    <Box border="1px solid" borderColor="grey.400" borderRadius="6px" data-testid="fareOption">
      <Stack direction={{ xs: 'column', lg: 'row' }} gap={{ xs: 1, lg: 4 }} p={3}>
        <Box width={{ xs: '100%', lg: '50%' }}>
          <Typography variant="headlineXs" pb={1} data-testid="fareOption-name">
            {fareData.name}
          </Typography>
          <Typography variant="bodyMd" data-testid="fareOption-description">
            {fareData.description}
          </Typography>
        </Box>
        <Stack gap={1} width={{ xs: '100%', lg: '50%' }} py={0.5} data-testid="fareOption-services">
          {fareData.services.map((service) => (
            <Stack
              key={service.name}
              direction="row"
              alignItems="center"
              data-testid="fareOption-service">
              {service.icon}
              <Typography sx={{ ml: 1 }} variant="bodyMd" data-testid="fareOption-serviceName">
                {service.name}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
      <Stack
        borderTop="1px solid"
        borderColor="grey.400"
        py={2}
        sx={{ px: { xs: 2, lg: 3 } }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={1.5}>
        <Box>
          <Typography variant="titleLg" color="primary" data-testid="fareOption-price">
            +{Number(fareData.price - basePrice).toFixed(2)}€
          </Typography>
        </Box>
        <Button
          data-testid="fareOption-selectButton"
          sx={{ px: 3 }}
          variant={isSelected ? 'contained' : 'outlined'}
          onClick={() => onSelect(fare)}
          startIcon={isSelected ? <CheckIcon /> : null}>
          {isSelected ? 'Sélectionné' : 'Sélectionner'}
        </Button>
      </Stack>
    </Box>
  )
}
