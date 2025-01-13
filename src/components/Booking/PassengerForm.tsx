'use client'

import React, { useEffect } from 'react'
import { PassengerData, PassengerType } from '@/types'
import { Alert, Box, Stack, TextField } from '@mui/material'
import { Formik, Form, FormikHelpers, Field, FormikProps, useFormikContext } from 'formik'
import * as Yup from 'yup'
import { CountryPhoneField, PassengerIsPayerField, SalutationField } from '@/components'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { ReactNode } from 'react'
import WarningIcon from '@mui/icons-material/Warning'
import { useBooking, useEmailRequirement } from '@/contexts'
import { validatePhoneWithCountry } from '@/utils'

// When atLeastOneEmail changes, it resets all the passenger form errors.
// This is necessary because the form errors are not reset when the email condition is
// fullfilled on another passenger form
const FormErrorResetter = () => {
  const { atLeastOneEmail, atLeastOnePhone } = useEmailRequirement()
  const { setErrors, validateForm } = useFormikContext()

  useEffect(() => {
    setErrors({})
    validateForm()
  }, [atLeastOneEmail, setErrors, validateForm, atLeastOnePhone])

  return null
}

const emailSchema = Yup.string().email('E-mail invalide')
const passengerSchema = ({
  type,
  atLeastOneEmail,
  atLeastOnePhone,
  departureDatetime,
  lastDepartureDatetime,
}: {
  type: PassengerType
  atLeastOneEmail: boolean
  atLeastOnePhone: boolean
  departureDatetime: dayjs.Dayjs
  lastDepartureDatetime: dayjs.Dayjs
}) =>
  Yup.object().shape({
    type: Yup.string(),
    salutation: Yup.string().required('La salutation est requise'),
    firstName: Yup.string().required('Le prénom est requis'),
    lastName: Yup.string().required('Le nom est requis'),
    dateOfBirth: Yup.date()
      .typeError('La date de naissance est invalide')
      .required('La date de naissance est requise')
      .test('is-adult', 'Le passager doit être âgé de 12 ans ou plus', function (value) {
        if (type !== 'ADT') return true
        return departureDatetime.diff(dayjs(value), 'year') >= 12
      })
      .test('is-child', "L'âge de l'enfant doit être entre 2 et 11 ans", function (value) {
        if (type !== 'CHD') return true
        const age = departureDatetime.diff(dayjs(value), 'year')
        return age >= 2 && age < 12
      })
      .test(
        'will-be-child',
        'Le passager change de type et de classe tarifaire durant le voyage. Veuillez vous rapprocher de votre Agence E. Leclerc Voyages pour effectuer votre réservation',
        function (value) {
          if (type !== 'CHD') return true
          const age = lastDepartureDatetime.add(3, 'day').diff(dayjs(value), 'year')
          return age >= 2 && age < 12
        },
      )
      .test('is-infant', "L'âge de l'enfant doit être inférieur à 2 ans", function (value) {
        if (type !== 'INF') return true
        const age = departureDatetime.diff(dayjs(value), 'year')
        return age < 2
      })
      .test(
        'will-be-infant',
        'Le passager change de type et de classe tarifaire durant le voyage. Veuillez vous rapprocher de votre Agence E. Leclerc Voyages pour effectuer votre réservation',
        function (value) {
          if (type !== 'INF') return true
          const age = lastDepartureDatetime.add(3, 'day').diff(dayjs(value), 'year')
          return age < 2
        },
      ),
    phoneCode: Yup.string().when('type', {
      is: 'ADT',
      then: (schema) => schema.required('Le numéro de téléphone est requis'),
      otherwise: (schema) => schema.optional(),
    }),
    phoneNumber: Yup.string()
      .when('type', {
        is: (type: PassengerType) => type === 'ADT' && !atLeastOnePhone,
        then: (schema) => schema.required('Le numéro de téléphone est requis'),
        otherwise: (schema) => schema.optional(),
      })
      .transform((value) => value?.replace(/\s/g, ''))
      .test('phone_validation', "Le numéro de téléphone n'est pas valide", function (value) {
        if (!value && this.parent.type !== 'ADT') {
          return true
        }
        const countryCode = this.parent.phoneCode
        const fullNumber = `${countryCode}${value}`.replace(/\s/g, '')
        if (!/^\d+$/.test(fullNumber)) {
          return this.createError({
            message: 'Le numéro de téléphone ne doit contenir que des chiffres',
          })
        }
        if (fullNumber.length < 6) {
          return this.createError({
            message: 'Le numéro de téléphone doit contenir au moins 6 chiffres',
          })
        }
        if (fullNumber.length > 17) {
          return this.createError({
            message: 'Le numéro de téléphone ne doit pas dépasser 17 chiffres',
          })
        }

        return true
      }),
    email: Yup.string()
      .email('E-mail invalide')
      .matches(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/, 'E-mail invalide')
      .when(['type'], {
        is: (type: PassengerType) => type === 'ADT' && !atLeastOneEmail,
        then: (schema) => schema.required("L'e-mail est requis pour au moins un passager adulte"),
        otherwise: (schema) => schema.optional(),
      }),
    isPayer: Yup.boolean(),
  })

