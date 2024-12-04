'use client'

import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { SearchFlightsModes, SearchFlightsModesMobileV2, SectionContainer } from '@/components'
import { SearchFlightsParams } from '@/types'
import { useRouter } from 'next/navigation'
import { useFlights } from '@/contexts'

export const SearchFlightsBanner = () => {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)
  const { setSearchParams } = useFlights()

  const onSearch = ({ searchParams }: { searchParams: SearchFlightsParams }) => {
    setSearchParams(searchParams)
    setIsNavigating(true)
    router.push('/vols')
  }

  return (
    <Box
      sx={{
        backgroundColor: 'primary.main',
      }}>
      <SectionContainer
        sx={{ justifyContent: 'space-between', paddingY: 6, flexDirection: 'column' }}>
        <Typography color="common.white" variant="titleLg" sx={{ marginBottom: '5px' }}>
          Recherchez vos billets d'avion parmi des milliers d'offres <br />
          et trouvez celle qui vous mènera vers vos plus belles vacances !
        </Typography>
        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
          <SearchFlightsModes sx={{ mt: 4 }} onSearch={onSearch} disabled={isNavigating} />
        </Box>
        <Box sx={{ display: { xs: 'flex', lg: 'none' }, mt: 2 }}>
          <SearchFlightsModesMobileV2 onSearch={onSearch} />
        </Box>
      </SectionContainer>
    </Box>
  )
}
