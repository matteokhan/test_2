'use client'

import { Box, Typography } from '@mui/material'
import { SearchFlightsModes, SectionContainer } from '@/components'

export const SearchFlightsBanner = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'primary.main',
      }}>
      <SectionContainer
        sx={{ justifyContent: 'space-between', paddingY: 6, flexDirection: 'column' }}>
        <Typography color="common.white" variant="titleLg">
          Explorez toute l’offre Voyages E.Leclerc
        </Typography>
        <SearchFlightsModes sx={{ mt: 4 }} />
      </SectionContainer>
    </Box>
  )
}
