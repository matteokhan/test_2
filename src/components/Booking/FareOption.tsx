import { Box, Button, Stack, Typography } from '@mui/material'
import { Fare } from '@/types'
import CheckIcon from '@mui/icons-material/Check'

export const FareOption = ({
  fare,
  onSelect,
  isSelected,
}: {
  fare: Fare
  onSelect: (fare: Fare) => void
  isSelected: boolean
}) => {
  return (
    <Box border="1px solid" borderColor="grey.400" borderRadius="6px">
      <Stack direction="row" gap={4} p={3}>
        <Box width="50%">
          <Typography variant="headlineXs" pb={1}>
            {fare.name}
          </Typography>
          <Typography variant="bodyMd">{fare.description}</Typography>
        </Box>
        <Stack gap={1} width="50%" py={0.5}>
          {fare.services.map((service) => (
            <Stack key={service.name} direction="row" alignItems="center">
              {service.icon}
              <Typography sx={{ ml: 1 }} variant="bodyMd">
                {service.name}
              </Typography>
            </Stack>
          ))}
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
        gap={1.5}>
        <Box>
          <Typography variant="titleLg" color="primary">
            {fare.price}€
          </Typography>
          <Typography variant="bodySm">par personne</Typography>
        </Box>
        <Button
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
