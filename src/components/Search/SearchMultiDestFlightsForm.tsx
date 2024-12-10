'use client'

import React from 'react'
import * as Yup from 'yup'
import { Button, Stack, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { Form, Formik, FormikHelpers, Field, FieldArray } from 'formik'
import { MultiDestinationsFlightSearchParams, SearchFlightSegmentType } from '@/types'
import { DatePicker, CustomTextField, PassengersField } from '@/components'
import dayjs from 'dayjs'

const DEFAULT_VALUES: MultiDestinationsFlightSearchParams = {
  adults: 1,
  childrens: 0,
  infants: 0,
  destinations: [
    {
      from: '',
      fromLabel: '',
      fromCountry: '',
      fromInputValue: '',
      fromType: SearchFlightSegmentType.PLACE,
      to: '',
      toCountry: '',
      toInputValue: '',
      toLabel: '',
      toType: SearchFlightSegmentType.PLACE,
      departure: dayjs().add(3, 'day').format('YYYY-MM-DD'),
    },
  ],
  _type: 'multiDestinations',
}

type DestinationErrors = {
  from?: string
  to?: string
  departure?: string
}

type FormErrors = {
  adults?: string
  childrens?: string
  infants?: string
  destinations?: DestinationErrors[]
}

type FormTouched = {
  adults?: boolean
  childrens?: boolean
  infants?: boolean
  destinations?: {
    from?: boolean
    to?: boolean
    departure?: boolean
  }[]
}

const searchFlightSegmentSchema = Yup.object().shape({
  from: Yup.string().required('Requise'),
  to: Yup.string().required('Requise'),
  departure: Yup.date().typeError('Date invalide').required('Requise'),
})

const searchParamsSchema = Yup.object().shape({
  adults: Yup.number().min(1).required('Requise'),
  childrens: Yup.number().min(0).required('Requise'),
  infants: Yup.number().min(0).required('Requise'),
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
      {({ values, setFieldValue, touched, errors }) => (
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
                            error={
                              !!(touched.destinations as FormTouched['destinations'])?.[index]
                                ?.from &&
                              (errors.destinations as FormErrors['destinations'])?.[index]?.from
                            }
                            helperText={
                              (touched.destinations as FormTouched['destinations'])?.[index]
                                ?.from &&
                              (errors.destinations as FormErrors['destinations'])?.[index]?.from
                            }
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
                            error={
                              !!(touched.destinations as FormTouched['destinations'])?.[index]
                                ?.to &&
                              (errors.destinations as FormErrors['destinations'])?.[index]?.to
                            }
                            helperText={
                              (touched.destinations as FormTouched['destinations'])?.[index]?.to &&
                              (errors.destinations as FormErrors['destinations'])?.[index]?.to
                            }
                            inputProps={{
                              'data-testid': `toField-${index}`,
                            }}
                          />
                          <DatePicker
                            slots={{ textField: CustomTextField }}
                            label="Dates"
                            value={dayjs(values.destinations[index].departure)}
                            data-testid={`departureField-${index}`}
                            minDate={dayjs().add(3, 'day')}
                            onChange={(value) =>
                              setFieldValue(
                                `destinations.${index}.departure`,
                                value?.format('YYYY-MM-DD'),
                                true,
                              )
                            }
                            slotProps={{
                              textField: {
                                helperText:
                                  (touched.destinations as FormTouched['destinations'])?.[index]
                                    ?.departure &&
                                  (errors.destinations as FormErrors['destinations'])?.[index]
                                    ?.departure,
                              },
                              popper: {
                                modifiers: [{ name: 'offset', options: { offset: [0, 10] } }],
                              },
                            }}
                          />
                          <Stack justifyContent="flex-start" mt="14px">
                            <IconButton
                              aria-label="delete"
                              size="small"
                              disabled={values.destinations.length === 1}
                              onClick={() => remove(index)}>
                              <CloseIcon fontSize="small" data-testid={null} />
                            </IconButton>
                          </Stack>
                        </Stack>
                      </React.Fragment>
                    ))}
                  <Stack direction="row" alignItems="center">
                    <IconButton
                      type="button"
                      onClick={() =>
                        push({
                          from: '',
                          to: '',
                          departure: dayjs().add(3, 'day').format('YYYY-MM-DD'),
                        })
                      }>
                      <AddCircleOutlineIcon data-testid={null} />
                    </IconButton>
                    <Typography>Ajouter un vol</Typography>
                  </Stack>
                </Stack>
              )}
            </FieldArray>
            <PassengersField />
            <Button type="submit" variant="contained" size="large" data-testid="searchButton">
              Rechercher
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  )
}
