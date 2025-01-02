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
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { SearchFlightsParams } from '@/types'

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  const { selectedFlight, getStepIndexByPath, steps, currentStep, totalPrice } = useBooking()
  const currentStepTitle = steps.current[currentStep.current].title
  const { setFlightDetailsOpen, flightDetailsOpen, setSearchParams } = useFlights()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const router = useRouter()
  const pathname = usePathname()
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const [totalPriceOpen, setTotalPriceOpen] = useState(false)
  const [forceRerender, setForceRerender] = useState(false)

  const onSearch = ({ searchParams }: { searchParams: SearchFlightsParams }) => {
    setSearchParams(searchParams)
    router.push('/search')
  }

  useEffect(() => {
    if (!selectedFlight && !orderId) {
      router.push('/search')
    }
  }, [router])

  // Check url, set the step accordingly
  useEffect(() => {
    if (pathname) {
      const stepIndex = getStepIndexByPath(pathname)
      if (stepIndex !== -1) {
        currentStep.current = stepIndex
        // We force rerender here because the currentStep is not a state, it's a ref
        // and we need to trigger a rerender when it changes
        setForceRerender(!forceRerender)
      }
    }
  }, [pathname])

  if (!selectedFlight && !orderId) {
    return null // TODO: Add loading state
  }

  return (
    <>
      <TopBar height={isDesktop ? 120 : 136} fixed>
        <Navbar />
        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
          <SelectedFlightInfoTopbar />
        </Box>
        <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
          <SelectedFlightInfoTopbarMobile onSearch={onSearch} />
        </Box>
      </TopBar>
      <Box sx={{ backgroundColor: 'grey.200' }}>
        {/* Desktop */}
        <SectionContainer
          className="desktop"
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
            <Stack direction="row" gap={2}>
              <Box flexGrow="1">{children}</Box>
              <Box height="fit-content" position="sticky" top="136px">
                <PurchaseDetails />
              </Box>
            </Stack>
          </>
        </SectionContainer>

        {/* Mobile */}
        <Box className="mobile" sx={{ display: { xs: 'block', lg: 'none' } }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            px={{ xs: 2, md: 5 }}
            pt={4}
            gap={2}
            alignItems="flex-end">
            <Typography variant="headlineMd">{currentStepTitle}</Typography>
            <Typography variant="bodyMd" color="grey.800" sx={{ textWrap: 'nowrap' }}>
              Étape {currentStep.current + 1}/{steps.current.length}
            </Typography>
          </Stack>
          <Box py={2}>{children}</Box>
          <Paper
            elevation={3}
            onClick={() => setTotalPriceOpen(true)}
            data-testid="checkoutBottomBar"
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
              <Typography
                variant="headlineMd"
                color="common.white"
                data-testid="checkoutBottomBar-totalPrice">
                {totalPrice.toFixed(2)} €
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
          <PurchaseDetails onClose={() => setTotalPriceOpen(false)} />
        </Drawer>
      </Box>
    </>
  )
}
