import { InsuranceWithSteps } from '@/types'
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import DOMPurify from 'dompurify'
import { useBooking, useFlights } from '@/contexts'
import { getInsurancePrice } from '@/utils'

export const InsuranceOption = ({
  insurance,
  isSelected,
  onSelect,
}: {
  insurance: InsuranceWithSteps
  isSelected: boolean
  onSelect: (insurance: InsuranceWithSteps | null) => void
}) => {
  const { totalPassengers } = useFlights()
  const { basePrice } = useBooking()
  const perPersonInsurancePrice = getInsurancePrice(basePrice, insurance, totalPassengers)

  return (
    <Grid item xs={12} sm={6} style={{ display: 'flex' }} data-testid="insuranceOption">
      <Stack border="1px solid" borderColor="grey.400" borderRadius="6px" flexGrow={1} width="100%">
        {/* TODO: add image */}
        {/* <Box height="200px" flexShrink={0}>
          Image
        </Box> */}
        <Stack p={3} flexGrow={1}>
          <Typography variant="headlineXs" pb={1} data-testid="insuranceOption-title">
            {insurance.title}
          </Typography>
          <Box data-testid="insuranceOption-description">
            <div
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(insurance.description) }}></div>
          </Box>
        </Stack>
        <Stack
          borderTop="1px solid"
          borderColor="grey.400"
          px={3}
          py={2}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          flexShrink={0}>
          <Box>
            <Typography variant="titleLg" color="primary" data-testid="insuranceOption-price">
              +{perPersonInsurancePrice}€
            </Typography>
            <Typography variant="bodySm" noWrap>
              par personne
            </Typography>
          </Box>
          <Button
            data-testid="insuranceOption-selectButton"
            sx={{ px: 3 }}
            variant={isSelected ? 'contained' : 'outlined'}
            onClick={() => {
              if (isSelected) {
                onSelect(null)
                return
              }
              onSelect(insurance)
            }}
            startIcon={isSelected ? <CheckIcon /> : null}>
            {isSelected ? 'Sélectionné' : 'Sélectionner cette formule'}
          </Button>
        </Stack>
      </Stack>
    </Grid>
  )
}
