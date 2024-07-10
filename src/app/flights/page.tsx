import {
  Header,
  SearchFlightsModes,
  SectionContainer,
  FlightResult,
  SearchFlightsFilters,
} from '@/components'
import { Box, Stack } from '@mui/material'

export default function Flights() {
  return (
    <>
      <Header />
      <Box
        sx={{
          backgroundColor: 'grey.200',
        }}>
        <SectionContainer
          sx={{ justifyContent: 'space-between', paddingY: 3, flexDirection: 'column' }}>
          <SearchFlightsModes />
          <Stack direction="row" spacing={2} mt={2}>
            <SearchFlightsFilters />
            <FlightResult />
          </Stack>
        </SectionContainer>
      </Box>
    </>
  )
}
