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
import { Box, Drawer, Button, Grow, Stack, Typography, IconButton, Divider } from '@mui/material'
import { useBooking, useFlights } from '@/contexts'
import { useSearch } from '@/hooks'
import {
  SearchFlightsParams,
  Solution,
  AirlineFilterData,
  SearchFlightFilters,
  SearchFlightsFiltersOptions,
} from '@/types'
import { getBrandedFares } from '@/services'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { QueryClient } from '@tanstack/react-query'
import CloseIcon from '@mui/icons-material/Close'

const queryClient = new QueryClient()

export default function FlighsPage() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const RESULTS_PER_PAGE = 10
  const [resultsNumber, setResultsNumber] = React.useState(RESULTS_PER_PAGE)
  const [filters, setFilters] = React.useState<SearchFlightFilters>({
    routes: [
      {
        routeIndex: 0,
        departureAirports: [],
        arrivalAirports: [],
      },
      {
        routeIndex: 1,
        departureAirports: [],
        arrivalAirports: [],
      },
    ],
  })

  const [activeFilter, setActiveFilter] = React.useState<SearchFlightsFiltersOptions>('all')
  const [activeFilterOpen, setActiveFilterOpen] = React.useState(false)

  const { flightDetailsOpen, setFlightDetailsOpen, searchParamsDto } = useFlights()
  const { selectFlight, goToFirstStep, order, skipStep } = useBooking()
  const { searchFlights, isSearching, data: response, isSuccess } = useSearch()
  const [isNavigating, setIsNavigating] = React.useState(false)

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

      if (filters?.routes[0].departureAirports.length > 0) {
        if (
          !filters.routes[0].departureAirports.includes(
            solution.routes[0].segments[0].departureCityCode,
          )
        )
          return false
      }

      if (filters?.routes[0].arrivalAirports.length > 0) {
        const arrivalCityCode =
          solution.routes[0].segments[solution.routes[0].segments.length - 1].arrivalCityCode
        if (!filters.routes[0].arrivalAirports.includes(arrivalCityCode)) return false
      }

      if (
        filters?.routes[1].departureAirports.length > 0 &&
        (searchParamsDto?.search_data.segments?.length || 0) > 1
      ) {
        const departureCityCode =
          solution.routes[1].segments[solution.routes[1].segments.length - 1].departureCityCode
        if (!filters.routes[1].departureAirports.includes(departureCityCode)) return false
      }

      if (
        filters?.routes[1].arrivalAirports.length > 0 &&
        (searchParamsDto?.search_data.segments?.length || 0) > 1
      ) {
        const arrivalCityCode =
          solution.routes[1].segments[solution.routes[1].segments.length - 1].arrivalCityCode
        if (!filters.routes[1].arrivalAirports.includes(arrivalCityCode)) return false
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
  const hasMoreResults = resultsNumber < (filteredData?.length || 0)

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

  const onSearch = ({ searchParams }: { searchParams: SearchFlightsParams }) => {
    searchFlights({ searchParams })
  }

  const handleSelectFlight = async ({ flight }: { flight: Solution }) => {
    if (!order) {
      // TODO: log this somewhere
      // TODO: Warn the user that something went wrong
      return
    }
    setIsNavigating(true)

    // We can ask more information about the flight to decide which steps to follow
    try {
      // TODO: this query should be cached
      const fares = await queryClient.fetchQuery<Solution[]>({
        queryKey: ['brandedFares', order.id, flight.id],
        queryFn: () => getBrandedFares({ orderId: order.id, solutionId: flight.id }),
        gcTime: Infinity, // TODO: this is not true
        staleTime: Infinity, // TODO: this is not true
      })
      if (fares.length === 0) {
        skipStep('fares')
      }
    } catch (error) {
      setIsNavigating(false)
      // TODO: log this somewhere
      // TODO: Warn the user that something went wrong
      throw error
    }
    selectFlight(flight)
    setFlightDetailsOpen(false)
    goToFirstStep()
  }

  return (
    <>
      <TopBar height={isDesktop ? 60 : 200}>
        <Navbar />
        <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
          <SelectedFlightInfoTopbarMobile
            withFilters
            onOpenFilters={(filterName) => {
              setActiveFilter(filterName)
              setActiveFilterOpen(true)
            }}
          />
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
            disabled={isSearching}
          />
          {isSearching && (
            <Grow in={isSearching}>
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
                  searchParamsDto?.search_data.segments?.length
                    ? searchParamsDto.search_data.segments.length > 1
                    : false
                }
                onSubmit={(values) => setFilters(values)}
                activeFilter={activeFilter}
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
              {isSearching && (
                <>
                  <FlightResultSkeleton />
                  <FlightResultSkeleton />
                  <FlightResultSkeleton />
                </>
              )}
              {isSuccess && (
                <>
                  <SearchResults results={filteredData?.slice(0, resultsNumber)} />
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
              isLoading={isNavigating}
              onClose={() => setFlightDetailsOpen(false)}
              onSelectFlight={handleSelectFlight}
            />
          </Drawer>
          <Drawer
            open={activeFilterOpen}
            onClose={() => {
              setActiveFilter('all')
              setActiveFilterOpen(false)
            }}
            anchor="bottom"
            PaperProps={{
              sx: {
                borderRadius: 0,
                maxHeight: 'calc(100% - 200px)',
                height: 'auto',
              },
            }}>
            <Box py={0.5} px={1}>
              <IconButton
                aria-label="close"
                onClick={() => setActiveFilterOpen(false)}
                data-testid="searchFlightsDrawerFilters-closeButton"
                sx={{ float: 'right' }}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider />
            <SearchFlightsFilters
              filterData={response?.searchFilters}
              selectedFilters={filters}
              airlines={getAirlines()}
              departure={response?.solutions[0]?.routes[0]?.segments[0]?.departure}
              arrival={
                response?.solutions[0]?.routes[0]?.segments[
                  response.solutions[0]?.routes[0]?.segments?.length - 1
                ]?.arrival
              }
              isRoundTrip={
                searchParamsDto?.search_data.segments?.length
                  ? searchParamsDto.search_data.segments.length > 1
                  : false
              }
              onSubmit={(values) => setFilters(values)}
              activeFilter={activeFilter}
            />
          </Drawer>
        </SectionContainer>
      </Box>
    </>
  )
}
