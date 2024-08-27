'use client'

import { useEffect } from 'react'
import {
  BookingStepsTopbar,
  FlightDetails,
  Navbar,
  PurchaseDetails,
  SectionContainer,
  SelectedFlightInfoTopbar,
  TopBar,
} from '@/components'
import { useBooking, useFlights } from '@/contexts'
import { Box, Drawer, Stack, Typography } from '@mui/material'
import { useRouter, usePathname } from 'next/navigation'

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  const { preSelectedFlight, getStepIndexByPath, setCurrentStep, mapIsOpen, currentStepTitle } =
    useBooking()
  const { setFlightDetailsOpen, flightDetailsOpen } = useFlights()
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
      <TopBar height={120}>
        <Navbar />
        <SelectedFlightInfoTopbar />
      </TopBar>
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
        <Drawer
          open={flightDetailsOpen}
          onClose={() => setFlightDetailsOpen(false)}
          anchor="right"
          PaperProps={{
            sx: {
              borderRadius: 0,
            },
          }}>
          <FlightDetails onClose={() => setFlightDetailsOpen(false)} withControls={false} />
        </Drawer>
      </Box>
    </>
  )
}
