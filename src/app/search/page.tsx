'use client'

import React, { useEffect } from 'react'
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
  OldNavbar,
  Footer,
  NoAgencyWarningModal,
  NoResultsErrorModal,
} from '@/components'
import {
  Box,
  Drawer,
  Button,
  Grow,
  Stack,
  Typography,
  IconButton,
  Divider,
  Modal,
} from '@mui/material'
import { useAgencySelector, useBooking, useFlights } from '@/contexts'
import {
  SearchFlightsParams,
  Solution,
  AirlineFilterData,
  SearchFlightFilters,
  SearchFlightsFiltersOptions,
} from '@/types'
import { getBrandedFares, useCreateOrder, useSearchFlights } from '@/services'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useQueryClient } from '@tanstack/react-query'
import CloseIcon from '@mui/icons-material/Close'
import useMetadata from '@/contexts/useMetadata'

export default function FlighsPage() {
  useMetadata('Rechercher des vols')
  const theme = useTheme()
  const queryClient = useQueryClient()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const RESULTS_PER_PAGE = 10
  const [isAgencyWarningOpen, setIsAgencyWarningOpen] = React.useState(false)
  const [isNoResultsModalOpen, setIsNoResultsModalOpen] = React.useState(false)
  const [isNavigating, setIsNavigating] = React.useState(false)
  const [resultsNumber, setResultsNumber] = React.useState(RESULTS_PER_PAGE)
  const [activeFilter, setActiveFilter] = React.useState<SearchFlightsFiltersOptions>('all')
  const [activeFilterOpen, setActiveFilterOpen] = React.useState(false)
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

  const { flightDetailsOpen, setFlightDetailsOpen, searchParamsDto, setSearchParams } = useFlights()
  const {
    goToFirstStep,
    order,
    skipStep,
    setOrder,
    resetBooking,
    setSelectedFare,
    setSelectedFlight,
  } = useBooking()
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder()
  const { selectedAgencyId, setIsAgencySelectorOpen } = useAgencySelector()
  const {
    data: response,
    isSuccess,
    isLoading: isSearching,
  } = useSearchFlights({
    params: searchParamsDto,
    orderId: order?.id,
  })
  const isLoading = isSearching || isCreatingOrder

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

  const searchFlights = ({ searchParams }: { searchParams?: SearchFlightsParams }) => {
    if (!selectedAgencyId) {
      // TODO: log this somewhere
      // TODO: Warn the user that something went wrong
      setIsAgencyWarningOpen(true)
      return
    }
    createOrder(
      { agencyId: selectedAgencyId },
      {
        onSuccess: (order) => {
          setOrder(order)
          searchParams && setSearchParams(searchParams)
        },
        onError: (error) => {
          // TODO: log this somewhere
          // TODO: Warn the user that something went wrong
        },
      },
    )
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
    resetBooking()

    // We can ask more information about the flight to decide which steps to follow
    let selectedFare = flight
    try {
      const fares = await queryClient.fetchQuery<Solution[]>({
        queryKey: ['brandedFares', order.id, flight.id],
        queryFn: () => getBrandedFares({ orderId: order.id, solutionId: flight.id }),
        gcTime: Infinity, // TODO: this is not true
        staleTime: Infinity, // TODO: this is not true
      })
      if (fares.length === 0) {
        skipStep('fares')
      }
      const basicFare = fares.find(
        (solution) => solution.priceInfo.total === flight.priceInfo.total,
      )
      if (basicFare) {
        selectedFare = basicFare
      } else {
        // TODO: log this somewhere
      }
    } catch (error) {
      skipStep('fares')
      // TODO: log this somewhere
      // TODO: Warn the user that something went wrong
    }
    setSelectedFlight(flight)
    setSelectedFare(selectedFare)
    setFlightDetailsOpen(false)
    goToFirstStep()
  }

  useEffect(() => {
    if (searchParamsDto && !order) {
      searchFlights({})
    }
  }, [])

  useEffect(() => {
    if (response?.solutions.length === 0) {
      setIsNoResultsModalOpen(true)
    }
  }, [response])

  return (
    <>
      <TopBar height={isDesktop ? 120 : 214} fixed={isDesktop ? false : true}>
        <Navbar />
        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
          <OldNavbar />
        </Box>
        <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
          <SelectedFlightInfoTopbarMobile
            withFilters
            onOpenFilters={(filterName) => {
              setActiveFilter(filterName)
              setActiveFilterOpen(true)
            }}
            onSearch={onSearch}
            isLoading={isLoading}
          />
        </Box>
      </TopBar>
      <Box
        sx={{
          backgroundColor: 'grey.200',
        }}>
        <Stack
          sx={{
            justifyContent: 'space-between',
            paddingY: { xs: 2, lg: 3 },
            flexDirection: 'column',
          }}>
          <SearchFlightsModes
            sticky={true}
            onSearch={onSearch}
            sx={{ mb: 3, display: { xs: 'none', lg: 'block' } }}
            disabled={isLoading}
          />
          <SectionContainer>
            <Stack direction="column" width="100%">
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
                  {isLoading && (
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
                          variant="contained"
                          onClick={() => setResultsNumber(resultsNumber + RESULTS_PER_PAGE)}
                          data-testid="searchFlights-viewMoreResultsButton">
                          Résultats suivants
                        </Button>
                      )}
                      <Typography
                        variant="bodySm"
                        color="grey.600"
                        textAlign={isDesktop ? 'left' : 'center'}>
                        Les prix affichés incluent les taxes et peuvent changer en fonction de la
                        disponibilité. Vous pouvez consulter les frais supplémentaires avant le
                        paiement. Les prix ne sont pas définitifs tant que vous n'avez pas finalisé
                        votre achat.
                      </Typography>
                    </>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </SectionContainer>
        </Stack>
        <Footer />
      </Box>
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
      <Modal open={isAgencyWarningOpen} onClose={() => setIsAgencyWarningOpen(false)}>
        <NoAgencyWarningModal
          onShowAgency={() => {
            setIsAgencySelectorOpen(true)
            setIsAgencyWarningOpen(false)
          }}
        />
      </Modal>
      <Modal open={isNoResultsModalOpen} onClose={() => setIsNoResultsModalOpen(false)}>
        <NoResultsErrorModal onClose={() => setIsNoResultsModalOpen(false)} />
      </Modal>
    </>
  )
}
