'use client'

import React, { useState } from 'react'
import {
  BookingStepActions,
  InsuranceSummary,
  Itinerary,
  PassengersSummary,
  PayerSummary,
  SimpleContainer,
  SelectPaymentMethod,
  NoPaymentMethodConfirmationModal,
} from '@/components'
import { useBooking } from '@/contexts'
import { useReservationPaymentInfo, useUpdateReservation } from '@/services'
import { AgencyContractCode, ReservationDto } from '@/types'
import { Modal } from '@mui/material'

export default function BookingSummaryPage() {
  const [paymentMethodCode, setPaymentMethodCode] = useState<AgencyContractCode | null>(null)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const { goPreviousStep, goToStep, correlationId, reservation, selectedAgency } = useBooking()
  const { mutate: confirmReservation, isPending: isConfirming } = useReservationPaymentInfo()
  const { mutate: updateReservation, isPending: isUpdatingReservation } = useUpdateReservation()

  const handleSubmit = async () => {
    if (!reservation || !correlationId || !selectedAgency) {
      // TODO: log this somewhere
      // TODO: Warn the user that something went wrong
      return
    }
    if (!paymentMethodCode) {
      setModalIsOpen(true)
      return
    }

    const newReservation: ReservationDto = {
      ...reservation,
      agency: 9755, // TODO: remove this after the demo
      agency_contract: paymentMethodCode,
    }
    updateReservation(newReservation, {
      onSuccess: (data) => {
        confirmReservation(data.id, {
          onSuccess: (data) => {
            if (data.ticket?.is_reserved === false) {
              // TODO: log this somewhere
              // TODO: Warn the user that something went wrong
              return
            }
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
      <SimpleContainer title="Payer avec" sx={{ pb: 3 }}>
        <SelectPaymentMethod onSelect={(contractCode) => setPaymentMethodCode(contractCode)} />
      </SimpleContainer>
      <Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
        <NoPaymentMethodConfirmationModal onChoosePaymentMethod={() => setModalIsOpen(false)} />
      </Modal>
      <BookingStepActions
        onContinue={handleSubmit}
        onGoBack={goPreviousStep}
        isLoading={isConfirming || isUpdatingReservation}
      />
    </>
  )
}
