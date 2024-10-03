'use client'

import React, { useRef, useState } from 'react'
import {
  BookingStepActions,
  PayerForm,
  SimpleContainer,
  BookingStepActionsMobile,
} from '@/components'
import { useBooking } from '@/contexts'
import { Box } from '@mui/material'
import { FormikProps } from 'formik'
import { PayerData, UpdateOrderParams } from '@/types'
import { useUpdateOrder, useReserveOrder } from '@/services'

export default function ContactInfoPage() {
  const formRef = useRef<FormikProps<PayerData> | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
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
  } = useBooking()
  const { mutate: updateOrder, isPending: isUpdatingOrder } = useUpdateOrder()
  const { mutate: reserveOrder, isPending: isReservingOrder } = useReserveOrder()
  const isLoading = isUpdatingOrder || isNavigating || isReservingOrder

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
      onSuccess: (data) => {
        setOrder(data)
        reserveOrder(
          { orderId: data.id, solutionId: selectedFare.id },
          {
            onSuccess: (data) => {
              if (data.travel_data?.passenger_name_record) {
                setPnr(data.travel_data.passenger_name_record)
                setIsNavigating(true)
                goNextStep()
              } else {
                // TODO: log this somewhere
                // TODO: Warn the user that something went wrong
              }
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
