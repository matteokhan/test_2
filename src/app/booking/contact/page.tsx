'use client'

import React, { useRef, useState } from 'react'
import { BookingStepActions, PayerForm, SimpleContainer, ReservationErrorModal } from '@/components'
import { useBooking } from '@/contexts'
import { Modal } from '@mui/material'
import { FormikProps } from 'formik'
import {
  GDSType,
  PayerData,
  UpdateOrderParams,
  AncillariesQueryResult,
  LCCAncillary,
} from '@/types'
import { useUpdateOrder, useReserveOrder, getAncillaries, getLCCAncillaries } from '@/services'
import { useQueryClient } from '@tanstack/react-query'

export default function ContactInfoPage() {
  const formRef = useRef<FormikProps<PayerData> | null>(null)
  const queryClient = useQueryClient()
  const [isNavigating, setIsNavigating] = useState(false)
  const [reservationErrorModalIsOpen, setReservationErrorModalIsOpen] = useState(false)
  const [isCheckingAncillaries, setIsCheckingAncillaries] = useState(false)
  const {
    goNextStep,
    setPayer,
    passengers,
    payerIndex,
    goPreviousStep,
    payer,
    order,
    setOrder,
    selectedFare,
    setPnr,
    skipStep,
  } = useBooking()
  const { mutate: updateOrder, isPending: isUpdatingOrder } = useUpdateOrder()
  const { mutate: reserveOrder, isPending: isReservingOrder } = useReserveOrder()
  const isLoading = isUpdatingOrder || isNavigating || isReservingOrder || isCheckingAncillaries

  const handleSubmit = async () => {
    if (!formRef.current || !order || !selectedFare) {
      // TODO: log this somewhere
      // TODO: Warn the user that something went wrong
      return
    }

    const errors = await formRef.current.validateForm()
    if (Object.keys(errors).length !== 0) {
      formRef.current.setTouched(
        Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
      )
      return
    }
    const payerDataValidated = formRef.current.values
    setPayer(payerDataValidated)

    const newOrder: UpdateOrderParams = {
      orderId: order.id,
      payer: payerDataValidated,
    }
    updateOrder(newOrder, {
      onSuccess: async (orderRes) => {
        setOrder(orderRes)
        if (selectedFare.gdsType == GDSType.REGULAR) {
          reserveOrder(
            { orderId: order.id, solutionId: selectedFare.id },
            {
              onSuccess: async (reservationData) => {
                if (reservationData.travel_data?.passenger_name_record) {
                  setIsCheckingAncillaries(true)
                  try {
                    await queryClient.fetchQuery<AncillariesQueryResult>({
                      queryKey: ['ancillaries', order.id],
                      queryFn: () => getAncillaries({ orderId: order.id }),
                    })
                  } catch (error) {
                    skipStep('ancillaries')
                  } finally {
                    setIsCheckingAncillaries(false)
                  }
                  setPnr(reservationData.travel_data.passenger_name_record)
                  setIsNavigating(true)
                  goNextStep()
                } else {
                  // TODO: log this somewhere
                  setReservationErrorModalIsOpen(true)
                }
              },
              onError: (error) => {
                // TODO: log this somewhere
                setReservationErrorModalIsOpen(true)
              },
            },
          )
        } else if (selectedFare.gdsType === GDSType.LOW_COST_CARRIER) {
          setIsCheckingAncillaries(true)
          try {
            const lccAncillaries = await queryClient.fetchQuery<LCCAncillary[]>({
              queryKey: ['lcc-ancillaries', order.id, selectedFare.id],
              queryFn: () => getLCCAncillaries({ orderId: order.id, solutionId: selectedFare.id }),
            })
            if (lccAncillaries.filter((a) => Number(a.price) > 0).length === 0) {
              skipStep('ancillaries')
            }
          } catch (error) {
            skipStep('ancillaries')
          } finally {
            setIsCheckingAncillaries(false)
          }
          setIsNavigating(true)
          goNextStep()
        } else {
          // TODO: log this somewhere
          // TODO: warn the user
        }
      },
      onError: (error) => {
        // TODO: log this somewhere
        setReservationErrorModalIsOpen(true)
      },
    })
  }

  return (
    <>
      <SimpleContainer title="Coordonnées">
        <PayerForm
          formRef={formRef}
          onSubmit={() => {}}
          initialValues={
            payer
              ? payer
              : payerIndex !== null
                ? {
                    ...passengers[payerIndex],
                    address: '',
                    postalCode: '',
                    city: '',
                    country: '',
                    createAccountOptIn: false,
                    subscribeNewsletterOptIn: true,
                  }
                : undefined
          }
        />
      </SimpleContainer>
      <BookingStepActions
        onContinue={handleSubmit}
        onGoBack={goPreviousStep}
        isLoading={isLoading}
      />
      <Modal
        open={reservationErrorModalIsOpen}
        onClose={() => setReservationErrorModalIsOpen(false)}>
        <ReservationErrorModal onClose={() => setReservationErrorModalIsOpen(false)} />
      </Modal>
    </>
  )
}
