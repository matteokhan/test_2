'use client'

import {
  BookingStepActions,
  Itinerary,
  PassengersSummary,
  PayerSummary,
  PurchaseDetails,
  SimpleContainer,
} from '@/components'
import { useBooking } from '@/contexts'
import { Box, Stack, Typography } from '@mui/material'

export default function BookingSummaryPage() {
  const { goPreviousStep, goToStep } = useBooking()
  const handleSubmit = async () => {
    // if (formRef.current) {
    //   const errors = await formRef.current.validateForm()
    //   if (Object.keys(errors).length === 0) {
    //     formRef.current.handleSubmit()
    //     goNextStep()
    //   } else {
    //     formRef.current.setTouched(
    //       Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
    //     )
    //   }
    // } else {
    //   // TODO: log this somewhere
    // }
  }

  return (
    <>
      <Typography variant="headlineMd" py={3}>
        Récapitulatif et paiement
      </Typography>
      <Stack direction="row" gap={2}>
        <Box flexGrow="1">
          <SimpleContainer title="Itinéraire">
            <Itinerary />
          </SimpleContainer>
          <SimpleContainer
            title="Passagers"
            sx={{ pb: 3 }}
            action="Modifier"
            onAction={() => goToStep(0)}>
            <PassengersSummary />
          </SimpleContainer>
          <SimpleContainer
            title="Coordonnées de facturation"
            sx={{ pb: 3 }}
            action="Modifier"
            onAction={() => goToStep(1)}>
            <PayerSummary />
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
