'use client'

import React, { MutableRefObject, useState } from 'react'
import { Form, Formik, Field, FormikProps } from 'formik'
import { OneWayFlightSearchParams } from '@/types'
import * as Yup from 'yup'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import { Box, Button, Drawer, Paper, Stack, TextField, Typography } from '@mui/material'
import { DateCalendar } from '@mui/x-date-pickers-pro'

import { DestinationField, DepartureField, PassengersControls } from '@/components'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const DEFAULT_VALUES = {
  adults: 1,
  childrens: 0,
  infant: 0,
  from: '',
  to: '',
  departure: dayjs().add(2, 'day').format('YYYY-MM-DD'),
  _type: 'oneWay',
} as OneWayFlightSearchParams

const searchParamsSchema = Yup.object().shape({
  adults: Yup.number().min(1).required('Requise'),
  childrens: Yup.number().min(0).required('Requise'),
  infant: Yup.number().min(0).required('Requise'),
  from: Yup.string().required('Requise'),
  to: Yup.string().required('Requise'),
  departure: Yup.date().typeError('Date invalide').required('Requise'),
})

type SearchOneWayFlightsFormMobileProps = {
  formRef: MutableRefObject<FormikProps<OneWayFlightSearchParams> | null>
  initialValues?: OneWayFlightSearchParams
}

