'use client'

import { PayerData } from '@/types'
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Formik, Form, FormikHelpers, Field, FormikProps } from 'formik'
import * as Yup from 'yup'
import {
  CountryPhoneField,
  // CreateAccountOptInField,
  SalutationField,
  SubscribeNewsletterOptInField,
} from '@/components'
import { MutableRefObject, ReactNode } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { CountryCallingCode, CountryCode, getCountries } from 'libphonenumber-js'
import { validatePhoneWithCountry } from '@/utils'
import ReactCountryFlag from 'react-country-flag'
import countries from 'i18n-iso-countries'

type CountryData = {
  code: CountryCode
  name: string
}

const countryList: CountryData[] = getCountries()
  .map((country) => ({
    code: country as CountryCode,
    name: countries.getName(country, 'fr') || country,
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

const payerSchema = Yup.object().shape({
  salutation: Yup.string().required('La salutation est requise'),
  firstName: Yup.string().required('Le prénom est requis'),
  lastName: Yup.string().required('Le nom est requis'),
  dateOfBirth: Yup.date()
    .typeError('La date de naissance est invalide')
    .required('La date de naissance est requise')
    .test('is-adult', 'Le payeur doit être âgé de 18 ans ou plus', function (value) {
      return dayjs().diff(dayjs(value), 'year') >= 18
    }),
  phoneNumber: Yup.string()
    .required('Le numéro de téléphone est requis')
    .test('phone-validation', function (value) {
      if (!value && this.parent.type !== 'ADT') {
        return true
      }
      const countryCode = this.parent.phoneCode
      const { isValid, message } = validatePhoneWithCountry(value || '', countryCode)

      if (!isValid && message) {
        return this.createError({ message })
      }

      return true
    }),
  phoneCode: Yup.string().required('Le numéro de téléphone est requis'),
  email: Yup.string().email('E-mail invalide').required("L'e-mail est requis"),
  address: Yup.string().required('L’adresse est requise'),
  postalCode: Yup.string().required('Le code postal est requis'),
  city: Yup.string().required('La ville est requise'),
  country: Yup.string().required('Le pays est requis'),
  createAccountOptIn: Yup.boolean(),
  subscribeNewsletterOptIn: Yup.boolean(),
})

type PayerFormProps = {
  onSubmit: (values: PayerData, actions: FormikHelpers<PayerData>) => void
  formRef: MutableRefObject<FormikProps<PayerData> | null>
  initialValues?: PayerData
}

export const PayerForm = ({ onSubmit, formRef, initialValues }: PayerFormProps) => {
  return (
    <Box maxWidth="590px" pt={2}>
      <Formik
        innerRef={formRef}
        initialValues={
          initialValues || {
            salutation: null,
            firstName: '',
            lastName: '',
            dateOfBirth: null,
            phoneNumber: '',
            phoneCode: '33' as CountryCallingCode,
            email: '',
            address: '',
            postalCode: '',
            city: '',
            country: 'FR',
            createAccountOptIn: false,
            subscribeNewsletterOptIn: true,
          }
        }
        validationSchema={payerSchema}
        onSubmit={onSubmit}
        enableReinitialize={false}>
        {({ errors, touched, setFieldValue, values }) => (
          <Form data-testid="payerForm">
            <Stack direction="row" pt={0.5} pb={0.5}>
              <SalutationField name="salutation" />
            </Stack>
            <Stack gap={1} pb={2}>
              <Field
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
              <Field
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
              <DatePicker
                slotProps={{
                  textField: {
                    variant: 'filled',
                    error: !!(touched.dateOfBirth && errors.dateOfBirth),
                    helperText: touched.dateOfBirth && (errors.dateOfBirth as ReactNode),
                  },
                }}
                value={values.dateOfBirth}
                name="dateOfBirth"
                label="Date de naissance"
                onChange={(value) => setFieldValue('dateOfBirth', value, true)}
              />
              <CountryPhoneField
                data-testid="phoneNumberField"
                name="phoneNumber"
                countryCodeName="phoneCode"
                label="Téléphone"
                variant="filled"
              />
              <Field
                as={TextField}
                name="email"
                label="E-mail"
                variant="filled"
                error={touched.email && errors.email}
                helperText={touched.email && errors.email}
                inputProps={{
                  'data-testid': 'emailField',
                }}
              />
            </Stack>
            <Typography pt={3} pb={2} variant="titleMd">
              Adresse de facturation
            </Typography>
            <Stack gap={1} pb={2}>
              <Field
                as={TextField}
                name="address"
                label="Adresse"
                variant="filled"
                error={touched.address && errors.address}
                helperText={touched.address && errors.address}
                inputProps={{
                  'data-testid': 'addressField',
                }}
              />
              <Field
                as={TextField}
                name="postalCode"
                label="Code postal"
                variant="filled"
                error={touched.postalCode && errors.postalCode}
                helperText={touched.postalCode && errors.postalCode}
                inputProps={{
                  'data-testid': 'postalCodeField',
                }}
              />
              <Field
                as={TextField}
                name="city"
                label="Ville"
                variant="filled"
                error={touched.city && errors.city}
                helperText={touched.city && errors.city}
                inputProps={{
                  'data-testid': 'cityField',
                }}
              />
              <FormControl variant="filled" sx={{ width: '100%' }}>
                <InputLabel>Pays</InputLabel>
                <Select
                  data-testid="countryField"
                  name="country"
                  error={touched.country && Boolean(errors.country)}
                  value={values.country}
                  onChange={(ev) => setFieldValue('country', ev.target.value as CountryCode)}
                  defaultValue="FR">
                  {countryList.map((country) => (
                    <MenuItem value={country.code} key={country.code}>
                      <Stack direction="row" gap={1} alignItems="center">
                        <ReactCountryFlag countryCode={country.code} svg />
                        <p>{country.name}</p>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Disabled until the functionality is created */}
              {/* <CreateAccountOptInField name="createAccountOptIn" /> */}
              <Box pt={2} sx={{ display: { xs: 'block', lg: 'block' } }}>
                <SubscribeNewsletterOptInField name="subscribeNewsletterOptIn" />
              </Box>
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  )
}
