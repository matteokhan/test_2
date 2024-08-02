'use client'

import React from 'react'
import {
  Header,
  SearchFlightsModes,
  SectionContainer,
  SearchFlights,
  FlightDetails,
} from '@/components'
import { Box, Drawer, Stack } from '@mui/material'
import { useFlights } from '@/contexts'

export default function FlighsPage() {
  // TODO: Try to remove this dependency and render SearchFlights always
  const { searchParams, flightDetailsOpen, setFlightDetailsOpen } = useFlights()

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
            {searchParams.segments.length > 0 && <SearchFlights />}
          </Stack>
          <Drawer
            open={flightDetailsOpen}
            onClose={() => setFlightDetailsOpen(false)}
            anchor="right"
            PaperProps={{
              sx: {
                borderRadius: 0,
              },
            }}>
            <FlightDetails onClose={() => setFlightDetailsOpen(false)} />
          </Drawer>
        </SectionContainer>
      </Box>
    </>
  )
}
