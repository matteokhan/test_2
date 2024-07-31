'use client'

import { BookingStepActions, Itinerary, PurchaseDetails, SimpleContainer } from '@/components'
import { Box, Stack, Typography } from '@mui/material'

export default function BookingSummaryPage() {
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

  const onGoBack = () => {
    // TODO: Go to preovious step.
    // router.back()
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
          <BookingStepActions onContinue={handleSubmit} onGoBack={onGoBack} />
        </Box>
        <Box>
          <PurchaseDetails />
        </Box>
      </Stack>
    </>
  )
}
