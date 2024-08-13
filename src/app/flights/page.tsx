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
import { useFlights } from '@/contexts'
import { SearchFlightsParams } from '@/types'

export default function FlighsPage() {
  const { flightDetailsOpen, setFlightDetailsOpen, setSearchParams } = useFlights()
  const onSearch = ({ searchParams }: { searchParams: SearchFlightsParams }) => {
    setSearchParams(searchParams)
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
          <SearchFlightsModes onSearch={onSearch} />
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
            <FlightDetails onClose={() => setFlightDetailsOpen(false)} />
          </Drawer>
        </SectionContainer>
      </Box>
    </>
  )
}
