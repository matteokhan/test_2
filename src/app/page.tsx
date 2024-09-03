'use client'

import { Footer, Navbar, OldNavbar, SearchFlightsBanner, TopBar } from '@/components'

export default function Home() {
  return (
    <>
      <TopBar height={106}>
        <Navbar />
        <OldNavbar />
      </TopBar>
      <SearchFlightsBanner />
      <Footer />
    </>
  )
}
