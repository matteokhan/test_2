import { Insurance, InsuranceWithSteps } from '@/types'
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import DOMPurify from 'dompurify'
import { useBooking, useFlights } from '@/contexts'

export const InsuranceOption = ({
  insurance,
  isSelected,
  onSelect,
}: {
  insurance: InsuranceWithSteps
  isSelected: boolean
  onSelect: (insurance: Insurance | null) => void
}) => {
  const { totalPassengers } = useFlights()
  const { totalPrice } = useBooking()

  const getInsurancePrice = (
    amount: number,
    insurance: InsuranceWithSteps,
    totalPeople: number,
  ) => {
    const rate = amount / totalPeople
    const step = insurance.steps.find((step) => {
      return Number(step.min) <= rate && Number(step.max) >= rate
    })
    // TODO: Is this the price per person? I guess yes, bc the formula for total price is amount * totalPeople
    return Number(step?.amount)
  }

  const perPersonInsurancePrice = getInsurancePrice(totalPrice, insurance, totalPassengers)

  return (
    <Grid item xs={12} sm={6} style={{ display: 'flex' }} data-testid="insuranceOption">
      <Stack border="1px solid" borderColor="grey.400" borderRadius="6px" flexGrow={1} width="100%">
        {/* TODO: add image */}
        <Box height="200px" borderBottom="1px solid red" flexShrink={0}>
          Image
        </Box>
        <Stack p={3} flexGrow={1}>
          <Typography variant="headlineXs" pb={1} data-testid="insuranceOption-title">
            {insurance.title}
          </Typography>
          {/* TODO: hardcoded data. This info is not part of the server response */}
          <Typography variant="bodyMd" pb={1} data-testid="insuranceOption-subtitle">
            <b>(HARDCODED)</b> Nous gérons votre enregistrement et l’envoi des cartes d’embarquement
            par e-mail est automatique
          </Typography>
          {/* TODO: which option should we use? 
          First option is using insurance.description and dompurify
          Second option is converting the same info to JSON and put the styles */}
          <Box border="1px solid green" data-testid="insuranceOption-description">
            <div
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(insurance.description) }}></div>
          </Box>
          <Stack
            gap={1}
            py={0.5}
            flexGrow={1}
            border="1px solid blue"
            data-testid="insuranceOption-description">
            <Stack direction="row">
              <CheckIcon color="primary" />
              <Typography sx={{ ml: 1 }} variant="bodyMd">
                <b>(HARDCODED)</b> Problème de santé duant le séjour : assistance médicale 24h/24h.
              </Typography>
            </Stack>
            <Stack direction="row">
              <CheckIcon color="primary" />
              <Typography sx={{ ml: 1 }} variant="bodyMd">
                <b>(HARDCODED)</b> Hospitalisation et quarantaine dont cause épidémique et COVID :
                prise en charge jusqu’à 150 000€ par personne.
              </Typography>
            </Stack>
            <Stack direction="row">
              <CheckIcon color="primary" />
              <Typography sx={{ ml: 1 }} variant="bodyMd">
                <b>(HARDCODED)</b> Téléconsultation voyageur : accès 24H/24 à un médecin français
              </Typography>
            </Stack>
          </Stack>
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
              onSelect({
                id: insurance.id,
                title: insurance.title,
                code: insurance.code,
                amount: perPersonInsurancePrice,
                currency: 'EUR',
              })
            }}
            startIcon={isSelected ? <CheckIcon /> : null}>
            {isSelected ? 'Sélectionné' : 'Sélectionner cette formule'}
          </Button>
        </Stack>
      </Stack>
    </Grid>
  )
}
