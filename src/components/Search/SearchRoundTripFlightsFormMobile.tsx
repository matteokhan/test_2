'use client'

import React, { MutableRefObject, useState } from 'react'
import { Form, Formik, Field, FormikProps } from 'formik'
import { RoundTripFlightSearchParams, SearchFlightSegmentType } from '@/types'
import * as Yup from 'yup'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import { Box, Button, Drawer, Paper, Stack, TextField, Typography } from '@mui/material'
import { DateRangeCalendar } from '@mui/x-date-pickers-pro'
import { DestinationField, DepartureField, PassengersControls } from '@/components'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const DEFAULT_VALUES: RoundTripFlightSearchParams = {
  adults: 1,
  childrens: 0,
  infants: 0,
  from: '',
  fromLabel: '',
  fromCountry: '',
  fromInputValue: '',
  fromType: SearchFlightSegmentType.PLACE,
  to: '',
  toLabel: '',
  toCountry: '',
  toInputValue: '',
  toType: SearchFlightSegmentType.PLACE,
  departure: dayjs().add(2, 'day').format('YYYY-MM-DD'),
  return: dayjs().add(3, 'day').format('YYYY-MM-DD'),
  _type: 'roundTrip',
}

export const ROUND_TRIP_DEFAULT_VALUES = DEFAULT_VALUES

const searchParamsSchema = Yup.object().shape({
  adults: Yup.number().min(1).required('Requise'),
  childrens: Yup.number().min(0).required('Requise'),
  infants: Yup.number().min(0).required('Requise'),
  from: Yup.string().required('Requise'),
  fromLabel: Yup.string(),
  fromType: Yup.number(),
  to: Yup.string().required('Requise'),
  toLabel: Yup.string(),
  toType: Yup.number(),
  departure: Yup.date().typeError('Date invalide').required('Requise'),
  return: Yup.date()
    .typeError('Date invalide')
    .required('Requise')
    .min(Yup.ref('departure'), 'La date de retour doit être après la date de départ'),
})

type SearchRoundTripFlightsFormMobileProps = {
  formRef: MutableRefObject<FormikProps<RoundTripFlightSearchParams> | null>
  initialValues?: RoundTripFlightSearchParams
}

export const SearchRoundTripFlightsFormMobile = ({
  formRef,
  initialValues,
}: SearchRoundTripFlightsFormMobileProps) => {
  const [departureIsOpen, setDepartureIsOpen] = useState(false)
  const [destinationIsOpen, setDestinationIsOpen] = useState(false)
  const [datesIsOpen, setDatesIsOpen] = useState(false)
  const [passengersIsOpen, setPassengersIsOpen] = useState(false)

  return (
    <Formik
      innerRef={formRef}
      initialValues={initialValues || DEFAULT_VALUES}
      validationSchema={searchParamsSchema}
      onSubmit={() => {}}
      enableReinitialize>
      {({ values, setFieldValue, touched, errors }) => {
        const totalPassengers = values.adults + values.childrens + values.infants
        return (
          <Form data-testid="searchRoundTripMobile-form">
            <p>{values.departure}</p>
            <p>{values.return}</p>
            <Stack gap={1}>
              <Field
                as={TextField}
                label="Vol au départ de"
                variant="filled"
                error={touched.from && errors.from}
                helperText={touched.from && errors.from}
                inputProps={{
                  'data-testid': 'searchRoundTripMobile-departureField',
                  readOnly: true,
                }}
                onClick={() => setDepartureIsOpen(true)}
                value={values.fromLabel}
              />
              <Field
                as={TextField}
                label="Vol à destination de"
                variant="filled"
                error={touched.to && errors.to}
                helperText={touched.to && errors.to}
                inputProps={{
                  'data-testid': 'searchRoundTripMobile-destinationField',
                  readOnly: true,
                }}
                onClick={() => setDestinationIsOpen(true)}
                value={values.toLabel}
              />
              <Field
                as={TextField}
                label="Ajouter des dates"
                variant="filled"
                error={(touched.departure && errors.departure) || (touched.return && errors.return)}
                helperText={
                  (touched.departure && errors.departure) || (touched.return && errors.return)
                }
                inputProps={{
                  'data-testid': 'datesField',
                  readOnly: true,
                }}
                onClick={() => setDatesIsOpen(true)}
                value={`${values.departure ? dayjs(values.departure).format('DD/MM/YYYY') : ''} - ${values.return ? dayjs(values.return).format('DD/MM/YYYY') : ''}`}
              />
              <Field
                as={TextField}
                label="Voyageurs"
                variant="filled"
                error={touched.adults && errors.adults}
                helperText={touched.adults && errors.adults}
                inputProps={{
                  'data-testid': 'passengersField',
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
                <DepartureField onChange={() => setDepartureIsOpen(false)} />
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
                <DestinationField onChange={() => setDestinationIsOpen(false)} />
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
                <DateRangeCalendar
                  calendars={1}
                  sx={{ mt: 2 }}
                  data-testid="datesField"
                  value={[dayjs(values.departure), dayjs(values.return)]}
                  minDate={dayjs()}
                  onChange={(value) => {
                    console.log(value)
                    setFieldValue('departure', value[0]?.format('YYYY-MM-DD'), true)
                    setFieldValue('return', value[1]?.format('YYYY-MM-DD'), true)
                  }}
                />
              </Box>
              <Paper
                elevation={3}
                sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', borderRadius: 0 }}>
                <Stack px={3} py={2}>
                  <Typography variant="titleMd" color="grey.900" textAlign="right">
                    Du {dayjs(values.departure).format('ddd. D MMM.')} au{' '}
                    {dayjs(values.return).format('ddd. D MMM.')}
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
                      data-testid="datesDrawer-clearButton"
                      onClick={() => {
                        setFieldValue('departure', DEFAULT_VALUES.departure, true)
                        setFieldValue('return', DEFAULT_VALUES.return, true)
                      }}>
                      Tout effacer
                    </Button>
                    <Button
                      variant="contained"
                      size="medium"
                      data-testid="datesDrawer-submitButton"
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
                sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', borderRadius: 0 }}>
                <Stack
                  sx={{
                    flexDirection: 'row',
                    gap: 1,
                    justifyContent: 'flex-end',
                    px: 3,
                    py: 2,
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
                      setFieldValue('infants', DEFAULT_VALUES.infants, true)
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
              </Paper>
            </Drawer>
          </Form>
        )
      }}
    </Formik>
  )
}
