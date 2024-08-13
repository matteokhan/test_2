'use client'

import React from 'react'
import * as Yup from 'yup'
import { Button, Stack, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Form, Formik, FormikHelpers, Field, FieldArray } from 'formik'
import { MultiDestinationsFlightSearchParams } from '@/types'
import { CustomTextField } from '@/components'

const DEFAULT_VALUES = {
  adults: 1,
  childrens: 0,
  infant: 0,
  destinations: [{ from: '', to: '', departure: new Date() }],
  _type: 'multiDestinations',
} as MultiDestinationsFlightSearchParams

const searchFlightSegmentSchema = Yup.object().shape({
  from: Yup.string().required('Required'),
  to: Yup.string().required('Required'),
  departure: Yup.date().required('Required'),
})

const searchParamsSchema = Yup.object().shape({
  adults: Yup.number().min(1).required('Required'),
  childrens: Yup.number().min(0).required('Required'),
  infant: Yup.number().min(0).required('Required'),
  destinations: Yup.array()
    .of(searchFlightSegmentSchema)
    .min(1, 'At least one segment is required'),
})

type SearchMultiDestFlightFormProps = {
  onSubmit: (
    values: MultiDestinationsFlightSearchParams,
    actions: FormikHelpers<MultiDestinationsFlightSearchParams>,
  ) => void
  initialValues?: MultiDestinationsFlightSearchParams
}

export const SearchMultiDestFlightsForm = ({
  onSubmit,
  initialValues,
}: SearchMultiDestFlightFormProps) => {
  return (
    <Formik
      initialValues={initialValues || DEFAULT_VALUES}
      validationSchema={searchParamsSchema}
      onSubmit={onSubmit}
      enableReinitialize>
      {({ values, setFieldValue }) => (
        <Form data-testid="searchFlightsForm">
          <Stack direction="row" width="100%" gap={1}>
            <FieldArray name="destinations">
              {({ remove, push }) => (
                <Stack flexGrow={1} gap={2}>
                  {values.destinations.length > 0 &&
                    values.destinations.map((_, index) => (
                      <React.Fragment key={index}>
                        <Stack gap={1} direction="row">
                          <Field
                            as={CustomTextField}
                            name={`destinations.${index}.from`}
                            label="Vol au départ de"
                            variant="filled"
                            sx={{ flexGrow: 1 }}
                            inputProps={{
                              'data-testid': `fromField-${index}`,
                            }}
                          />
                          <Field
                            as={CustomTextField}
                            name={`destinations.${index}.to`}
                            label="Vol à destination de"
                            variant="filled"
                            sx={{ flexGrow: 1 }}
                            inputProps={{
                              'data-testid': `toField-${index}`,
                            }}
                          />
                          <DatePicker
                            label="Dates"
                            onChange={(value) =>
                              setFieldValue(
                                `destinations.${index}.departure`,
                                value?.toISOString().split('T')[0],
                                true,
                              )
                            }
                          />
                          <Stack justifyContent="center">
                            <IconButton
                              aria-label="delete"
                              size="small"
                              onClick={() => remove(index)}>
                              <CloseIcon fontSize="small" data-testid={null} />
                            </IconButton>
                          </Stack>
                        </Stack>
                      </React.Fragment>
                    ))}
                  <Stack direction="row" alignItems="center">
                    <IconButton type="button" onClick={() => push({ from: '', to: '', date: '' })}>
                      <AddCircleOutlineIcon data-testid={null} />
                    </IconButton>
                    <Typography>Ajouter un vol</Typography>
                  </Stack>
                </Stack>
              )}
            </FieldArray>
            <Field name="adults" as={CustomTextField} label="Voyageurs" variant="filled" />
            <Button type="submit" variant="contained" size="large" data-testid="searchButton">
              Rechercher
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  )
}
