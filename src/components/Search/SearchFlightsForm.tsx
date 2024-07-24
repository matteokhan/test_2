'use client'

import React from 'react'
import * as Yup from 'yup'
import { TextField, Button, Stack, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Form, Formik, FormikHelpers, Field, FieldArray } from 'formik'
import { SearchFlightParams } from '@/types'

const DEFAULT_PARAMS = {
  segments: [
    {
      from: '',
      to: '',
      date: new Date(),
      dateReturn: undefined,
    },
  ],
  adults: 1,
  childrens: 0,
  infant: 0,
  directFlight: false,
  nonStopFlight: false,
} as SearchFlightParams

const searchFlightSegmentSchema = Yup.object().shape({
  from: Yup.string().required('Required'),
  to: Yup.string().required('Required'),
  date: Yup.date().required('Required'),
})

const searchFlightParamsSchema = Yup.object().shape({
  adults: Yup.number().min(1).required('Required'),
  childrens: Yup.number().min(0).required('Required'),
  infant: Yup.number().min(0).required('Required'),
  directFlight: Yup.boolean().required('Required'),
  nonStopFlight: Yup.boolean().required('Required'),
  segments: Yup.array().of(searchFlightSegmentSchema).min(1, 'At least one segment is required'),
})

type SearchFlightFormProps = {
  onSubmit: (values: SearchFlightParams, actions: FormikHelpers<SearchFlightParams>) => void
  multiDestinations?: boolean
  returnFlight?: boolean
}

export const SearchFlightsForm = ({
  onSubmit,
  multiDestinations = false,
  returnFlight = false,
}: SearchFlightFormProps) => {
  return (
    <Formik
      initialValues={DEFAULT_PARAMS}
      validationSchema={searchFlightParamsSchema}
      onSubmit={onSubmit}
      enableReinitialize>
      {({ values, setFieldValue }) => (
        <Form>
          <Stack direction="row" width="100%" gap={1}>
            <FieldArray name="segments">
              {({ remove, push }) => (
                <Stack flexGrow={1} gap={2}>
                  {values.segments.length > 0 &&
                    values.segments.map((_, index) => (
                      <React.Fragment key={index}>
                        <Stack gap={1} direction="row">
                          <Field
                            as={TextField}
                            name={`segments.${index}.from`}
                            label="Vol au départ de"
                            variant="filled"
                            sx={{ flexGrow: 1 }}
                          />
                          <Field
                            as={TextField}
                            name={`segments.${index}.to`}
                            label="Vol à destination de"
                            variant="filled"
                            sx={{ flexGrow: 1 }}
                          />
                          <DatePicker
                            name={`segments.${index}.date`}
                            label="Dates"
                            onChange={(value) =>
                              setFieldValue(`segments.${index}.date`, value, true)
                            }
                          />
                          {returnFlight && (
                            <DatePicker
                              name={`segments.${index}.dateReturn`}
                              label="Dates"
                              onChange={(value) =>
                                setFieldValue(`segments.${index}.dateReturn`, value, true)
                              }
                            />
                          )}
                          {multiDestinations && (
                            <Stack justifyContent="center">
                              <IconButton
                                aria-label="delete"
                                size="small"
                                onClick={() => remove(index)}>
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          )}
                        </Stack>
                      </React.Fragment>
                    ))}
                  {multiDestinations && (
                    <Stack direction="row" alignItems="center">
                      <IconButton
                        type="button"
                        onClick={() => push({ from: '', to: '', date: '' })}>
                        <AddCircleOutlineIcon />
                      </IconButton>
                      <Typography>Ajouter un vol</Typography>
                    </Stack>
                  )}
                </Stack>
              )}
            </FieldArray>
            <Field name="adults" as={TextField} label="Voyageurs" variant="filled" />
            <Button type="submit" variant="contained" size="large">
              Rechercher
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  )
}
