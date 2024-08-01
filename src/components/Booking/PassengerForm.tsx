'use client'

import { PassengerData } from '@/types'
import { Alert, Box, Stack, TextField } from '@mui/material'
import { Formik, Form, FormikHelpers, Field, FormikProps } from 'formik'
import * as Yup from 'yup'
import { PassengerIsPayerField, SalutationField } from '@/components'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

const passengerSchema = Yup.object().shape({
  salutation: Yup.string().required('La salutation est requise'),
  firstName: Yup.string().required('Le prénom est requis'),
  lastName: Yup.string().required('Le nom est requis'),
  dateOfBirth: Yup.string().required('La date de naissance est requise'),
  phoneNumber: Yup.string().required('Le numéro de téléphone est requis'),
  isPayer: Yup.boolean(),
})

type PassengerFormProps = {
  onSubmit: (values: PassengerData, actions: FormikHelpers<PassengerData>) => void
  formRef: (el: FormikProps<PassengerData> | null) => void
  isPayer: boolean
  onPayerChange: (isPayer: boolean) => void
  initialValues: PassengerData
}

export const PassengerForm = ({
  onSubmit,
  formRef,
  isPayer,
  onPayerChange,
  initialValues,
}: PassengerFormProps) => {
  return (
    <Box maxWidth="590px">
      <Alert severity="info">
        Les noms des voyageurs doivent être identiques à ceux indiqués sur les pièces d'identité
      </Alert>
      <Formik
        innerRef={formRef}
        initialValues={
          initialValues || {
            salutation: null,
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            phoneNumber: '',
            isPayer: isPayer,
          }
        }
        validationSchema={passengerSchema}
        onSubmit={onSubmit}
        enableReinitialize={false}>
        {({ errors, touched, setFieldValue }) => (
          <Form>
            <Stack direction="row" pt={0.5} pl={1} pb={0.5}>
              <SalutationField name="salutation" />
            </Stack>
            <Stack gap={1}>
              <Field
                as={TextField}
                name="firstName"
                label="Prénom"
                variant="filled"
                error={touched.firstName && errors.firstName}
                helperText={touched.firstName && errors.firstName}
              />
              <Field
                as={TextField}
                name="lastName"
                label="Nom"
                variant="filled"
                error={touched.lastName && errors.lastName}
                helperText={touched.lastName && errors.lastName}
              />
              <DatePicker
                slotProps={{
                  textField: {
                    variant: 'filled',
                    error: !!(touched.dateOfBirth && errors.dateOfBirth),
                    helperText: touched.dateOfBirth && errors.dateOfBirth,
                  },
                }}
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
              />
              <PassengerIsPayerField
                name="isPayer"
                checked={isPayer}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const newValue = e.target.checked
                  onPayerChange(newValue)
                }}
              />
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  )
}
