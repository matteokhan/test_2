'use client'

import { Navbar, SearchFlightsBanner, TopBar } from '@/components'

export default function Home() {
  return (
    <>
      <TopBar height={60}>
        <Navbar />
      </TopBar>
      <SearchFlightsBanner />
    </>
  )
}
