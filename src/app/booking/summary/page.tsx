'use client'

import {
  BookingStepActions,
  Itinerary,
  PassengersSummary,
  PayerSummary,
  SimpleContainer,
} from '@/components'
import { useBooking } from '@/contexts'

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
    </>
  )
}
