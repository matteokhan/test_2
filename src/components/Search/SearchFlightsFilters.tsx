'use client'

import React from 'react'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import { Form, Formik, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { SearchFlightFilters } from '@/types'
import {
  ExperienceFilterField,
  ScalesFilterField,
  OneNightScaleFilterField,
  MaxPriceFilterField,
  MaxPriceTypeFilterField,
  FlightTimeFilterField,
} from '@/components'

const DEFAULT_FILTERS = {
  scales: 'all',
  oneNightScale: false,
  experience: null,
  maxPrice: 450,
  maxPriceType: 'per-person',
  flightTime: null,
} as SearchFlightFilters

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
}

export const SearchFlightsFilters = ({ onSubmit }: SearchFlightsFiltersProps) => {
  return (
    <Paper sx={{ paddingX: 2, paddingY: 4 }}>
      <Formik
        initialValues={DEFAULT_FILTERS}
        validationSchema={filtersSchema}
        onSubmit={onSubmit}
        enableReinitialize>
        {({ values }) => (
          <Form>
            <Stack gap={3}>
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
                  <Typography variant="bodyLg">{values.maxPrice}€</Typography>
                </Stack>
                <MaxPriceFilterField name="maxPrice" />
                <FormControl sx={{ m: 1, minWidth: 120, width: '100%', margin: 0 }}>
                  <MaxPriceTypeFilterField name="maxPriceType" />
                </FormControl>
              </Box>
              <Box pb={1}>
                <Typography variant="titleMd" pb={1}>
                  Temps de vol
                </Typography>
                <Box pb={1}>
                  <Stack direction="row" gap={1} alignItems="center">
                    <Typography variant="titleSm">Paris (PAR)</Typography>
                    <ArrowForwardIcon />
                    <Typography variant="titleSm">Sydney (SYD)</Typography>
                  </Stack>
                  <Typography variant="bodySm">Départ de Paris Charles de Gaulle</Typography>
                </Box>
                <FlightTimeFilterField name="flightTime" />
              </Box>

              <Box>
                <Typography variant="titleMd" pb={1}>
                  Compagnies aériennes
                </Typography>
                <Box pl={1.5} pb={1}>
                  <FormGroup>
                    <Stack justifyContent="space-between" direction="row" alignItems="center">
                      <FormControlLabel
                        value="air-france"
                        control={<Checkbox />}
                        label="Air France"
                      />
                      <Typography variant="bodyMd">1399€</Typography>
                    </Stack>
                    <Stack justifyContent="space-between" direction="row" alignItems="center">
                      <FormControlLabel
                        value="tur-airlines"
                        control={<Checkbox />}
                        label="Turkish Airlines (8)"
                      />
                      <Typography variant="bodyMd">1399€</Typography>
                    </Stack>
                    <Stack justifyContent="space-between" direction="row" alignItems="center">
                      <FormControlLabel
                        value="brit-airlines"
                        control={<Checkbox />}
                        label="British Airways (11)"
                      />
                      <Typography variant="bodyMd">1399€</Typography>
                    </Stack>
                  </FormGroup>
                </Box>
                <Button size="small" variant="text" sx={{ padding: 0 }}>
                  Voir plus
                </Button>
              </Box>
            </Stack>
          </Form>
        )}
      </Formik>
    </Paper>
  )
}
