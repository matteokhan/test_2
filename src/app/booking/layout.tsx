'use client'

import { useEffect, useState } from 'react'
import {
  BookingStepsTopbar,
  FlightDetails,
  Navbar,
  PurchaseDetails,
  SectionContainer,
  SelectedFlightInfoTopbar,
  SelectedFlightInfoTopbarMobile,
  TopBar,
} from '@/components'
import { useBooking, useFlights } from '@/contexts'
import { Box, Drawer, Paper, Stack, Typography } from '@mui/material'
import { useRouter, usePathname } from 'next/navigation'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  const {
    preSelectedFlight,
    getStepIndexByPath,
    setCurrentStep,
    mapIsOpen,
    currentStepTitle,
    steps,
    currentStep,
    totalPrice,
  } = useBooking()
  const { setFlightDetailsOpen, flightDetailsOpen } = useFlights()
  const router = useRouter()
  const pathname = usePathname()

  const [totalPriceOpen, setTotalPriceOpen] = useState(false)

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
        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
          <SelectedFlightInfoTopbar />
        </Box>
        <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
          <SelectedFlightInfoTopbarMobile />
        </Box>
      </TopBar>
      <Box sx={{ backgroundColor: 'grey.200' }}>
        {/* Desktop */}
        <SectionContainer
          sx={{
            justifyContent: 'space-between',
            paddingY: 3,
            flexDirection: 'column',
            display: { xs: 'none', lg: 'flex' },
          }}>
          <>
            <BookingStepsTopbar />
            <Typography variant="headlineMd" py={3}>
              {currentStepTitle}
            </Typography>
            {/* The overflow and height hack is to avoid double scrolling while mapIsOpen */}
            <Stack
              direction="row"
              gap={2}
              sx={{
                overflow: mapIsOpen ? 'hidden' : 'visible',
                height: mapIsOpen ? '50vh' : 'auto',
              }}>
              <Box flexGrow="1">{children}</Box>
              <Box height="fit-content" position="sticky" top="136px">
                <PurchaseDetails />
              </Box>
            </Stack>
          </>
        </SectionContainer>

        {/* Mobile */}
        <Box sx={{ display: { xs: 'block', lg: 'none', position: 'relative' } }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            px={2}
            pt={4}
            gap={2}
            //pb={2}
            alignItems="flex-end">
            <Typography variant="headlineMd">{currentStepTitle}</Typography>
            <Typography variant="bodyMd" color="grey.800" sx={{ textWrap: 'nowrap' }}>
              Étape {currentStep + 1}/{steps.length}
            </Typography>
          </Stack>
          <Box py={2}>{children}</Box>
          <Paper
            elevation={3}
            onClick={() => setTotalPriceOpen(true)}
            data-testid="totalPrice-detailMobile"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              position: 'fixed',
              bgcolor: 'primary.main',
              bottom: 0,
              width: '100%',
              py: 1.5,
              gap: 1,
              zIndex: 'appBar',
              borderRadius: 0,
            }}>
            <Stack onClick={() => {}}>
              <Typography variant="headlineMd" color="common.white">
                {totalPrice} €
              </Typography>
              <Typography variant="bodySm" color="common.white">
                Voir le détail
              </Typography>
            </Stack>
            <ExpandMoreIcon sx={{ color: 'common.white', width: '18px', height: '18px' }} />
          </Paper>
        </Box>
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
        <Drawer
          open={totalPriceOpen}
          onClose={() => setTotalPriceOpen(false)}
          anchor="bottom"
          PaperProps={{
            sx: {
              height: 'auto',
            },
          }}>
          <PurchaseDetails onAction={() => setTotalPriceOpen(false)} />
        </Drawer>
      </Box>
    </>
  )
}
