'use client'

import { useEffect } from 'react'
import {
  BookingStepsTopbar,
  Header,
  PurchaseDetails,
  SectionContainer,
  SelectedFlightInfoTopbar,
} from '@/components'
import { useBooking } from '@/contexts'
import { Box, Stack, Typography } from '@mui/material'
import { useRouter, usePathname } from 'next/navigation'

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  const { preSelectedFlight, getStepIndexByPath, setCurrentStep, mapIsOpen, currentStepTitle } =
    useBooking()
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
          <>
            <BookingStepsTopbar />
            <Typography variant="headlineMd" py={3}>
              {currentStepTitle}
            </Typography>
            {/* The overflow and height hack is to avoid double scrolling while mapIsOpen */}
            <Stack
              direction="row"
              gap={2}
              sx={{ overflow: mapIsOpen ? 'hidden' : 'auto', height: mapIsOpen ? '50vh' : 'auto' }}>
              <Box flexGrow="1">{children}</Box>
              <Box>
                <PurchaseDetails />
              </Box>
            </Stack>
          </>
        </SectionContainer>
      </Box>
    </>
  )
}
