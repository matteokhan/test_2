'use client'

import { useEffect } from 'react'
import {
  BookingStepsTopbar,
  Header,
  SectionContainer,
  SelectedFlightInfoTopbar,
} from '@/components'
import { useBooking } from '@/contexts'
import { Box } from '@mui/material'
import { useRouter } from 'next/navigation'

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  const { preSelectedFlight } = useBooking()
  const router = useRouter()

  useEffect(() => {
    if (!preSelectedFlight) {
      router.push('/flights')
    }
  }, [preSelectedFlight, router])

  if (!preSelectedFlight) {
    return null // TODO: Add loading state
  }

  return (
    <>
      <Header />
      <SelectedFlightInfoTopbar />
      <Box sx={{ backgroundColor: 'grey.200' }}>
        <SectionContainer
          sx={{ justifyContent: 'space-between', paddingY: 3, flexDirection: 'column' }}>
          <BookingStepsTopbar />
          {children}
        </SectionContainer>
      </Box>
    </>
  )
}
