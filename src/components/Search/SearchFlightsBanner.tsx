'use client'

import { Box, Drawer, Typography } from '@mui/material'
import { SearchFlightsModes, SectionContainer } from '@/components'
import { SearchFlightsParams } from '@/types'
import { useFlights } from '@/contexts'
import { useRouter } from 'next/navigation'

export const SearchFlightsBanner = () => {
  const router = useRouter()
  const { setSearchParams } = useFlights()

  const onSearch = ({ searchParams }: { searchParams: SearchFlightsParams }) => {
    setSearchParams(searchParams)
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
        <SearchFlightsModes sx={{ mt: 4 }} onSearch={onSearch} />
      </SectionContainer>
    </Box>
  )
}
