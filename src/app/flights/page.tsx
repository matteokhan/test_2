'use client'

import React from 'react'
import {
  Navbar,
  SearchFlightsModes,
  SectionContainer,
  SearchFlights,
  FlightDetails,
  TopBar,
} from '@/components'
import { Box, Drawer } from '@mui/material'
import { useBooking, useFlights } from '@/contexts'
import { SearchFlightsParams, Solution } from '@/types'
import { useCreateReservation } from '@/services'
import { getCreateReservationDto } from '@/utils'

export default function FlighsPage() {
  const { flightDetailsOpen, setFlightDetailsOpen, setSearchParams } = useFlights()
  const { selectFlight, goToStep, setReservation, correlationId } = useBooking()
  const onSearch = ({ searchParams }: { searchParams: SearchFlightsParams }) => {
    setSearchParams(searchParams)
  }
  const { mutate: createReservation, isPending: isCreatingReservation } = useCreateReservation()
  const handleSelectFlight = async ({ flight }: { flight: Solution }) => {
    if (!correlationId) {
      // TODO: log this somewhere
      // TODO: Warn the user that something went wrong
      return
    }
    const createReservationDto = getCreateReservationDto({ correlationId, flight })
    createReservation(createReservationDto, {
      onSuccess: (reservation) => {
        setReservation(reservation)
        selectFlight(flight)
        setFlightDetailsOpen(false)
        goToStep(0)
      },
      onError: (error) => {
        // TODO: log this somewhere
        // TODO: Warn the user that something went wrong
      },
    })
  }
  return (
    <>
      <TopBar height={60}>
        <Navbar />
      </TopBar>
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
              isLoading={isCreatingReservation}
              onClose={() => setFlightDetailsOpen(false)}
              onSelectFlight={handleSelectFlight}
            />
          </Drawer>
        </SectionContainer>
      </Box>
    </>
  )
}
