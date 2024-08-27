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
import { useState } from 'react'

export default function BookingSummaryPage() {
  const { goPreviousStep, goToStep, reservationId, pnr, setConfirmReservation, errorMessageApi } =
    useBooking()
  const [loading, setLoading] = useState(false)
  const handleSubmit = async () => {
    setLoading(true)
    await setConfirmReservation()
    setLoading(false)
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
      <SimpleContainer
        title="Assurances"
        sx={{ pb: 3 }}
        action="Modifier"
        onAction={() => goToStep(3)}>
        <InsuranceSummary />
      </SimpleContainer>
      {pnr && <div>Réservation confirmé, numéro de PNR : {pnr}</div>}
      {errorMessageApi && <div>{errorMessageApi}</div>}
      {loading && <div>Confirmation de la réservation en cours...</div>}
      <BookingStepActions onContinue={handleSubmit} onGoBack={goPreviousStep} />
    </>
  )
}
