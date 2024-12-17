import { Box, Button, Stack, Typography } from '@mui/material'
import { Fare } from '@/types'
import CheckIcon from '@mui/icons-material/Check'
import { FareServices } from '@/components'

export const FareOption = ({
  basePrice,
  fare,
  onSelect,
  isSelected,
}: {
  basePrice: number
  fare: Fare
  onSelect: () => void
  isSelected: boolean
}) => {
  return (
    <Box border="1px solid" borderColor="grey.400" borderRadius="6px" data-testid="fareOption">
      <Stack direction={{ xs: 'column', lg: 'row' }} gap={{ xs: 1, lg: 4 }} p={3}>
        <Box width={{ xs: '100%', lg: '50%' }}>
          <Typography variant="headlineXs" pb={1} data-testid="fareOption-name">
            {fare.name}
          </Typography>
        </Box>
        <FareServices sx={{ width: { xs: '100%', lg: '50%' } }} services={fare.services} />
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
            +{Number(fare.price - basePrice).toFixed(2)}€
          </Typography>
        </Box>
        <Button
          data-testid="fareOption-selectButton"
          sx={{ px: 3 }}
          variant={isSelected ? 'contained' : 'outlined'}
          onClick={() => onSelect()}
          startIcon={isSelected ? <CheckIcon /> : null}>
          {isSelected ? 'Sélectionné' : 'Sélectionner'}
        </Button>
      </Stack>
    </Box>
  )
}
