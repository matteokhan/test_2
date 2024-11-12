import { Stack, SxProps, Typography } from '@mui/material'
import { FareService } from '@/types'

export const FareServices = ({ services, sx }: { services: FareService[]; sx?: SxProps }) => {
  return (
    <Stack sx={{ ...sx }} gap={1} py={0.5} data-testid="fareOption-services">
      {services.length === 0 && (
        <Typography variant="bodyMd" data-testid="fareOption-noServices">
          Aucun service inclus
        </Typography>
      )}
      {services.map((service, index) => (
        <Stack key={index} direction="row" alignItems="center" data-testid="fareOption-service">
          {service.icon}
          <Typography sx={{ ml: 1 }} variant="bodyMd" data-testid="fareOption-serviceName">
            {service.name}
          </Typography>
        </Stack>
      ))}
    </Stack>
  )
}
