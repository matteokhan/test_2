'use client'

import { PassengerData, PassengerType } from '@/types'
import { Alert, Box, Stack, TextField } from '@mui/material'
import { Formik, Form, FormikHelpers, Field, FormikProps } from 'formik'
import * as Yup from 'yup'
import { PassengerIsPayerField, SalutationField } from '@/components'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { ReactNode } from 'react'
import WarningIcon from '@mui/icons-material/Warning'

const passengerSchema = ({ type }: { type: PassengerType }) =>
  Yup.object().shape({
    type: Yup.string(),
    salutation: Yup.string().required('La salutation est requise'),
    firstName: Yup.string().required('Le prénom est requis'),
    lastName: Yup.string().required('Le nom est requis'),
    dateOfBirth: Yup.date()
      .required('La date de naissance est requise')
      .test('is-adult', 'Le passager doit être âgé de 18 ans ou plus', function (value) {
        if (type !== 'ADT') return true
        return dayjs().diff(dayjs(value), 'year') >= 18
      }),
    phoneNumber: Yup.string().when('type', {
      is: 'ADT',
      then: (schema) => schema.required('Le numéro de téléphone est requis'),
      otherwise: (schema) => schema.optional(),
    }),
    email: Yup.string()
      .email('E-mail invalide')
      .when('type', {
        is: 'ADT',
        then: (schema) => schema.required("L'e-mail est requis"),
        otherwise: (schema) => schema.optional(),
      }),
    isPayer: Yup.boolean(),
  })

type PassengerFormMobileProps = {
  onSubmit: (values: PassengerData, actions: FormikHelpers<PassengerData>) => void
  formRef: (el: FormikProps<PassengerData> | null) => void
  isPayer: boolean
  onPayerChange: (isPayer: boolean) => void
  initialValues: PassengerData
}

export const PassengerFormMobile = ({
  onSubmit,
  formRef,
  isPayer,
  onPayerChange,
  initialValues,
}: PassengerFormMobileProps) => {
  return (
    <Box pt={1}>
      <Alert severity="info" icon={<WarningIcon fontSize="inherit" sx={{ color: 'black' }} />}>
        Les noms des voyageurs doivent être identiques à ceux indiqués sur les pièces d'identité
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
            email: '',
            isPayer: isPayer,
            type: '',
          }
        }
        validationSchema={passengerSchema({ type: initialValues.type })}
        onSubmit={onSubmit}
        enableReinitialize={false}>
        {({ errors, touched, setFieldValue, values }) => (
          <Form data-testid="passengerForm">
            <Stack direction="row" pt={0.5} pl={1} pb={0.5}>
              <SalutationField name="salutation" />
            </Stack>
            <Stack gap={1}>
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
              <DatePicker
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

              {initialValues.type === 'ADT' && (
                <Field
                  fullWidth
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
              )}
              {initialValues.type === 'ADT' && (
                <Field
                  fullWidth
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
              )}
            </Stack>

            {initialValues.type === 'ADT' && (
              <Stack height={48} mt={1} ml={1} justifyContent="center">
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
