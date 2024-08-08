'use client'

import { useRef } from 'react'
import { BookingStepActions, PayerForm, PurchaseDetails, SimpleContainer } from '@/components'
import { useBooking } from '@/contexts'
import { Box, Stack, Typography } from '@mui/material'
import { FormikProps } from 'formik'
import { PayerData } from '@/types'

export default function ContactInfoPage() {
  const formRef = useRef<FormikProps<PayerData> | null>(null)
  const { goNextStep, setPayer, passengers, payerIndex, goPreviousStep } = useBooking()

  const handleSubmit = async () => {
    if (formRef.current) {
      const errors = await formRef.current.validateForm()
      if (Object.keys(errors).length === 0) {
        formRef.current.handleSubmit()
        goNextStep()
      } else {
        formRef.current.setTouched(
          Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
        )
      }
    } else {
      // TODO: log this somewhere
    }
  }

  const handlePayerSubmit = (values: PayerData) => {
    setPayer(values)
  }

  return (
    <>
      <Typography variant="headlineMd" py={3}>
        Informations et création de votre dossier
      </Typography>
      <Stack direction="row" gap={2}>
        <Box flexGrow="1">
          <SimpleContainer title="Coordonnées">
            <PayerForm
              formRef={formRef}
              onSubmit={handlePayerSubmit}
              initialValues={
                payerIndex !== null
                  ? {
                      ...passengers[payerIndex],
                      email: '',
                      address: '',
                      postalCode: '',
                      city: '',
                      country: '',
                      createAccountOptIn: false,
                    }
                  : undefined
              }
            />
          </SimpleContainer>
          <BookingStepActions onContinue={handleSubmit} onGoBack={goPreviousStep} />
        </Box>
        <Box>
          <PurchaseDetails />
        </Box>
      </Stack>
    </>
  )
}
