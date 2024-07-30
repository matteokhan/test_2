'use client'

import { useRef } from 'react'
import { BookingStepActions, PayerForm, PurchaseDetails, SimpleContainer } from '@/components'
import { useBooking } from '@/contexts'
import { Box, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { FormikProps } from 'formik'
import { PayerData } from '@/types'

export default function ContactInfoPage() {
  const router = useRouter()
  const formRef = useRef<FormikProps<PayerData> | null>(null)
  const { goNextStep, setPayer } = useBooking()

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

  const onGoBack = () => {
    // TODO: Go to preovious step.
    router.back()
  }

  return (
    <>
      <Typography variant="headlineMd" py={3}>
        Informations et création de votre dossier
      </Typography>
      <Stack direction="row" gap={2}>
        <Box flexGrow="1">
          <SimpleContainer title="Coordonnées">
            <PayerForm formRef={formRef} onSubmit={handlePayerSubmit} />
          </SimpleContainer>
          <BookingStepActions onContinue={handleSubmit} onGoBack={onGoBack} />
        </Box>
        <Box>
          <PurchaseDetails />
        </Box>
      </Stack>
    </>
  )
}
