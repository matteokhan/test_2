'use client'

import React, { useEffect, useState } from 'react'
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
  FormalitiesModal,
  PreparePaymentErrorModal,
} from '@/components'
import { useAgencySelector, useBooking, useFlights } from '@/contexts'
import {
  useFormalities,
  useLocationData,
  usePrepareLccOrderPayment,
  usePrepareOrderPayment,
  useUpdateOrder,
} from '@/services'
import { AgencyContractCode, GDSType, UpdateOrderParams } from '@/types'
import { Alert, Box, Modal, Typography } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import WarningIcon from '@mui/icons-material/Warning'
import useMetadata from '@/contexts/useMetadata'

const FRANCE_CODE = 'FR'

export default function BookingSummaryPage() {
  useMetadata('Résumé et paiement')
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const paymentWasFailed = searchParams.get('status') === 'failed'
  const errorAlertRef = React.useRef<HTMLDivElement>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [paymentMethodCode, setPaymentMethodCode] = useState<AgencyContractCode | null>(null)
  const [conditionsAccepted, setConditionsAccepted] = useState(false)
  const [noMethodSelectedModalIsOpen, setNoMethodSelectedModalIsOpen] = useState(false)
  const [acceptConditionsModalIsOpen, setAcceptConditionsModalIsOpen] = useState(false)
  const [formalitiesModalIsOpen, setFormalitiesModalIsOpen] = useState(false)
  const [childrenFormalitiesModalIsOpen, setChildrenFormalitiesModalIsOpen] = useState(false)
  const [paymentErrorModalIsOpen, setPaymentErrorModalIsOpen] = useState(false)
  const {
    goPreviousStep,
    goToStep,
    order,
    saveBookingState,
    loadBookingState,
    selectedFare,
    isBookingActive,
    passengers,
  } = useBooking()
  const { mutate: prepareOrderPayment, isPending: isPreparingPayment } = usePrepareOrderPayment()
  const { mutate: prepareLccOrderPayment, isPending: isPreparingLccPayment } =
    usePrepareLccOrderPayment()
  const { mutate: updateOrder, isPending: isUpdatingOrder } = useUpdateOrder()
  const { selectedAgency } = useAgencySelector()
  const { lastSegment, isOneWay } = useFlights()
  const destinationLocation = lastSegment ? (isOneWay ? lastSegment.to : lastSegment?.from) : ''
  const hasChildren =
    passengers.some((p) => p.type === 'CHD') || passengers.some((p) => p.type === 'INF')
  const { data: destinationData } = useLocationData({
    locationCode: destinationLocation,
  })
  const destinationIsFrance = destinationData?.country_code === FRANCE_CODE
  const { data: countryFormalities } = useFormalities({
    countryCode: !destinationIsFrance ? destinationData?.country_code : undefined,
  })
  const { data: areaFormalities } = useFormalities({
    areaCode: countryFormalities
      ? countryFormalities.length > 0
        ? countryFormalities[0].area_code
        : undefined
      : undefined,
  })
  const { data: childrenFormalities } = useFormalities({
    countryCode: hasChildren ? 'CHD' : undefined,
  })
  const formalities = [
    ...(countryFormalities || []),
    ...(areaFormalities?.filter((f) => f.country_code === null) || []),
  ]
  const isLoading = isPreparingPayment || isUpdatingOrder || isPreparingLccPayment || isNavigating
  const isBookingEditable = !paymentWasFailed && isBookingActive

  const goToPayment = (payment_url: string) => {
    setIsNavigating(true)
    window.location.href = payment_url
  }

  const handleSubmit = async () => {
    if (!order || !selectedFare) {
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

    saveBookingState()
    const newOrder: UpdateOrderParams = {
      orderId: order.id,
      agency: selectedAgency?.id,
      agencyContract: paymentMethodCode,
    }
    updateOrder(newOrder, {
      onSuccess: (updatedOrder) => {
        if (selectedFare.gdsType == GDSType.REGULAR) {
          prepareOrderPayment(
            { orderId: updatedOrder.id },
            {
              onSuccess: (data) => {
                if (data.ticket?.is_reserved === false) {
                  // TODO: log this somewhere
                  setPaymentErrorModalIsOpen(true)
                  return
                }
                if (!data.payment_redirect_url) {
                  // TODO: log this somewhere
                  setPaymentErrorModalIsOpen(true)
                  return
                }
                goToPayment(data.payment_redirect_url)
              },
              onError: (error) => {
                // TODO: log this somewhere
                setPaymentErrorModalIsOpen(true)
              },
            },
          )
        } else if (selectedFare.gdsType === GDSType.LOW_COST_CARRIER) {
          prepareLccOrderPayment(
            { orderId: updatedOrder.id, solutionId: selectedFare.id },
            {
              onSuccess: (data) => {
                if (!data.payment_redirect_url) {
                  // TODO: log this somewhere
                  setPaymentErrorModalIsOpen(true)
                  return
                }
                goToPayment(data.payment_redirect_url)
              },
              onError: (error) => {
                // TODO: log this somewhere
                setPaymentErrorModalIsOpen(true)
              },
            },
          )
        }
      },
      onError: (error) => {
        // TODO: log this somewhere
        setPaymentErrorModalIsOpen(true)
      },
    })
  }

  useEffect(() => {
    if (orderId && !isBookingActive) {
      loadBookingState()
    }
  }, [])

  useEffect(() => {
    if (paymentWasFailed && errorAlertRef.current) {
      errorAlertRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [paymentWasFailed])

  return (
    <>
      <SimpleContainer title="Itinéraire">
        <Itinerary />
      </SimpleContainer>
      <SimpleContainer
        title="Passagers"
        sx={{ pb: 3 }}
        disabled={!isBookingEditable}
        action="Modifier"
        onAction={() => goToStep('passengers')}>
        <PassengersSummary />
      </SimpleContainer>
      <SimpleContainer
        title="Coordonnées de facturation"
        sx={{ pb: 3 }}
        disabled={!isBookingEditable}
        action="Modifier"
        onAction={() => goToStep('contact')}>
        <PayerSummary />
      </SimpleContainer>
      <SimpleContainer
        title="Assurances"
        sx={{ pb: 3 }}
        disabled={!isBookingEditable}
        action="Modifier"
        onAction={() => goToStep('insurances')}>
        <InsuranceSummary />
      </SimpleContainer>
      <SimpleContainer title="Payer avec" sx={{ pb: 3 }}>
        {paymentWasFailed && (
          <Alert
            ref={errorAlertRef}
            severity="error"
            sx={{ mt: 3 }}
            icon={<WarningIcon fontSize="inherit" sx={{ color: 'leclerc.red.main' }} />}>
            Votre paiement a été annulé ou rejeté. Vous pouvez choisir un autre moyen de paiement et
            essayer à nouveau.
          </Alert>
        )}
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
            destination={!destinationIsFrance ? destinationData?.country_name : undefined}
            onFormalitiesClick={() => {
              if (formalities.length > 0) {
                setFormalitiesModalIsOpen(true)
              }
            }}
            withChildren={childrenFormalities && childrenFormalities.length > 0}
            onChildrenFormalitiesClick={() => {
              if (childrenFormalities && childrenFormalities.length > 0) {
                setChildrenFormalitiesModalIsOpen(true)
              }
            }}
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
      <Modal open={formalitiesModalIsOpen} onClose={() => setFormalitiesModalIsOpen(false)}>
        <FormalitiesModal
          onClose={() => setFormalitiesModalIsOpen(false)}
          formalities={formalities}
        />
      </Modal>
      {childrenFormalities && childrenFormalities.length > 0 && (
        <Modal
          open={childrenFormalitiesModalIsOpen}
          onClose={() => setChildrenFormalitiesModalIsOpen(false)}>
          <FormalitiesModal
            onClose={() => setChildrenFormalitiesModalIsOpen(false)}
            formalities={childrenFormalities}
          />
        </Modal>
      )}
      <Modal
        open={acceptConditionsModalIsOpen}
        onClose={() => setAcceptConditionsModalIsOpen(false)}>
        <AcceptBookingConditionsModal onClose={() => setAcceptConditionsModalIsOpen(false)} />
      </Modal>
      <Modal open={paymentErrorModalIsOpen} onClose={() => setPaymentErrorModalIsOpen(false)}>
        <PreparePaymentErrorModal onClose={() => setPaymentErrorModalIsOpen(false)} />
      </Modal>
      <BookingStepActions
        onContinue={handleSubmit}
        onGoBack={goPreviousStep}
        isLoading={isLoading}
        goBackDisabled={!isBookingEditable}
      />
    </>
  )
}
