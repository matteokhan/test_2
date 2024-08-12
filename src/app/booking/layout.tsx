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
import { useRouter, usePathname } from 'next/navigation'

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  const { preSelectedFlight, getStepIndexByPath, setCurrentStep } = useBooking()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!preSelectedFlight) {
      router.push('/flights')
    }
  }, [preSelectedFlight, router])

  // Check url, set the step accordingly
  useEffect(() => {
    if (pathname) {
      const stepIndex = getStepIndexByPath(pathname)
      if (stepIndex !== -1) {
        setCurrentStep(stepIndex)
      }
    }
  }, [pathname])

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
