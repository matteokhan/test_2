'use client'

import React, { useState } from 'react'
import { useFlights } from '@/contexts'
import { SectionContainer, SearchFlightsModesMobile } from '@/components'
import { Box, Drawer, Stack, Typography, IconButton } from '@mui/material'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import TuneIcon from '@mui/icons-material/Tune'
import { airportName } from '@/utils'
import dayjs from 'dayjs'
import { styled } from '@mui/material/styles'

import CloseIcon from '@mui/icons-material/Close'
import { useAirportData } from '@/services'

export const SelectedFlightInfoTopbarMobile = () => {
  const { firstSegment, lastSegment, totalPassengers } = useFlights()

  const { data: departureAirportData } = useAirportData({
    airportCode: firstSegment?.from ? firstSegment.from : '',
  })

  const { data: arrivalAirportData } = useAirportData({
    airportCode: lastSegment?.to ? lastSegment.to : '',
  })

  const [flightSearchOpen, setFlightSearchOpen] = useState(false)

  const TravelOptionButton = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.grey['100'],
    borderRadius: '4px',
    padding: `${theme.spacing(0.75)} ${theme.spacing(1)}`,
    textWrap: 'nowrap',
    display: 'flex',
    alignItems: 'center',
  }))

  return (
    <SectionContainer sx={{ flexDirection: 'column', py: 1, gap: 0.5 }}>
      <Stack
        onClick={() => setFlightSearchOpen(true)}
        data-testid="SelectedFlightInfoTopbarMobile-searchFlightButton"
        gap={0.25}>
        {' '}
        <Stack direction="row" gap={1} alignItems="center">
          <Typography variant="titleMd">
            {airportName(departureAirportData)} ({firstSegment?.from})
          </Typography>
          <SwapHorizIcon data-testid={null} />
          <Typography variant="titleMd">
            {airportName(arrivalAirportData)} ({lastSegment?.to})
          </Typography>
        </Stack>
        <Typography variant="bodyMd">
          Du {dayjs(firstSegment?.date).format('DD-MM')} au{' '}
          {dayjs(lastSegment?.date).format('DD-MM')} - {totalPassengers} voyageurs
        </Typography>
      </Stack>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          width: '100%',
          maxWidth: '100vw',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          py: 1,
        }}>
        <TravelOptionButton
          sx={{ alignItems: 'center', gap: 1 }}
          data-testid="SelectedFlightInfoTopbarMobile-allFiltersButton">
          <TuneIcon />
          <Typography variant="titleSm" height="fit-content">
            Tous les filtres
          </Typography>{' '}
        </TravelOptionButton>
        <TravelOptionButton data-testid="SelectedFlightInfoTopbarMobile-directFlightsButton">
          <Typography variant="titleSm" height="fit-content">
            Directs
          </Typography>
        </TravelOptionButton>
        <TravelOptionButton data-testid="SelectedFlightInfoTopbarMobile-theFastestButton">
          <Typography variant="titleSm" height="fit-content">
            Les plus rapides
          </Typography>
        </TravelOptionButton>
        <TravelOptionButton data-testid="SelectedFlightInfoTopbarMobile-theCheapestButton">
          <Typography variant="titleSm" height="fit-content">
            Les moins chères
          </Typography>
        </TravelOptionButton>
      </Box>
      <Drawer
        open={flightSearchOpen}
        anchor="right"
        PaperProps={{
          sx: {
            borderRadius: 0,
            width: '100%',
          },
        }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          p={2}
          pl={3}
          alignItems="center"
          bgcolor="grey.100">
          <Typography color="common.black" variant="titleLg">
            Vols
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => setFlightSearchOpen(false)}
            data-testid="travelOptionsBanner-closeButton">
            <CloseIcon />
          </IconButton>
        </Stack>
        <SearchFlightsModesMobile onSubmit={() => setFlightSearchOpen(false)} />
      </Drawer>
    </SectionContainer>
  )
}
