import { Alert, Box, Stack, Typography } from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning'

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
      <Stack direction="row" justifyContent="space-between" width="100%" gap={2}>
        <Box>
          <Typography variant="bodyMd" data-testid="itinerarySegmentDetails-location">
            {location}
          </Typography>
          {scaleDuration && (
            <Typography
              variant="bodySm"
              color="grey.700"
              data-testid="itinerarySegmentDetails-scaleDuration">
              Durée de l'escale : {scaleDuration}
            </Typography>
          )}
          {airportChange && (
            <Typography
              variant="bodySm"
              color="leclerc.red.light"
              data-testid="itinerarySegmentDetails-airportChange">
              changement d'aéroport {airportChangeTime && <span>({airportChangeTime})</span>}
            </Typography>
          )}
          {airportChange && (
            <Box pt={1} data-testid="itinerarySegmentDetails-airportChangeWarning">
              <Alert
                severity="error"
                icon={<WarningIcon fontSize="inherit" sx={{ color: 'leclerc.red.main' }} />}>
                Vous devez récupérer et réenregistrer vos bagages
              </Alert>
            </Box>
          )}
        </Box>
        <Typography variant="labelLg" data-testid="itinerarySegmentDetails-locationCode">
          {locationCode}
        </Typography>
      </Stack>
    </Box>
  )
}