export const SearchOneWayFlightsFormMobile = ({
  formRef,
  initialValues,
}: SearchOneWayFlightsFormMobileProps) => {
  const [departureIsOpen, setDepartureIsOpen] = useState(false)
  const [destinationIsOpen, setDestinationIsOpen] = useState(false)
  const [datesIsOpen, setDatesIsOpen] = useState(false)
  const [passengersIsOpen, setPassengersIsOpen] = useState(false)
  const [departureSearchTerm, setDepartureSearchTerm] = useState('')
  const [destinationSearchTerm, setDestinationSearchTerm] = useState('')

  return (
    <Formik
      innerRef={formRef}
      initialValues={initialValues || DEFAULT_VALUES}
      validationSchema={searchParamsSchema}
      onSubmit={() => {}}
      enableReinitialize>
      {({ values, setFieldValue, touched, errors }) => {
        const totalPassengers = values.adults + values.childrens + values.infant
        return (
          <Form data-testid="searchOneWayMobile-form">
            <Stack gap={1}>
              <Field
                as={TextField}
                label="Vol au départ de"
                variant="filled"
                error={touched.from && errors.from}
                helperText={touched.from && errors.from}
                inputProps={{
                  'data-testid': 'searchOneWayMobile-departureField',
                  readOnly: true,
                }}
                onClick={() => setDepartureIsOpen(true)}
                value={departureSearchTerm ? departureSearchTerm : ''}
              />
              <Field
                as={TextField}
                label="Vol à destination de"
                variant="filled"
                error={touched.to && errors.to}
                helperText={touched.to && errors.to}
                inputProps={{
                  'data-testid': 'searchOneWayMobile-destinationField',
                  readOnly: true,
                }}
                onClick={() => setDestinationIsOpen(true)}
                value={destinationSearchTerm ? destinationSearchTerm : ''}
              />
              <Field
                as={TextField}
                label="Ajouter des dates"
                variant="filled"
                error={touched.departure && errors.departure}
                helperText={touched.departure && errors.departure}
                inputProps={{
                  'data-testid': 'searchOneWayMobile-datesField',
                  readOnly: true,
                }}
                onClick={() => setDatesIsOpen(true)}
                value={`${dayjs(values.departure).format('YYYY/MM/DD')}`}
              />
              <Field
                as={TextField}
                label="Voyageurs"
                variant="filled"
                error={touched.adults && errors.adults}
                helperText={touched.adults && errors.adults}
                inputProps={{
                  'data-testid': 'searchOneWayMobile-passengersField',
                  readOnly: true,
                }}
                onClick={() => setPassengersIsOpen(true)}
                value={`${totalPassengers} Passager${totalPassengers !== 1 ? 's' : ''}`}
              />
            </Stack>
            <Drawer
              open={departureIsOpen}
              anchor="bottom"
              onClose={() => setDepartureIsOpen(false)}
              PaperProps={{
                sx: {
                  width: '100%',
                  height: 'calc(100% - 64px)',
                },
              }}>
              <Stack direction="row" gap={1.5} alignItems="center" px={2} py={3}>
                <Box
                  onClick={() => setDepartureIsOpen(false)}
                  data-testid="departureDrawer-backButton">
                  <ArrowBackIcon />
                </Box>
                <Typography variant="titleMd" color="#49454F">
                  Vol au départ de
                </Typography>
              </Stack>
              <Box px={3} py={1.5}>
                <DepartureField
                  onSearchTermChange={(term) => setDepartureSearchTerm(term)}
                  onChange={() => setDepartureIsOpen(false)}
                />
              </Box>
            </Drawer>
            <Drawer
              open={destinationIsOpen}
              anchor="bottom"
              onClose={() => setDestinationIsOpen(false)}
              PaperProps={{
                sx: {
                  width: '100%',
                  height: 'calc(100% - 64px)',
                },
              }}>
              <Stack direction="row" gap={2} alignItems="center" padding={3}>
                <Box
                  onClick={() => setDestinationIsOpen(false)}
                  data-testid="destinationDrawer-backButton">
                  <ArrowBackIcon />
                </Box>
                <Typography variant="titleMd" color="#49454F">
                  Vol à destination de
                </Typography>
              </Stack>
              <Box px={3} py={1.5}>
                <DestinationField
                  onSearchTermChange={(term) => setDestinationSearchTerm(term)}
                  onChange={() => setDestinationIsOpen(false)}
                />
              </Box>
            </Drawer>
            <Drawer
              open={datesIsOpen}
              anchor="bottom"
              onClose={() => setDatesIsOpen(false)}
              PaperProps={{
                sx: {
                  width: '100%',
                  height: 'calc(100% - 64px)',
                },
              }}>
              <Paper elevation={3} sx={{ borderRadius: 0 }}>
                <Stack direction="row" gap={1.5} alignItems="center" px={2} py={3}>
                  <Box
                    onClick={() => setDatesIsOpen(false)}
                    data-testid="datesDrawer-backButton"
                    sx={{ display: 'flex', alignItems: 'center' }}>
                    <ArrowBackIcon />
                  </Box>
                  <Typography variant="titleMd" color="#49454F">
                    Ajouter des dates
                  </Typography>
                </Stack>
              </Paper>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <DateCalendar
                  sx={{ width: '100%' }}
                  data-testid="dateField"
                  value={dayjs(values.departure)}
                  minDate={dayjs()}
                  onChange={(value) => {
                    setFieldValue('departure', value?.format('YYYY-MM-DD'), true)
                  }}
                />
              </Box>
              <Paper
                elevation={3}
                sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', borderRadius: 0 }}>
                <Stack px={3} py={2}>
                  <Typography variant="titleMd" color="grey.900" textAlign="right">
                    {dayjs(values.departure).format('ddd. D MMM.')}
                  </Typography>
                  <Stack
                    sx={{
                      flexDirection: 'row',
                      gap: 1,
                      justifyContent: 'flex-end',
                      mt: 2,
                      width: '100%',
                      bgcolor: 'common.white',
                    }}>
                    <Button
                      variant="outlined"
                      size="medium"
                      data-testid="departureDrawer-clearButton"
                      onClick={() => {
                        setFieldValue('departure', DEFAULT_VALUES.departure, true)
                      }}>
                      Tout effacer
                    </Button>
                    <Button
                      variant="contained"
                      size="medium"
                      data-testid="departureDrawer-submitButton"
                      onClick={() => setDatesIsOpen(false)}>
                      Valider les dates
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </Drawer>
            <Drawer
              open={passengersIsOpen}
              anchor="bottom"
              onClose={() => setPassengersIsOpen(false)}
              PaperProps={{
                sx: {
                  width: '100%',
                  height: 'calc(100% - 64px)',
                },
              }}>
              <Stack direction="row" gap={1.5} alignItems="center" px={2} py={3}>
                <Box
                  onClick={() => setPassengersIsOpen(false)}
                  data-testid="passengersDrawer-backButton"
                  sx={{ display: 'flex', alignItems: 'center' }}>
                  <ArrowBackIcon />
                </Box>
                <Typography variant="titleMd" color="#49454F">
                  Ajouter des voyageurs
                </Typography>
              </Stack>
              <Box px={3} py={1.5}>
                <PassengersControls />
              </Box>
              <Paper
                elevation={3}
                square
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  borderRadius: 'none',
                }}>
                <Stack px={3} py={2}>
                  <Stack
                    sx={{
                      flexDirection: 'row',
                      gap: 1,
                      justifyContent: 'flex-end',
                      width: '100%',
                      bgcolor: 'common.white',
                    }}>
                    <Button
                      variant="outlined"
                      size="medium"
                      data-testid="passengersDrawer-clearButton"
                      onClick={() => {
                        setFieldValue('adults', DEFAULT_VALUES.adults, true)
                        setFieldValue('childrens', DEFAULT_VALUES.childrens, true)
                        setFieldValue('infant', DEFAULT_VALUES.infant, true)
                      }}>
                      Tout effacer
                    </Button>
                    <Button
                      variant="contained"
                      size="medium"
                      data-testid="passengersDrawer-validateButton"
                      onClick={() => setPassengersIsOpen(false)}>
                      Valider
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </Drawer>
          </Form>
        )
      }}
    </Formik>
  )
}