type PassengerFormProps = {
  onSubmit: (values: PassengerData, actions: FormikHelpers<PassengerData>) => void
  formRef: (el: FormikProps<PassengerData> | null) => void
  isPayer: boolean
  onPayerChange: (isPayer: boolean) => void
  initialValues: PassengerData
  passengerIndex: number
}

export const PassengerForm = ({
  onSubmit,
  formRef,
  isPayer,
  onPayerChange,
  initialValues,
  passengerIndex,
}: PassengerFormProps) => {
  const {
    isEmailProvided,
    setIsEmailProvided,
    atLeastOneEmail,
    isPhoneProvided,
    setIsPhoneProvided,
    atLeastOnePhone,
  } = useEmailRequirement()
  const { departureDatetime, lastDepartureDatetime } = useBooking()

  if (!departureDatetime || !lastDepartureDatetime) {
    // TODO: log this somewhere
    return
  }

  useEffect(() => {
    if (initialValues.type === 'ADT' && initialValues.email) {
      setIsEmailProvided((prev) => {
        const newIsEmailProvided = [...prev]
        newIsEmailProvided[passengerIndex] = true
        return newIsEmailProvided
      })
    }
    if (initialValues.type === 'ADT' && initialValues.phoneNumber) {
      setIsPhoneProvided((prev) => {
        const newIsPhoneProvided = [...prev]
        newIsPhoneProvided[passengerIndex] = true
        return newIsPhoneProvided
      })
    }
  }, [])

  return (
    <Box pt={2}>
      <Alert severity="info" icon={<WarningIcon fontSize="inherit" />}>
        Les nom/prénom du voyageur doivent correspondre à ceux indiqués sur la pièce d’identité
        utilisée pour voyager.{' '}
        {initialValues.type === 'CHD' &&
          'Un enfant doit être agé de 2 à 11 ans pendant toute la durée du voyage.'}
        {initialValues.type === 'INF' &&
          'Un bébé doit être agé de 2 ans pendant toute la durée du voyage.'}
      </Alert>
      <Formik
        innerRef={formRef}
        initialValues={
          initialValues || {
            salutation: null,
            firstName: '',
            lastName: '',
            dateOfBirth: null,
            phoneNumber: '',
            phoneCode: '33',
            email: '',
            isPayer: isPayer,
            type: '',
          }
        }
        validationSchema={passengerSchema({
          type: initialValues.type,
          atLeastOneEmail: atLeastOneEmail,
          atLeastOnePhone: atLeastOnePhone,
          departureDatetime: departureDatetime,
          lastDepartureDatetime: lastDepartureDatetime,
        })}
        onSubmit={onSubmit}
        enableReinitialize={false}>
        {({ errors, touched, setFieldValue, values }) => (
          <Form data-testid="passengerForm">
            <FormErrorResetter />
            <Stack direction="row" pt={0.5} pb={0.5}>
              <SalutationField name="salutation" />
            </Stack>
            <Stack gap={1}>
              <Stack gap={{ xs: 1, lg: 2 }} direction={{ xs: 'column', lg: 'row' }}>
                <Box width={{ xs: '100%', lg: '50%' }}>
                  <Field
                    fullWidth
                    as={TextField}
                    name="firstName"
                    label="Prénom"
                    variant="filled"
                    error={touched.firstName && errors.firstName}
                    helperText={touched.firstName && errors.firstName}
                    inputProps={{
                      'data-testid': 'firstNameField',
                    }}
                  />
                </Box>
                <Box width={{ xs: '100%', lg: '50%' }}>
                  <Field
                    fullWidth
                    as={TextField}
                    name="lastName"
                    label="Nom"
                    variant="filled"
                    error={touched.lastName && errors.lastName}
                    helperText={touched.lastName && errors.lastName}
                    inputProps={{
                      'data-testid': 'lastNameField',
                    }}
                  />
                </Box>
              </Stack>
              <Stack gap={{ xs: 1, lg: 2 }} direction={{ xs: 'column', lg: 'row' }}>
                <Box width={{ xs: '100%', lg: '50%' }}>
                  <DatePicker
                    maxDate={dayjs()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'filled',
                        error: !!(touched.dateOfBirth && errors.dateOfBirth),
                        helperText: touched.dateOfBirth && (errors.dateOfBirth as ReactNode),
                      },
                    }}
                    value={values.dateOfBirth}
                    data-testid="dateOfBirthField"
                    name="dateOfBirth"
                    label="Date de naissance"
                    onChange={(value) => setFieldValue('dateOfBirth', value, true)}
                  />
                </Box>
                <Box width={{ xs: '100%', lg: '50%' }}>
                  {initialValues.type === 'ADT' && (
                    <Field
                      fullWidth
                      as={TextField}
                      name="email"
                      label="E-mail"
                      variant="filled"
                      value={values.email}
                      onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('email', e.target.value)
                        const newIsEmailProvided = [...isEmailProvided]
                        try {
                          if (await emailSchema.validate(e.target.value)) {
                            newIsEmailProvided[passengerIndex] = true
                          } else {
                            newIsEmailProvided[passengerIndex] = false
                          }
                        } catch (e) {
                          newIsEmailProvided[passengerIndex] = false
                        }
                        setIsEmailProvided(newIsEmailProvided)
                      }}
                      error={touched.email && errors.email}
                      helperText={touched.email && errors.email}
                      inputProps={{
                        'data-testid': 'emailField',
                      }}
                    />
                  )}
                </Box>
              </Stack>
              <Stack gap={{ xs: 1, lg: 2 }} direction={{ xs: 'column', lg: 'row' }}>
                <Box width={{ xs: '100%', lg: '50%' }}>
                  {initialValues.type === 'ADT' && (
                    <CountryPhoneField
                      data-testid="phoneNumberField"
                      name="phoneNumber"
                      countryCodeName="phoneCode"
                      label="Téléphone"
                      variant="filled"
                      onPhoneChange={async (values) => {
                        const [countryCode, phoneNumber] = values
                        const newIsPhoneProvided = [...isPhoneProvided]
                        newIsPhoneProvided[passengerIndex] = Boolean(phoneNumber && countryCode)
                        setIsPhoneProvided(newIsPhoneProvided)
                      }}
                    />
                  )}
                </Box>
                <Box width={{ xs: '100%', lg: '50%' }}></Box>
              </Stack>
            </Stack>

            {initialValues.type === 'ADT' && (
              <Stack height={48} mt={{ xs: 0, lg: 1 }} ml={1} justifyContent="center">
                <PassengerIsPayerField
                  name="isPayer"
                  checked={isPayer}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const newValue = e.target.checked
                    onPayerChange(newValue)
                  }}
                />
              </Stack>
            )}
          </Form>
        )}
      </Formik>
    </Box>
  )
}
