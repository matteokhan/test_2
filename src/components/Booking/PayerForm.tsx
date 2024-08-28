'use client'

import { PayerData } from '@/types'
import { Box, Stack, TextField, Typography } from '@mui/material'
import { Formik, Form, FormikHelpers, Field, FormikProps } from 'formik'
import * as Yup from 'yup'
import { CreateAccountOptInField, SalutationField } from '@/components'
import { MutableRefObject, ReactNode } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'

const payerSchema = Yup.object().shape({
  salutation: Yup.string().required('La salutation est requise'),
  firstName: Yup.string().required('Le prénom est requis'),
  lastName: Yup.string().required('Le nom est requis'),
  dateOfBirth: Yup.string().required('La date de naissance est requise'),
  phoneNumber: Yup.string().required('Le numéro de téléphone est requis'),
  email: Yup.string().email('E-mail invalide').required("L'e-mail est requis"),
  address: Yup.string().required('L’adresse est requise'),
  postalCode: Yup.string().required('Le code postal est requis'),
  city: Yup.string().required('La ville est requise'),
  country: Yup.string().required('Le pays est requis'),
  createAccountOptIn: Yup.boolean(),
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
            dateOfBirth: dayjs(),
            phoneNumber: '',
            email: '',
            address: '',
            postalCode: '',
            city: '',
            country: '',
            createAccountOptIn: false,
          }
        }
        validationSchema={payerSchema}
        onSubmit={onSubmit}
        enableReinitialize={false}>
        {({ errors, touched, setFieldValue, values }) => (
          <Form data-testid="payerForm">
            <Stack direction="row" pt={0.5} pl={1} pb={0.5}>
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
              <Field
                as={TextField}
                name="phoneNumber"
                label="Téléphone"
                variant="filled"
                error={touched.phoneNumber && errors.phoneNumber}
                helperText={touched.phoneNumber && errors.phoneNumber}
                inputProps={{
                  'data-testid': 'phoneNumberField',
                }}
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
              <Field
                as={TextField}
                name="country"
                label="Pays"
                variant="filled"
                error={touched.country && errors.country}
                helperText={touched.country && errors.country}
                inputProps={{
                  'data-testid': 'countryField',
                }}
              />
              <CreateAccountOptInField name="createAccountOptIn" />
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  )
}
