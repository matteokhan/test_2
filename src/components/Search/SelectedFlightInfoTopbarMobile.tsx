'use client'

import React, { useState } from 'react'
import { useFlights, useAgencySelector } from '@/contexts'
import {
  SectionContainer,
  SearchFlightsModesMobile,
  SelectAgencyMap,
  SelectAgencyLabel,
} from '@/components'
import { Box, Drawer, Stack, Typography, IconButton } from '@mui/material'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import TuneIcon from '@mui/icons-material/Tune'
import { locationName } from '@/utils'
import dayjs from 'dayjs'
import { styled } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import { useLocationData } from '@/services'
import { useRouter } from 'next/navigation'
import { useSearch } from '@/hooks'

type SelectedFlightInfoTopbarMobileProps = {
  withFilters?: boolean
}

export const SelectedFlightInfoTopbarMobile = ({
  withFilters,
}: SelectedFlightInfoTopbarMobileProps) => {
  const router = useRouter()
  const { firstSegment, lastSegment, totalPassengers, isOneWay } = useFlights()
  const { selectAgency } = useAgencySelector()
  const { searchFlights } = useSearch()

  // Depending on whether the flight is round trip or one way, the departure location and
  // destination location will be different'
  const departureLocation = firstSegment ? firstSegment.from : ''
  const departureDate = firstSegment ? firstSegment.date : ''
  const destinationLocation = lastSegment ? (isOneWay ? lastSegment.to : lastSegment?.from) : ''
  const destinationDate = lastSegment ? (isOneWay ? lastSegment.date : lastSegment?.date) : ''

  const { data: departureLocationData } = useLocationData({
    locationCode: departureLocation,
  })
  const { data: arrivalLocationData } = useLocationData({
    locationCode: destinationLocation,
  })
  const [flightSearchOpen, setFlightSearchOpen] = useState(false)
  const [mapIsOpen, setMapIsOpen] = React.useState(false)

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
        data-testid="selectedFlightInfoTopbarMobile-searchFlightButton"
        gap={0.25}>
        {' '}
        <Stack direction="row" gap={1} alignItems="center">
          <Typography variant="titleMd">
            {locationName(departureLocationData)} ({departureLocation})
          </Typography>
          <SwapHorizIcon data-testid={null} />
          <Typography variant="titleMd">
            {locationName(arrivalLocationData)} ({destinationLocation})
          </Typography>
        </Stack>
        <Typography variant="bodyMd">
          Du {dayjs(departureDate).format('DD-MM')} au {dayjs(destinationDate).format('DD-MM')} -{' '}
          {totalPassengers} voyageurs
        </Typography>
      </Stack>
      {withFilters && (
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
            data-testid="selectedFlightInfoTopbarMobile-allFiltersButton">
            <TuneIcon />
            <Typography variant="titleSm" height="fit-content">
              Tous les filtres
            </Typography>{' '}
          </TravelOptionButton>
          <TravelOptionButton data-testid="selectedFlightInfoTopbarMobile-directFlightsButton">
            <Typography variant="titleSm" height="fit-content">
              Directs
            </Typography>
          </TravelOptionButton>
          <TravelOptionButton data-testid="selectedFlightInfoTopbarMobile-theFastestButton">
            <Typography variant="titleSm" height="fit-content">
              Les plus rapides
            </Typography>
          </TravelOptionButton>
          <TravelOptionButton data-testid="selectedFlightInfoTopbarMobile-theCheapestButton">
            <Typography variant="titleSm" height="fit-content">
              Les moins chères
            </Typography>
          </TravelOptionButton>
        </Box>
      )}
      <SelectAgencyLabel openSelectionAgency={() => setMapIsOpen(true)} />
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
        <SearchFlightsModesMobile
          onSearch={(searchParams) => {
            searchFlights(searchParams)
            setFlightSearchOpen(false)
            router.push('/flights')
          }}
        />
      </Drawer>
      <Drawer
        open={mapIsOpen}
        onClose={() => setMapIsOpen(false)}
        anchor="right"
        PaperProps={{
          sx: {
            borderRadius: 0,
          },
        }}>
        <SelectAgencyMap
          onClose={() => setMapIsOpen(false)}
          onSelectAgency={({ agency }) => {
            selectAgency(agency)
            setMapIsOpen(false)
          }}
        />
      </Drawer>
    </SectionContainer>
  )
}
