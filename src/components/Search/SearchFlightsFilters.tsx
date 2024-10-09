'use client'

import React from 'react'
import { Box, FormControl, Paper, Stack, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik'
import * as Yup from 'yup'
import {
  AirlineFilterData,
  SearchFlightFilters,
  SearchResponseFilterData,
  SearchFlightsFiltersMobile,
} from '@/types'
import {
  ScalesFilterField,
  OneNightScaleFilterField,
  MaxPriceFilterField,
  MaxPriceTypeFilterField,
  FlightTimeFilterField,
  AirlinesFilterField,
} from '@/components'
import { useLocationData } from '@/services'
import { locationName } from '@/utils'
import { AirportFilterField } from './AirportFilterField'

const AutoSubmit = () => {
  const { values, submitForm } = useFormikContext()
  React.useEffect(() => {
    submitForm()
  }, [values, submitForm])
  return null
}

const filtersSchema = Yup.object().shape({
  scales: Yup.string(),
  oneNightScale: Yup.boolean(),
  experience: Yup.string().nullable(),
  maxPrice: Yup.number(),
  maxPriceType: Yup.string(),
  flightTime: Yup.string().nullable(),
  flightTimeReturn: Yup.string().nullable(),
  airlinesSelected: Yup.array().of(Yup.string()),
})

type SearchFlightsFiltersProps = {
  onSubmit: (values: SearchFlightFilters, actions: FormikHelpers<SearchFlightFilters>) => void
  filterData?: SearchResponseFilterData
  airlines?: AirlineFilterData[]
  departure?: string
  arrival?: string
  isRoundTrip?: boolean
  activeFilter: SearchFlightsFiltersMobile
  selectedFilters?: SearchFlightFilters
}

export const SearchFlightsFilters = ({
  onSubmit,
  filterData,
  departure,
  arrival,
  airlines,
  isRoundTrip,
  activeFilter,
  selectedFilters,
}: SearchFlightsFiltersProps) => {
  const DEFAULT_FILTERS = {
    scales: 'all',
    oneNightScale: false,
    experience: null,
    maxPrice: filterData?.maxPrice || 0,
    maxPriceType: 'per-person',
    flightTime: null,
    flightTimeReturn: null,
    airlinesSelected: [],
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
  } as SearchFlightFilters

  const { data: departureLocationData } = useLocationData({
    locationCode: departure ? departure : '',
  })
  const { data: arrivalLocationData } = useLocationData({ locationCode: arrival ? arrival : '' })

  return (
    <Paper sx={{ paddingX: 2, paddingY: { xs: 1, lg: 4 }, height: 'fit-content' }}>
      <Formik
        initialValues={selectedFilters || DEFAULT_FILTERS}
        validationSchema={filtersSchema}
        onSubmit={onSubmit}
        enableReinitialize>
        {({ values }) => (
          <Form data-testid="searchFlightsFilters">
            <Stack gap={3}>
              <AutoSubmit />
              <Typography variant="titleLg">Filtrer par </Typography>
              {(activeFilter === 'all' || activeFilter === 'scales') && (
                <Box>
                  <Typography variant="titleMd" pb={1}>
                    Escales
                  </Typography>
                  <Box pl={1.5}>
                    <ScalesFilterField name="scales" disabled={filterData === undefined} />
                    <Box sx={{ paddingTop: 1 }}>
                      <OneNightScaleFilterField
                        name="oneNightScale"
                        disabled={filterData === undefined}
                      />
                    </Box>
                  </Box>
                </Box>
              )}
              {(activeFilter === 'all' || activeFilter === 'price') && (
                <Box pb={1}>
                  <Stack direction="row" justifyContent="space-between" pb={1}>
                    <Typography variant="titleMd">Prix maximum</Typography>
                    <Typography variant="bodyLg" data-testid="searchFlightsFilters-maxPriceLabel">
                      {values.maxPrice}€
                    </Typography>
                  </Stack>
                  <MaxPriceFilterField
                    name="maxPrice"
                    highestPrice={filterData?.maxPrice}
                    lowestPrice={filterData?.minPrice}
                    disabled={filterData === undefined}
                  />
                  <FormControl sx={{ m: 1, minWidth: 120, width: '100%', margin: 0 }}>
                    <MaxPriceTypeFilterField
                      name="maxPriceType"
                      disabled={filterData === undefined}
                    />
                  </FormControl>
                </Box>
              )}
              {(activeFilter === 'all' || activeFilter === 'routes') && (
                <>
                  <Box>
                    {filterData !== undefined && (
                      <>
                        <Stack direction="row" gap={1} alignItems="center" pb={1}>
                          <Typography variant="titleMd">
                            {locationName(departureLocationData)}
                          </Typography>
                          <ArrowForwardIcon data-testid={null} />
                          <Typography variant="titleMd">
                            {locationName(arrivalLocationData)}
                          </Typography>
                        </Stack>
                      </>
                    )}
                    <Typography variant="labelLg">Tranche horaire pour le départ</Typography>
                    {filterData !== undefined && (
                      <Box pb={1}>
                        <Typography variant="bodySm">
                          Départ de aeroport de{' '}
                          {departureLocationData ? locationName(departureLocationData) : departure}
                        </Typography>
                      </Box>
                    )}
                    <Box pb={1}>
                      <FlightTimeFilterField
                        name="flightTime"
                        disabled={filterData === undefined}
                      />
                    </Box>
                    {filterData !== undefined && filterData.airports[0]?.from.length > 1 && (
                      <>
                        <Typography variant="labelLg" pb={1}>
                          Décoller depuis
                        </Typography>
                        <Box
                          pl={1.5}
                          pb={1}
                          data-testid="searchFlightsFilters-route0-departureAirports">
                          <AirportFilterField
                            airports={
                              filterData.airports.find((a) => a.routeIndex === 0)?.from || []
                            }
                            name="routes[0].departureAirports"
                          />
                        </Box>
                      </>
                    )}
                    {filterData !== undefined && filterData.airports[0]?.to.length > 1 && (
                      <>
                        <Typography variant="labelLg" pb={1}>
                          Attérir à
                        </Typography>
                        <Box pl={1.5} data-testid="searchFlightsFilters-route0-arrivalAirports">
                          <AirportFilterField
                            airports={filterData.airports.find((a) => a.routeIndex === 0)?.to || []}
                            name="routes[0].arrivalAirports"
                          />
                        </Box>
                      </>
                    )}
                  </Box>
                  <Box>
                    {filterData !== undefined && (
                      <Box>
                        <Stack direction="row" gap={1} alignItems="center" pb={1}>
                          <Typography variant="titleMd">
                            {locationName(arrivalLocationData)}
                          </Typography>
                          <ArrowForwardIcon data-testid={null} />
                          <Typography variant="titleMd">
                            {locationName(departureLocationData)}
                          </Typography>
                        </Stack>
                      </Box>
                    )}
                    {isRoundTrip && (
                      <Box pb={1}>
                        <Typography variant="labelLg">Tranche horaire pour le retour</Typography>
                        {filterData !== undefined && (
                          <Box pb={1}>
                            <Typography variant="bodySm">
                              Arrivé à l'aeroport de{' '}
                              {departureLocationData
                                ? locationName(departureLocationData)
                                : departure}
                            </Typography>
                          </Box>
                        )}
                        <FlightTimeFilterField
                          name="flightTimeReturn"
                          disabled={filterData === undefined}
                        />
                      </Box>
                    )}
                    {isRoundTrip &&
                      filterData !== undefined &&
                      filterData.airports[1]?.from.length > 1 && (
                        <>
                          <Typography variant="labelLg" pb={1}>
                            Décoller depuis
                          </Typography>
                          <Box
                            pl={1.5}
                            pb={1}
                            data-testid="searchFlightsFilters-route1-departureAirports">
                            <AirportFilterField
                              airports={
                                filterData.airports.find((a) => a.routeIndex === 1)?.from || []
                              }
                              name="routes[1].departureAirports"
                            />
                          </Box>
                        </>
                      )}
                    {isRoundTrip &&
                      filterData !== undefined &&
                      filterData.airports[1]?.to.length > 1 && (
                        <>
                          <Typography variant="labelLg" pb={1}>
                            Attérir à
                          </Typography>
                          <Box pl={1.5} data-testid="searchFlightsFilters-route1-arrivalAirports">
                            <AirportFilterField
                              airports={
                                filterData.airports.find((a) => a.routeIndex === 1)?.to || []
                              }
                              name="routes[1].arrivalAirports"
                            />
                          </Box>
                        </>
                      )}
                  </Box>
                </>
              )}
              {(activeFilter === 'all' || activeFilter === 'airlines') &&
                filterData !== undefined && (
                  <Box>
                    <Typography variant="titleMd" pb={1}>
                      Compagnies aériennes
                    </Typography>
                    <Box pl={1.5} pb={1}>
                      <AirlinesFilterField airlines={airlines} name="airlinesSelected" />
                    </Box>
                  </Box>
                )}
            </Stack>
          </Form>
        )}
      </Formik>
    </Paper>
  )
}
