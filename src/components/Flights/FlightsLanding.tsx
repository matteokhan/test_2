'use client'

import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Navbar, OldNavbar, SearchFlightsBanner, SectionContainer, TopBar } from '@/components'
import Image from 'next/image'
import banner1 from '../../../public/promo_banners/promo1.png'
import banner2 from '../../../public/promo_banners/promo2.png'

export const FlightsLanding = () => {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <>
      <TopBar height={isDesktop ? 120 : 75}>
        <Navbar />
        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
          <OldNavbar />
        </Box>
      </TopBar>
      <SearchFlightsBanner />
      <Box bgcolor="white" sx={{ py: isMobile ? 4 : 6 }}>
        <SectionContainer
          sx={{
            gap: 2,
            justifyContent: 'space-between',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
          }}>
          <Image
            src={banner1}
            alt="Promotion billets d'avion"
            placeholder="blur"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <Image
            src={banner2}
            alt="Promotion billets d'avion"
            placeholder="blur"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </SectionContainer>
      </Box>
    </>
  )
}
