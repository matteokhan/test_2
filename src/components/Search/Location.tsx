import { LocationData } from '@/types'
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined'
import { Box, Stack, Typography } from '@mui/material'
import { AirplaneIcon, TrainIcon } from '@/components'

export const Location = ({
  location,
  noBorder,
  onClick,
}: {
  location: LocationData
  noBorder: boolean
  onClick: (location: LocationData) => void
}) => {
  return (
    <Stack
      py={1.5}
      borderBottom="1px solid"
      borderColor={noBorder ? 'transparent' : 'grey.200'}
      direction="row"
      gap={2}
      alignItems="center"
      boxSizing="border-box"
      sx={{ '&:hover': { cursor: 'pointer' } }}
      onClick={() => onClick(location)}>
      <>
        {location.category == 'City' && <PinDropOutlinedIcon />}
        {location.category == 'Airport' && (
          <Stack ml={2} sx={{ rotate: '180deg' }} justifyContent="center">
            <AirplaneIcon />
          </Stack>
        )}
        {location.category == 'Rail station' && (
          <Stack ml={2} justifyContent="center">
            <TrainIcon />
          </Stack>
        )}
        <Box>
          {location.category == 'City' && (
            <Typography variant="titleSm">
              {location.name} ({location.code} - Tous les aéroports)
            </Typography>
          )}
          {['Airport', 'Rail station'].includes(location.category) && (
            <Typography variant="titleSm">
              {location.name} ({location.code}) {location.extension}
            </Typography>
          )}
          <Typography variant="bodyMd" color="#49454F">
            {location.name}, {location.country_name}
          </Typography>
        </Box>
      </>
    </Stack>
  )
}
