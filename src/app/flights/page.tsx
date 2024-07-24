'use client'

import React from 'react'
import { Header, SearchFlightsModes, SectionContainer, SearchFlights } from '@/components'
import { Box, Stack } from '@mui/material'
import { useFlightsContext } from '@/contexts'

export default function FlighsPage() {
  // TODO: Try to remove this dependency and render SearchFlights always
  const { searchParams } = useFlightsContext()
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
        </SectionContainer>
      </Box>
    </>
  )
}
