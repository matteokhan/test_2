'use client'

import React, { useState } from 'react'
import { useFlights, useAgencySelector } from '@/contexts'
import { SectionContainer, SearchFlightsModesMobile, SelectAgencyLabel } from '@/components'
import { Box, Drawer, Stack, Typography, IconButton, Skeleton } from '@mui/material'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import TuneIcon from '@mui/icons-material/Tune'
import { locationName } from '@/utils'
import dayjs from 'dayjs'
import { styled } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import { useLocationData } from '@/services'
import { SearchFlightsFiltersOptions, SearchFlightsParams } from '@/types'

const TravelOptionButton = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey['100'],
  borderRadius: '4px',
  padding: `${theme.spacing(0.75)} ${theme.spacing(1)}`,
  textWrap: 'nowrap',
  display: 'flex',
  alignItems: 'center',
}))

type SelectedFlightInfoTopbarMobileProps = {
  onSearch: ({ searchParams }: { searchParams: SearchFlightsParams }) => void
  withFilters?: boolean
  onOpenFilters?: (filterName: SearchFlightsFiltersOptions) => void
  isLoading?: boolean
  withAgencySelector?: boolean
}

export const SelectedFlightInfoTopbarMobile = ({
  onSearch,
  withFilters,
  onOpenFilters,
  isLoading,
  withAgencySelector,
}: SelectedFlightInfoTopbarMobileProps) => {
  const { firstSegment, lastSegment, totalPassengers, isOneWay } = useFlights()
  const { setIsAgencySelectorOpen } = useAgencySelector()

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

  const handleOnSearch = ({ searchParams }: { searchParams: SearchFlightsParams }) => {
    setFlightSearchOpen(false)
    onSearch({ searchParams })
  }

  return (
    <SectionContainer sx={{ flexDirection: 'column', py: 1, gap: 0.5 }}>
      {departureLocation && destinationLocation && (
        <Stack
          onClick={() => setFlightSearchOpen(true)}
          data-testid="selectedFlightInfoTopbarMobile-searchFlightButton"
          gap={0.25}>
          <Stack direction="row" gap={1} alignItems="center">
            <Typography variant="titleMd">
              {locationName(departureLocationData)} ({departureLocation})
            </Typography>
            <SwapHorizIcon data-testid={null} />
            <Typography variant="titleMd">
              {locationName(arrivalLocationData)} ({destinationLocation})
            </Typography>
          </Stack>
          {!isOneWay && (
            <Typography variant="bodyMd">
              Du {dayjs(departureDate).format('DD-MM')} au {dayjs(destinationDate).format('DD-MM')}{' '}
              - {totalPassengers} voyageurs
            </Typography>
          )}
          {isOneWay && (
            <Typography variant="bodyMd">
              Le {dayjs(departureDate).format('DD-MM')} - {totalPassengers} voyageurs
            </Typography>
          )}
        </Stack>
      )}
      {!departureLocation && !destinationLocation && (
        <Stack
          onClick={() => setFlightSearchOpen(true)}
          data-testid="selectedFlightInfoTopbarMobile-searchFlightButton"
          height="45px"
          justifyContent="center"
          color="grey.600">
          <Typography variant="bodyMd">Rechercher à nouveau</Typography>
        </Stack>
      )}
      {withFilters && !isLoading && (
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
            <Typography
              variant="titleSm"
              height="fit-content"
              onClick={() => onOpenFilters && onOpenFilters('all')}>
              Tous les filtres
            </Typography>{' '}
          </TravelOptionButton>
          <TravelOptionButton data-testid="selectedFlightInfoTopbarMobile-scalesButton">
            <Typography
              variant="titleSm"
              height="fit-content"
              onClick={() => onOpenFilters && onOpenFilters('scales')}>
              Escales
            </Typography>
          </TravelOptionButton>
          <TravelOptionButton data-testid="selectedFlightInfoTopbarMobile-priceButton">
            <Typography
              variant="titleSm"
              height="fit-content"
              onClick={() => onOpenFilters && onOpenFilters('price')}>
              Prix
            </Typography>
          </TravelOptionButton>
          <TravelOptionButton data-testid="selectedFlightInfoTopbarMobile-routesButton">
            <Typography
              variant="titleSm"
              height="fit-content"
              onClick={() => onOpenFilters && onOpenFilters('routes')}>
              Itinéraires
            </Typography>
          </TravelOptionButton>
          <TravelOptionButton data-testid="selectedFlightInfoTopbarMobile-airlinesButton">
            <Typography
              variant="titleSm"
              height="fit-content"
              onClick={() => onOpenFilters && onOpenFilters('airlines')}>
              Compagnies aériennes
            </Typography>
          </TravelOptionButton>
        </Box>
      )}
      {withFilters && isLoading && <Skeleton variant="rectangular" height={34} />}
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
        <SearchFlightsModesMobile onSearch={handleOnSearch} />
      </Drawer>
    </SectionContainer>
  )
}
