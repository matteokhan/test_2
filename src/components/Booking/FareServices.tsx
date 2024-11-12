import { Stack, SxProps, Typography } from '@mui/material'
import { FareService } from '@/types'

export const FareServices = ({ services, sx }: { services: FareService[]; sx?: SxProps }) => {
  return (
    <Stack sx={{ ...sx }} gap={1} py={0.5} data-testid="fareOption-services">
      {services.map((service) => (
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
  )
}
