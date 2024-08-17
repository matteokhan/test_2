'use client'

import React from 'react'
import * as Yup from 'yup'
import { Button, Stack } from '@mui/material'
import { DateRangePicker, SingleInputDateRangeField } from '@mui/x-date-pickers-pro'
import { Form, Formik, FormikHelpers, Field } from 'formik'
import { RoundTripFlightSearchParams } from '@/types'
import { CustomTextField } from '@/components'
import dayjs from 'dayjs'

const DEFAULT_VALUES = {
  adults: 1,
  childrens: 0,
  infant: 0,
  from: '',
  to: '',
  departure: dayjs().add(2, 'day').format('YYYY-MM-DD'),
  return: dayjs().add(3, 'day').format('YYYY-MM-DD'),
  _type: 'roundTrip',
} as RoundTripFlightSearchParams

const searchParamsSchema = Yup.object().shape({
  adults: Yup.number().min(1).required('Required'),
  childrens: Yup.number().min(0).required('Required'),
  infant: Yup.number().min(0).required('Required'),
  from: Yup.string().required('Required'),
  to: Yup.string().required('Required'),
  departure: Yup.date().typeError('Invalid date').required('Required'),
  return: Yup.date().typeError('Invalid date').required('Required'),
})

type SearchRoundTripFlightsFormProps = {
  onSubmit: (
    values: RoundTripFlightSearchParams,
    actions: FormikHelpers<RoundTripFlightSearchParams>,
  ) => void
  initialValues?: RoundTripFlightSearchParams
}

export const SearchRoundTripFlightsForm = ({
  onSubmit,
  initialValues,
}: SearchRoundTripFlightsFormProps) => {
  return (
    <Formik
      initialValues={initialValues || DEFAULT_VALUES}
      validationSchema={searchParamsSchema}
      onSubmit={(values, actions) =>
        onSubmit(
          {
            ...values,
            adults: +values.adults,
          },
          actions,
        )
      }
      enableReinitialize>
      {({ values, setFieldValue, touched, errors }) => (
        <Form data-testid="searchRoundTripFlightsForm">
          <Stack direction="row" width="100%" gap={1}>
            <Stack gap={1} direction="row" flexGrow={1}>
              <Field
                as={CustomTextField}
                name="from"
                label="Vol au départ de"
                variant="filled"
                sx={{ flexGrow: 1 }}
                error={touched.from && errors.from}
                helperText={touched.from && errors.from}
                inputProps={{
                  'data-testid': 'fromField',
                }}
              />
              <Field
                as={CustomTextField}
                name="to"
                label="Vol à destination de"
                variant="filled"
                sx={{ flexGrow: 1 }}
                error={touched.to && errors.to}
                helperText={touched.to && errors.to}
                inputProps={{
                  'data-testid': 'toField',
                }}
              />
              <DateRangePicker
                slots={{ field: SingleInputDateRangeField }}
                data-testid="datesField"
                label="Dates"
                value={[dayjs(values.departure), dayjs(values.return)]}
                slotProps={{
                  textField: {
                    helperText:
                      (touched.departure && errors.departure) || (touched.return && errors.return),
                  },
                }}
                onChange={(value) => {
                  setFieldValue('departure', value[0]?.format('YYYY-MM-DD'), true)
                  setFieldValue('return', value[1]?.format('YYYY-MM-DD'), true)
                }}
              />
              <Field name="adults" as={CustomTextField} label="Voyageurs" variant="filled" />
            </Stack>
            <Button type="submit" variant="contained" size="large" data-testid="searchButton">
              Rechercher
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  )
}
