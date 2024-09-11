'use client'

import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import {
  Footer,
  Navbar,
  OldNavbar,
  SearchFlightsBanner,
  TopBar,
  TravelOptionsBanner,
} from '@/components'

export default function Home() {
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
      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        <SearchFlightsBanner />
      </Box>
      <Box sx={{ display: { xs: 'flex', lg: 'none' } }}>
        <TravelOptionsBanner />
      </Box>
      <Footer />
    </>
  )
}
