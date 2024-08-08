'use client'

import React from 'react'
import { Button, Stack, Typography } from '@mui/material'
import { AirlineFilterData, SearchFlightFilters } from '@/types'
import { useSearchFlights } from '@/services'
import { SearchFlightsFilters, FlightDateAlternatives, SearchResults } from '@/components'
import { useFlights } from '@/contexts'

export const SearchFlights = () => {
  const RESULTS_PER_PAGE = 10
  const [resultsNumber, setResultsNumber] = React.useState(RESULTS_PER_PAGE)
  const [filters, setFilters] = React.useState({} as SearchFlightFilters)
  const { searchParams } = useFlights()
  const { data: response } = useSearchFlights({ params: searchParams })
  const filteredData = response?.solutions
    .filter((solution) => {
      const totalStops = solution.routes.reduce((acc, route) => acc + (route.stopNumber || 0), 0)
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

      return true
    })
    .sort((a, b) => a.priceInfo.total - b.priceInfo.total)

  const getAirlines = () => {
    const airlines: AirlineFilterData[] = []
    filteredData?.forEach((solution) => {
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

  return (
    <>
      {response && (
        <SearchFlightsFilters
          filterData={response.searchFilters}
          airlines={getAirlines()}
          departure={response.solutions[0]?.routes[0]?.segments[0]?.departure}
          arrival={
            response.solutions[0]?.routes[0]?.segments[
              response.solutions[0]?.routes[0]?.segments?.length - 1
            ]?.arrival
          }
          onSubmit={(values) => setFilters(values)}
        />
      )}
      <Stack gap={2} flexGrow={1}>
        <Stack gap={1}>
          <Typography variant="titleMd" pb={1}>
            Ajustez la date de votre départ
          </Typography>
          <FlightDateAlternatives />
        </Stack>
        <Typography variant="bodySm" color="grey.600">
          Prices displayed include taxes and may change based on availability. You can review any
          additional fees <br />
          before checkout. Prices are not final until you complete your purchase.
        </Typography>
        {response && (
          <>
            <SearchResults results={filteredData?.slice(0, resultsNumber)} />
            <Button
              onClick={() => setResultsNumber(resultsNumber + RESULTS_PER_PAGE)}
              data-testid="searchFlights-viewMoreResultsButton">
              Voir plus
            </Button>
          </>
        )}
      </Stack>
    </>
  )
}
