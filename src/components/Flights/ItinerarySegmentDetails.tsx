import { Alert, Box, Stack, Typography } from '@mui/material'

export const ItinerarySegmentDetails = ({
  location,
  locationCode,
  scaleDuration,
  airportChange,
  airportChangeTime,
}: {
  location: string
  locationCode: string
  scaleDuration?: string
  airportChange?: boolean
  airportChangeTime?: string
}) => {
  return (
    <Box flexGrow={1}>
      <Stack direction="row" justifyContent="space-between" width="100%">
        <Box>
          <Typography variant="bodyMd">{location}</Typography>
          {scaleDuration && (
            <Typography variant="bodySm" color="grey.700">
              Durée de l'escale : {scaleDuration}
            </Typography>
          )}
          {airportChange && (
            <Typography variant="bodySm" color="leclerc.red.light">
              changement d'aéroport {airportChangeTime && <span>({airportChangeTime})</span>}
            </Typography>
          )}
          {airportChange && (
            <Box pt={1}>
              <Alert severity="warning">Vous devez récupérer et réenregistrer vos bagages</Alert>
            </Box>
          )}
        </Box>
        <Typography variant="labelLg">{locationCode}</Typography>
      </Stack>
    </Box>
  )
}
