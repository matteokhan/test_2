'use client'

import { Footer, Navbar, OldNavbar, SearchFlightsBanner, TopBar } from '@/components'

export default function Home() {
  return (
    <>
      <TopBar height={120}>
        <Navbar />
        <OldNavbar />
      </TopBar>
      <SearchFlightsBanner />
      <Footer />
    </>
  )
}
