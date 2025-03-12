'use client'

import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import {
  Footer,
  Navbar,
  OldNavbar,
  SearchFlightsBanner,
  SectionContainer,
  TopBar,
} from '@/components'
import useMetadata from '@/contexts/useMetadata'
import Image from 'next/image'
import banner1 from '../../../public/promo_banners/promo1.png'
import banner2 from '../../../public/promo_banners/promo2.png'

export default function Home() {
  useMetadata("IA booking engine - Trouvez vos billets d'avion différemment")
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <>
      <SearchFlightsBanner />
    </>
  )
}
