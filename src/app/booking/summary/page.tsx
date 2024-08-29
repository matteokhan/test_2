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
import { useConfirmReservation } from '@/services'

export default function BookingSummaryPage() {
  const { goPreviousStep, goToStep, reservationId, correlationId, pnr, setPnr } = useBooking()
  const { mutate: confirmReservation, isPending: isConfirming } = useConfirmReservation()
  const [errorMessageApi, setErrorMessageApi] = useState('')

  const handleSubmit = async () => {
    if (reservationId && correlationId) {
      confirmReservation(
        { reservationId, correlationId },
        {
          onSuccess: (data) => {
            if (
              data.ReservationItems?.length > 0 &&
              data.ReservationItems[0].AirlinePassengerNameRecord
            ) {
              const passengerNameRecord = data.ReservationItems[0].AirlinePassengerNameRecord
              setPnr(passengerNameRecord)
            } else {
              // TODO: log this somewhere
              // TODO: Warn the user that something went wrong
              if (data.ReservationItems?.length > 0 && data.ReservationItems[0].ErrorMessage) {
                setErrorMessageApi(
                  'Erreur lors de la confirmation de la réservation : ' +
                    data.ReservationItems[0].ErrorMessage,
                )
              } else {
                setErrorMessageApi('Erreur lors de la confirmation de la réservation')
              }
            }
          },
          onError: (error) => {
            setErrorMessageApi('Erreur lors de la confirmation de la réservation')
            // TODO: log this somewhere
            // TODO: Warn the user that something went wrong
          },
        },
      )
    } else {
      // TODO: log this somewhere
      // TODO: Warn the user that something went wrong
    }
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
      {isConfirming && <div>Confirmation de la réservation en cours...</div>}
      <BookingStepActions
        onContinue={handleSubmit}
        onGoBack={goPreviousStep}
        isLoading={isConfirming}
      />
    </>
  )
}
