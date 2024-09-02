'use client'

import { Navbar, OldNavbar, SearchFlightsBanner, TopBar } from '@/components'

export default function Home() {
  return (
    <>
      <TopBar height={106}>
        <Navbar />
        <OldNavbar />
      </TopBar>
      <SearchFlightsBanner />
    </>
  )
}
