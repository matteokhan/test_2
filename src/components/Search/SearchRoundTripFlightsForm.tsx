'use client'

import React from 'react'
import * as Yup from 'yup'
import { Box, Button, Stack } from '@mui/material'
import { DateRangePicker, SingleInputDateRangeField } from '@mui/x-date-pickers-pro'
import { Form, Formik, FormikHelpers } from 'formik'
import { RoundTripFlightSearchParams, SearchFlightSegmentType } from '@/types'
import { CustomTextField, DepartureAndDestinationField, PassengersField } from '@/components'
import dayjs from 'dayjs'

const DEFAULT_VALUES: RoundTripFlightSearchParams = {
  adults: 1,
  childrens: 0,
  infants: 0,
  from: '',
  fromLabel: '',
  fromCountry: '',
  fromType: SearchFlightSegmentType.PLACE,
  fromInputValue: '',
  to: '',
  toLabel: '',
  toCountry: '',
  toType: SearchFlightSegmentType.PLACE,
  toInputValue: '',
  departure: dayjs().add(2, 'day').format('YYYY-MM-DD'),
  return: dayjs().add(3, 'day').format('YYYY-MM-DD'),
  _type: 'roundTrip',
}

const searchParamsSchema = Yup.object().shape({
  adults: Yup.number().min(1).required('Requise'),
  childrens: Yup.number().min(0).required('Requise'),
  infants: Yup.number().min(0).required('Requise'),
  from: Yup.string()
    .nullable()
    .test('from-validation', function (value) {
      const hasInput = Boolean(this.parent.fromInputValue) // Check if user has typed something
      const userClickedLocation = Boolean(this.parent.fromLabel)
      if (!userClickedLocation && hasInput) {
        return this.createError({
          message: 'Veuillez sélectionner une ville de départ dans la liste proposée',
        })
      }
      if (!value) {
        return this.createError({
          message: 'Requise',
        })
      }
      return true
    }),
  to: Yup.string()
    .nullable()
    .test('to-validation', function (value) {
      const hasInput = Boolean(this.parent.toInputValue) // Check if user has typed something
      const userClickedLocation = Boolean(this.parent.toLabel)
      if (!userClickedLocation && hasInput) {
        return this.createError({
          message: 'Veuillez sélectionner une ville de destination dans la liste proposée',
        })
      }
      if (!value) {
        return this.createError({
          message: 'Requise',
        })
      }
      return true
    }),
  fromLabel: Yup.string(),
  toLabel: Yup.string(),
  departure: Yup.date().typeError('Date invalide').required('Requise'),
  return: Yup.date()
    .typeError('Date invalide')
    .required('Requise')
    .min(Yup.ref('departure'), 'La date de retour doit être après la date de départ'),
})

type SearchRoundTripFlightsFormProps = {
  onSubmit: (
    values: RoundTripFlightSearchParams,
    actions: FormikHelpers<RoundTripFlightSearchParams>,
  ) => void
  initialValues?: RoundTripFlightSearchParams
  disabled?: boolean
}

export const SearchRoundTripFlightsForm = ({
  onSubmit,
  initialValues,
  disabled,
}: SearchRoundTripFlightsFormProps) => {
  return (
    <Formik
      initialValues={initialValues || DEFAULT_VALUES}
      validationSchema={searchParamsSchema}
      onSubmit={onSubmit}
      enableReinitialize>
      {({ values, setFieldValue, touched, errors }) => (
        <Form data-testid="searchRoundTripFlightsForm">
          <Stack direction="row" width="100%" gap={1}>
            <Stack gap={1} direction="row" flexGrow={1}>
              <Stack width="50%" gap={1} direction="row">
                <DepartureAndDestinationField sx={{ width: '100%' }} />
              </Stack>
              <Box width="25%">
                <DateRangePicker
                  sx={{ width: '100%' }}
                  slots={{ field: SingleInputDateRangeField, textField: CustomTextField }}
                  data-testid="datesField"
                  label="Dates"
                  defaultValue={[dayjs(values.departure), dayjs(values.return)]}
                  slotProps={{
                    textField: {
                      helperText:
                        (touched.departure && errors.departure) ||
                        (touched.return && errors.return),
                    },
                    popper: {
                      modifiers: [{ name: 'offset', options: { offset: [0, 10] } }],
                    },
                  }}
                  minDate={dayjs()}
                  onChange={(value) => {
                    setFieldValue('departure', value[0]?.format('YYYY-MM-DD'), true)
                    setFieldValue('return', value[1]?.format('YYYY-MM-DD'), true)
                  }}
                />
              </Box>
              <Box width="25%">
                <PassengersField sx={{ width: '100%' }} />
              </Box>
            </Stack>
            <Button
              type="submit"
              variant="contained"
              size="large"
              data-testid="searchButton"
              disabled={disabled}>
              Rechercher
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  )
}
