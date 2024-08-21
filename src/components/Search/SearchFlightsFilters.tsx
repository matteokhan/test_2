'use client'

import React from 'react'
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik'
import * as Yup from 'yup'
import { AirlineFilterData, SearchFlightFilters, SearchResponseFilterData } from '@/types'
import {
  ExperienceFilterField,
  ScalesFilterField,
  OneNightScaleFilterField,
  MaxPriceFilterField,
  MaxPriceTypeFilterField,
  FlightTimeFilterField,
} from '@/components'
import { useAirlinesData, useAirportData } from '@/services'
import { airportName } from '@/utils'

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
  airlineSelected: Yup.array().of(Yup.string()),
})

type SearchFlightsFiltersProps = {
  onSubmit: (values: SearchFlightFilters, actions: FormikHelpers<SearchFlightFilters>) => void
  filterData?: SearchResponseFilterData
  airlines?: AirlineFilterData[]
  departure?: string
  arrival?: string
}

export const SearchFlightsFilters = ({
  onSubmit,
  filterData,
  departure,
  arrival,
  airlines,
}: SearchFlightsFiltersProps) => {
  const DEFAULT_FILTERS = {
    scales: 'all',
    oneNightScale: false,
    experience: null,
    maxPrice: filterData?.maxPrice,
    maxPriceType: 'per-person',
    flightTime: null,
    airlinesSelected: [],
  } as SearchFlightFilters

  const { data: departureAirportData } = useAirportData({ airportCode: departure ? departure : '' })
  const { data: arrivalAirportData } = useAirportData({ airportCode: arrival ? arrival : '' })
  const { data: airlinesData } = useAirlinesData()

  return (
    <Paper sx={{ paddingX: 2, paddingY: 4, height: 'fit-content' }}>
      <Formik
        initialValues={DEFAULT_FILTERS}
        validationSchema={filtersSchema}
        onSubmit={onSubmit}
        enableReinitialize>
        {({ values, handleChange }) => (
          <Form data-testid="searchFlightsFilters">
            <Stack gap={3}>
              <AutoSubmit />
              <Typography variant="titleLg">Filtrer par </Typography>
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
              <Box pb={1}>
                <Typography variant="titleMd" pb={1}>
                  Expérience de vol
                </Typography>
                <Box pl={1.5}>
                  <ExperienceFilterField name="experience" disabled={filterData === undefined} />
                </Box>
              </Box>
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

              {/* TODO: transform ville de and aeroport to city name and airport name, need mapping table */}
              <Box pb={1}>
                <Typography variant="titleMd" pb={1}>
                  Temps de vol
                </Typography>
                <Box pb={1}>
                  <Stack direction="row" gap={1} alignItems="center">
                    <Typography variant="titleSm">
                      {airportName(departureAirportData)} ({departure})
                    </Typography>
                    <ArrowForwardIcon data-testid={null} />
                    <Typography variant="titleSm">
                      {airportName(arrivalAirportData)} ({arrival})
                    </Typography>
                  </Stack>
                  <Typography variant="bodySm">
                    Départ de aeroport{' '}
                    {departureAirportData ? departureAirportData.extension : departure}
                  </Typography>
                </Box>
                <FlightTimeFilterField name="flightTime" disabled={filterData === undefined} />
              </Box>
              <Box>
                <Typography variant="titleMd" pb={1}>
                  Compagnies aériennes
                </Typography>
                {/* TODO: Add tests ids */}
                <Box pl={1.5} pb={1}>
                  <FormGroup>
                    {airlines?.map((airline) => {
                      const airlineName =
                        (airlinesData ? airlinesData[airline.carrier]?.name : '') +
                        ' (' +
                        airline.carrier +
                        ')'
                      return (
                        <Stack
                          key={airline.carrier}
                          justifyContent="space-between"
                          direction="row"
                          alignItems="center">
                          <FormControlLabel
                            value={airline.carrier}
                            control={<Checkbox />}
                            name="airlinesSelected"
                            label={airlineName}
                            onChange={handleChange}
                          />
                          <Typography variant="bodyMd">
                            {airline.price}
                            {airline.currencySymbol}
                          </Typography>
                        </Stack>
                      )
                    })}
                  </FormGroup>
                </Box>
              </Box>
            </Stack>
          </Form>
        )}
      </Formik>
    </Paper>
  )
}
