'use client'

import React from 'react'
import {
  Navbar,
  SearchFlightsModes,
  SectionContainer,
  FlightDetails,
  TopBar,
  FlightResultSkeleton,
  FlightsLoader,
  SearchFlightsFilters,
  SearchResults,
  SelectedFlightInfoTopbarMobile,
} from '@/components'
import { Box, Drawer, Button, Grow, Stack, Typography } from '@mui/material'
import { useBooking, useFlights } from '@/contexts'
import { SearchFlightsParams, Solution, AirlineFilterData, SearchFlightFilters } from '@/types'
import { useCreateReservation, useSearchFlights } from '@/services'
import { getCreateReservationDto } from '@/utils'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

export default function FlighsPage() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const RESULTS_PER_PAGE = 10
  const [resultsNumber, setResultsNumber] = React.useState(RESULTS_PER_PAGE)
  const [filters, setFilters] = React.useState({} as SearchFlightFilters)

  const { flightDetailsOpen, setFlightDetailsOpen, setSearchParams, searchParamsDto } = useFlights()
  const { selectFlight, goToStep, setReservation, correlationId } = useBooking()
  const { mutate: createReservation, isPending: isCreatingReservation } = useCreateReservation()
  const {
    data: response,
    isSuccess,
    isLoading,
  } = useSearchFlights({
    params: searchParamsDto,
  })

  const onSearch = ({ searchParams }: { searchParams: SearchFlightsParams }) => {
    setSearchParams(searchParams)
  }
  const handleSelectFlight = async ({ flight }: { flight: Solution }) => {
    if (!correlationId) {
      // TODO: log this somewhere
      // TODO: Warn the user that something went wrong
      return
    }
    const createReservationDto = getCreateReservationDto({ correlationId, flight })
    createReservation(createReservationDto, {
      onSuccess: (reservation) => {
        setReservation(reservation)
        selectFlight(flight)
        setFlightDetailsOpen(false)
        goToStep(0)
      },
      onError: (error) => {
        // TODO: log this somewhere
        // TODO: Warn the user that something went wrong
      },
    })
  }

  const filteredDataOne = response?.solutions
    .filter((solution) => {
      const totalStops = solution.routes.reduce(
        (acc, route) => ((route.stopNumber || 0) > acc ? route.stopNumber : acc),
        0,
      )
      if (
        filters.maxPriceType == 'total' &&
        filters?.maxPrice &&
        solution.priceInfo.total > filters.maxPrice
      )
        return false
      if (
        filters.maxPriceType == 'per-person' &&
        filters?.maxPrice &&
        solution.adults.pricePerPerson > filters.maxPrice
      )
        return false
      if (filters?.scales === 'direct' && totalStops > 0) return false
      if (filters?.scales === '1-scale' && totalStops > 1) return false
      if (filters?.scales === '2-scale' && totalStops > 2) return false

      const flightStartAt = new Date(solution.routes[0].segments[0].departureDateTime).getUTCHours()
      if (filters?.flightTime === '0-6' && flightStartAt >= 6) return false
      if (filters?.flightTime === '6-12' && (flightStartAt < 6 || flightStartAt >= 12)) return false
      if (filters?.flightTime === '12-18' && (flightStartAt < 12 || flightStartAt >= 18))
        return false
      if (filters?.flightTime === '18-24' && flightStartAt < 18) return false

      if (solution.routes.length > 1) {
        const flightReturnAt = new Date(
          solution.routes[1].segments[solution.routes[1].segments.length - 1].arrivalDateTime,
        ).getUTCHours()
        if (filters?.flightTimeReturn === '0-6' && flightReturnAt >= 6) return false
        if (filters?.flightTimeReturn === '6-12' && (flightReturnAt < 6 || flightReturnAt >= 12))
          return false
        if (filters?.flightTimeReturn === '12-18' && (flightReturnAt < 12 || flightReturnAt >= 18))
          return false
        if (filters?.flightTimeReturn === '18-24' && flightReturnAt < 18) return false
      }

      return true
    })
    .sort((a, b) => a.priceInfo.total - b.priceInfo.total)

  const filteredData = filteredDataOne?.filter((solution) => {
    if (filters?.airlinesSelected && filters?.airlinesSelected.length > 0) {
      const airlines = solution.routes.map((route) => route.carrier)
      if (!filters.airlinesSelected.some((airline) => airlines.includes(airline))) return false
    }
    return true
  })

  const getAirlines = () => {
    const airlines: AirlineFilterData[] = []
    filteredDataOne?.forEach((solution) => {
      const indexAirline = airlines.findIndex((current) =>
        solution.routes.map((route) => route.carrier).includes(current.carrier),
      )
      if (indexAirline === -1) {
        airlines.push({
          carrier: solution.routes[0].carrier,
          price: solution.priceInfo.total,
          currencySymbol: solution.priceInfo.currencySymbol,
        })
      } else {
        if (solution.priceInfo.total < airlines[indexAirline].price) {
          airlines[indexAirline].price = solution.priceInfo.total
        }
      }
    })
    return airlines.sort((a, b) => a.price - b.price)
  }
  const hasMoreResults = resultsNumber < (filteredData?.length || 0)

  return (
    <>
      <TopBar height={isDesktop ? 60 : 176}>
        <Navbar />
        <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
          <SelectedFlightInfoTopbarMobile withFilters />
        </Box>
      </TopBar>
      <Box
        sx={{
          backgroundColor: 'grey.200',
        }}>
        <SectionContainer
          sx={{
            justifyContent: 'space-between',
            paddingY: { xs: 2, lg: 3 },
            flexDirection: 'column',
          }}>
          <SearchFlightsModes
            onSearch={onSearch}
            sx={{ mb: 3, display: { xs: 'none', lg: 'block' } }}
            disabled={isLoading}
          />
          {isLoading && (
            <Grow in={isLoading}>
              <Stack sx={{ mt: { xs: 0, lg: 2 }, mb: { xs: 2, lg: 5 } }} alignItems="center">
                <Stack maxWidth="516px" direction="row" gap={3}>
                  <FlightsLoader />
                  <Box>
                    <Typography variant="titleLg">Votre recherche est en cours...</Typography>
                    <Typography variant="bodyMd" pt={1.5}>
                      Merci de patienter quelques secondes le temps que nous trouvions les
                      meilleures offres du moment !
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grow>
          )}
          <Stack direction="row" spacing={isDesktop ? 2 : 0}>
            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
              <SearchFlightsFilters
                filterData={response?.searchFilters}
                airlines={getAirlines()}
                departure={response?.solutions[0]?.routes[0]?.segments[0]?.departure}
                arrival={
                  response?.solutions[0]?.routes[0]?.segments[
                    response.solutions[0]?.routes[0]?.segments?.length - 1
                  ]?.arrival
                }
                isRoundTrip={
                  searchParamsDto?.segments?.length ? searchParamsDto.segments.length > 1 : false
                }
                onSubmit={(values) => setFilters(values)}
              />
            </Box>
            <Stack gap={2} flexGrow={1}>
              {/* TODO: Implement date alternatives */}
              {/* <Stack gap={1}>
            <Typography variant="titleMd" pb={1}>
              Ajustez la date de votre départ
            </Typography>
            <FlightDateAlternatives />
          </Stack> */}
              <Typography variant="bodySm" color="grey.600">
                Les prix affichés incluent les taxes et peuvent changer en fonction de la
                disponibilité. Vous pouvez consulter les frais supplémentaires avant le paiement.
                Les prix ne sont pas définitifs tant que vous n'avez pas finalisé votre achat.
              </Typography>
              {isLoading && (
                <>
                  <FlightResultSkeleton />
                  <FlightResultSkeleton />
                  <FlightResultSkeleton />
                </>
              )}
              {isSuccess && (
                <>
                  <SearchResults
                    results={filteredData?.slice(0, resultsNumber)}
                    correlationId={response.correlationId}
                  />
                  {hasMoreResults && (
                    <Button
                      onClick={() => setResultsNumber(resultsNumber + RESULTS_PER_PAGE)}
                      data-testid="searchFlights-viewMoreResultsButton">
                      Voir plus
                    </Button>
                  )}
                </>
              )}
            </Stack>
          </Stack>
          <Drawer
            open={flightDetailsOpen}
            onClose={() => setFlightDetailsOpen(false)}
            anchor="right"
            PaperProps={{
              sx: {
                borderRadius: 0,
                height: { xs: 'calc(100% - 64px)', lg: '100%' },
                top: 'unset',
                bottom: 0,
                width: { xs: '100%', lg: 'unset' },
              },
            }}>
            <FlightDetails
              isLoading={isCreatingReservation}
              onClose={() => setFlightDetailsOpen(false)}
              onSelectFlight={handleSelectFlight}
            />
          </Drawer>
        </SectionContainer>
      </Box>
    </>
  )
}
