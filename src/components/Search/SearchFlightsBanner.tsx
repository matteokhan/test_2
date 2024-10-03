'use client'

import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { SearchFlightsModes, SectionContainer } from '@/components'
import { SearchFlightsParams } from '@/types'
import { useRouter } from 'next/navigation'
import { useSearch } from '@/hooks'

export const SearchFlightsBanner = () => {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)
  const { searchFlights } = useSearch()

  const onSearch = ({ searchParams }: { searchParams: SearchFlightsParams }) => {
    searchFlights({ searchParams })
    setIsNavigating(true)
    router.push('/flights')
  }

  return (
    <Box
      sx={{
        backgroundColor: 'primary.main',
      }}>
      <SectionContainer
        sx={{ justifyContent: 'space-between', paddingY: 6, flexDirection: 'column' }}>
        <Typography color="common.white" variant="titleLg" sx={{ marginBottom: '5px' }}>
          Votre agence Voyages E.Leclerc en ligne
        </Typography>
        <SearchFlightsModes sx={{ mt: 4 }} onSearch={onSearch} disabled={isNavigating} />
      </SectionContainer>
    </Box>
  )
}
