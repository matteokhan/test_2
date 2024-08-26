'use client'

import React from 'react'
import {
  Header,
  SearchFlightsModes,
  SectionContainer,
  SearchFlights,
  FlightDetails,
} from '@/components'
import { Box, Drawer } from '@mui/material'
import { useBooking, useFlights } from '@/contexts'
import { SearchFlightsParams, Solution } from '@/types'

export default function FlighsPage() {
  const { flightDetailsOpen, setFlightDetailsOpen, setSearchParams } = useFlights()
  const { selectFlight, goToStep } = useBooking()
  const onSearch = ({ searchParams }: { searchParams: SearchFlightsParams }) => {
    setSearchParams(searchParams)
  }
  const handleSelectFlight = ({ flight }: { flight: Solution | null }) => {
    setFlightDetailsOpen(false)
    selectFlight(flight)
    goToStep(0)
  }
  return (
    <>
      <Header />
      <Box
        sx={{
          backgroundColor: 'grey.200',
        }}>
        <SectionContainer
          sx={{ justifyContent: 'space-between', paddingY: 3, flexDirection: 'column' }}>
          <SearchFlightsModes onSearch={onSearch} sx={{ mb: 3 }} />
          <SearchFlights />
          <Drawer
            open={flightDetailsOpen}
            onClose={() => setFlightDetailsOpen(false)}
            anchor="right"
            PaperProps={{
              sx: {
                borderRadius: 0,
              },
            }}>
            <FlightDetails
              onClose={() => setFlightDetailsOpen(false)}
              onSelectFlight={handleSelectFlight}
            />
          </Drawer>
        </SectionContainer>
      </Box>
    </>
  )
}
