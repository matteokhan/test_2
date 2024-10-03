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
  BookingConditionsCheckbox,
  AcceptBookingConditionsModal,
  BookingStepActionsMobile,
} from '@/components'
import { useAgencySelector, useBooking } from '@/contexts'
import { usePrepareOrderPayment, useUpdateOrder } from '@/services'
import { AgencyContractCode, UpdateOrderParams } from '@/types'
import { Box, Modal, Typography } from '@mui/material'

export default function BookingSummaryPage() {
  const [paymentMethodCode, setPaymentMethodCode] = useState<AgencyContractCode | null>(null)
  const [conditionsAccepted, setConditionsAccepted] = useState(false)
  const [noMethodSelectedModalIsOpen, setNoMethodSelectedModalIsOpen] = useState(false)
  const [acceptConditionsModalIsOpen, setAcceptConditionsModalIsOpen] = useState(false)
  const { goPreviousStep, goToStep, order } = useBooking()
  const { mutate: prepareOrderPayment, isPending: isPreparingPayment } = usePrepareOrderPayment()
  const { mutate: updateOrder, isPending: isUpdatingOrder } = useUpdateOrder()
  const { selectedAgency } = useAgencySelector()
  const isLoading = isPreparingPayment || isUpdatingOrder

  const handleSubmit = async () => {
    if (!order) {
      // TODO: log this somewhere
      // TODO: Warn the user that something went wrong
      return
    }
    if (!paymentMethodCode) {
      setNoMethodSelectedModalIsOpen(true)
      return
    }
    if (!conditionsAccepted) {
      setAcceptConditionsModalIsOpen(true)
      return
    }

    const newOrder: UpdateOrderParams = {
      orderId: order.id,
      agency: selectedAgency?.id,
      agencyContract: paymentMethodCode,
    }
    updateOrder(newOrder, {
      onSuccess: (updatedOrder) => {
        prepareOrderPayment(
          { orderId: updatedOrder.id },
          {
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
          },
        )
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
        <Typography variant="bodySm" color="grey.700" pb={1} pr={2}>
          Nous protégeons vos données à l’aide des méthodes de cryptage de paiement les plus
          récentes
        </Typography>
        <Box pt={1} pr={2}>
          <Typography variant="titleSm">Je reconnais avoir pris connaissance et accepte</Typography>
          <BookingConditionsCheckbox
            onChange={(checked) => setConditionsAccepted(checked)}
            checked={conditionsAccepted}
          />
        </Box>
      </SimpleContainer>
      <Modal
        open={noMethodSelectedModalIsOpen}
        onClose={() => setNoMethodSelectedModalIsOpen(false)}>
        <NoPaymentMethodConfirmationModal
          onChoosePaymentMethod={() => setNoMethodSelectedModalIsOpen(false)}
        />
      </Modal>
      <Modal
        open={acceptConditionsModalIsOpen}
        onClose={() => setAcceptConditionsModalIsOpen(false)}>
        <AcceptBookingConditionsModal onClose={() => setAcceptConditionsModalIsOpen(false)} />
      </Modal>
      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        <BookingStepActions
          onContinue={handleSubmit}
          onGoBack={goPreviousStep}
          isLoading={isLoading}
        />
      </Box>
      <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
        <BookingStepActionsMobile
          onContinue={handleSubmit}
          onGoBack={goPreviousStep}
          isLoading={isLoading}
        />
      </Box>
    </>
  )
}
