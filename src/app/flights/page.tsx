'use client'

import {
  Header,
  SearchFlightsModes,
  SectionContainer,
  FlightResult,
  SearchFlightsFilters,
} from '@/components'
import { Box, Stack } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'

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
          {/* <Grid container spacing={2} mt={2}>
            <Grid xs={4}>
              <SearchFlightsFilters onSubmit={(values) => console.log(values)} />
            </Grid>
            <Grid xs={8}>
              <FlightResult />
            </Grid>
          </Grid> */}
          <Stack direction="row" spacing={2} mt={2}>
            <SearchFlightsFilters onSubmit={(values) => console.log(values)} />
            <FlightResult />
          </Stack>
        </SectionContainer>
      </Box>
    </>
  )
}
