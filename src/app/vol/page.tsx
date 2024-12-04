'use client'

import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Footer, Navbar, OldNavbar, SearchFlightsBanner, TopBar } from '@/components'
import useMetadata from '@/contexts/useMetadata'

export default function Home() {
  useMetadata("Réservation vol - billets d'avion Voyages E. Leclerc aux meilleurs prix")
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))

  return (
    <>
      <TopBar height={isDesktop ? 120 : 61}>
        <Navbar />
        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
          <OldNavbar />
        </Box>
      </TopBar>
      <SearchFlightsBanner />
      <Footer />
    </>
  )
}
