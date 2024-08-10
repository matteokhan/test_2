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
})

type SearchFlightsFiltersProps = {
  onSubmit: (values: SearchFlightFilters, actions: FormikHelpers<SearchFlightFilters>) => void
  filterData: SearchResponseFilterData
  airlines: AirlineFilterData[]
  departure: string
  arrival: string
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
    maxPrice: Math.trunc((filterData.maxPrice - filterData.minPrice) / 2 + filterData.minPrice),
    maxPriceType: 'per-person',
    flightTime: null,
  } as SearchFlightFilters
  return (
    <Paper sx={{ paddingX: 2, paddingY: 4, height: 'fit-content' }}>
      <Formik
        initialValues={DEFAULT_FILTERS}
        validationSchema={filtersSchema}
        onSubmit={onSubmit}
        enableReinitialize>
        {({ values }) => (
          <Form data-testid="searchFlightsFilters">
            <Stack gap={3}>
              <AutoSubmit />
              <Typography variant="titleLg">Filtrer par </Typography>
              <Box>
                <Typography variant="titleMd" pb={1}>
                  Escales
                </Typography>
                <Box pl={1.5}>
                  <ScalesFilterField name="scales" />
                  <Box sx={{ paddingTop: 1 }}>
                    <OneNightScaleFilterField name="oneNightScale" />
                  </Box>
                </Box>
              </Box>
              <Box pb={1}>
                <Typography variant="titleMd" pb={1}>
                  Expérience de vol
                </Typography>
                <Box pl={1.5}>
                  <ExperienceFilterField name="experience" />
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
                  highestPrice={filterData.maxPrice}
                  lowestPrice={filterData.minPrice}
                />
                <FormControl sx={{ m: 1, minWidth: 120, width: '100%', margin: 0 }}>
                  <MaxPriceTypeFilterField name="maxPriceType" />
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
                      Ville de {departure} ({departure})
                    </Typography>
                    <ArrowForwardIcon data-testid={null} />
                    <Typography variant="titleSm">
                      Ville de {arrival} ({arrival})
                    </Typography>
                  </Stack>
                  <Typography variant="bodySm">Départ de aeroport {departure}</Typography>
                </Box>
                <FlightTimeFilterField name="flightTime" />
              </Box>
              <Box>
                <Typography variant="titleMd" pb={1}>
                  Compagnies aériennes
                </Typography>
                {/* TODO: Add tests ids */}
                <Box pl={1.5} pb={1}>
                  <FormGroup>
                    {airlines.map((airline) => (
                      <Stack
                        key={airline.carrier}
                        justifyContent="space-between"
                        direction="row"
                        alignItems="center">
                        <FormControlLabel
                          value={airline.carrier}
                          control={<Checkbox />}
                          name="airlines"
                          label={airline.carrier}
                        />
                        <Typography variant="bodyMd">
                          {airline.price}
                          {airline.currencySymbol}
                        </Typography>
                      </Stack>
                    ))}
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
