'use client'

import {
  BookingStepActions,
  InsuranceSummary,
  Itinerary,
  PassengersSummary,
  PayerSummary,
  SimpleContainer,
} from '@/components'
import { useBooking } from '@/contexts'
import { useReservationPaymentInfo } from '@/services'

export default function BookingSummaryPage() {
  const { goPreviousStep, goToStep, correlationId, reservation } = useBooking()
  const { mutate: confirmReservation, isPending: isConfirming } = useReservationPaymentInfo()

  const handleSubmit = async () => {
    if (!reservation || !correlationId) {
      // TODO: log this somewhere
      // TODO: Warn the user that something went wrong
      return
    }
    confirmReservation(reservation.id, {
      onSuccess: (data) => {
        if (!data.payment_redirect_url) {
          // TODO: log this somewhere
          // TODO: Warn the user that something went wrong
          return
        }
        window.location.replace(data.payment_redirect_url)
      },
      onError: (error) => {
        // TODO: log this somewhere
        // TODO: Warn the user that something went wrong
      },
    })
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
        onAction={() => goToStep('passengers')}>
        <PassengersSummary />
      </SimpleContainer>
      <SimpleContainer
        title="Coordonnées de facturation"
        sx={{ pb: 3 }}
        action="Modifier"
        onAction={() => goToStep('contact')}>
        <PayerSummary />
      </SimpleContainer>
      <SimpleContainer
        title="Assurances"
        sx={{ pb: 3 }}
        action="Modifier"
        onAction={() => goToStep('insurances')}>
        <InsuranceSummary />
      </SimpleContainer>
      <BookingStepActions
        onContinue={handleSubmit}
        onGoBack={goPreviousStep}
        isLoading={isConfirming}
      />
    </>
  )
}
