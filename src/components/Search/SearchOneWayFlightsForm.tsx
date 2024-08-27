'use client'

import React from 'react'
import * as Yup from 'yup'
import { Box, Button, Stack } from '@mui/material'
import { Form, Formik, FormikHelpers, Field } from 'formik'
import { OneWayFlightSearchParams } from '@/types'
import { DatePicker, CustomTextField, PassengersField } from '@/components'
import dayjs from 'dayjs'

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
  adults: Yup.number().min(1).required('Required'),
  childrens: Yup.number().min(0).required('Required'),
  infant: Yup.number().min(0).required('Required'),
  from: Yup.string().required('Required'),
  to: Yup.string().required('Required'),
  departure: Yup.date().typeError('Invalid date').required('Required'),
})

type SearchOneWayFlightsFormProps = {
  onSubmit: (
    values: OneWayFlightSearchParams,
    actions: FormikHelpers<OneWayFlightSearchParams>,
  ) => void
  initialValues?: OneWayFlightSearchParams
}

export const SearchOneWayFlightsForm = ({
  onSubmit,
  initialValues,
}: SearchOneWayFlightsFormProps) => {
  return (
    <Formik
      initialValues={initialValues || DEFAULT_VALUES}
      validationSchema={searchParamsSchema}
      onSubmit={onSubmit}
      enableReinitialize>
      {({ values, setFieldValue, touched, errors }) => (
        <Form data-testid="searchOneWayFlightsForm">
          <Stack direction="row" width="100%" gap={1}>
            <Stack gap={1} direction="row" flexGrow={1}>
              <Stack width="50%" gap={1} direction="row">
                <Field
                  width="50%"
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
                  width="50%"
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
              </Stack>
              <Box width="25%">
                <DatePicker
                  sx={{ width: '100%' }}
                  slots={{ textField: CustomTextField }}
                  data-testid="departureField"
                  label="Dates"
                  value={dayjs(values.departure)}
                  slotProps={{
                    textField: { helperText: touched.departure && errors.departure },
                    popper: {
                      modifiers: [{ name: 'offset', options: { offset: [0, 10] } }],
                    },
                  }}
                  minDate={dayjs()}
                  onChange={(value) => {
                    setFieldValue('departure', value?.format('YYYY-MM-DD'), true)
                  }}
                />
              </Box>
              <Box width="25%">
                <PassengersField sx={{ width: '100%' }} />
              </Box>
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
