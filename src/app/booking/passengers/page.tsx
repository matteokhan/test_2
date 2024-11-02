'use client'

import React, { useRef, useState } from 'react'
import {
  BookingStepActions,
  PassengerInfo,
  AtLeastOneAdultPassengerModal,
  AtLeastOneYoungAdultPassengerModal,
} from '@/components'
import { EmailRequirementProvider, useBooking } from '@/contexts'
import { PassengerData, UpdateOrderParams } from '@/types'
import { FormikProps } from 'formik'
import { ageIsAtLeast } from '@/utils'
import { useUpdateOrder } from '@/services'
import { Modal } from '@mui/material'

export default function PassengersPage() {
  const {
    passengers,
    setPassengers,
    payerIndex,
    setPayerIndex,
    goNextStep,
    goPreviousStep,
    order,
    setOrder,
  } = useBooking()
  const formRefs = useRef<(FormikProps<PassengerData> | null)[]>([])
  const [isNavigating, setIsNavigating] = useState(false)
  const [oneAdultModalIsOpen, setOneAdultModalIsOpen] = useState(false)
  const [oneYoungAdultModalIsOpen, setOneYoungAdultModalIsOpen] = useState(false)
  const { mutate: updateOrder, isPending: isUpdatingOrder } = useUpdateOrder()

  const handleSubmit = async () => {
    if (!order) {
      // TODO: log this somewhere
      // TODO: Warn the user that something went wrong
      return
    }

    let formErrors: { [key: number]: any } = {}

    for (let i = 0; i < formRefs.current.length; i++) {
      const formRef = formRefs.current[i]
      if (formRef) {
        const errors = await formRef.validateForm()
        if (Object.keys(errors).length > 0) {
          formErrors[i] = errors
          formRef.setTouched(
            Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
          )
        }
      }
    }
    if (Object.keys(formErrors).length > 0) {
      return
    }

    let atLeastOneYoungAdultPassenger = false
    let atLeastOneAdultPassenger = false
    const passengers: PassengerData[] = []
    formRefs.current.forEach((formRef, index) => {
      if (formRef) {
        const passengerDataValidated = formRef.values
        if (
          passengerDataValidated.dateOfBirth &&
          ageIsAtLeast(passengerDataValidated.dateOfBirth, 16)
        )
          atLeastOneYoungAdultPassenger = true

        if (
          passengerDataValidated.dateOfBirth &&
          ageIsAtLeast(passengerDataValidated.dateOfBirth, 18)
        )
          atLeastOneAdultPassenger = true

        passengers.push(passengerDataValidated)
        handlePassengerSubmit(passengerDataValidated, index)
      }
    })
    if (passengers.length > 1 && !atLeastOneAdultPassenger) {
      setOneAdultModalIsOpen(true)
      return
    }
    if (!atLeastOneYoungAdultPassenger) {
      setOneYoungAdultModalIsOpen(true)
      return
    }

    const newOrder: UpdateOrderParams = {
      orderId: order.id,
      passengers: passengers,
    }
    updateOrder(newOrder, {
      onSuccess: (data) => {
        setOrder(data)
        setIsNavigating(true)
        goNextStep()
      },
      onError: (error) => {
        // TODO: log this somewhere
        // TODO: Warn the user that something went wrong
      },
    })
  }

  const handlePassengerSubmit = (values: PassengerData, index: number) => {
    setPassengers((prev) => {
      const newPassengers = [...prev]
      newPassengers[index] = {
        ...values,
        isPayer: index === payerIndex,
      }
      return newPassengers
    })
  }

  const handlePayerChange = (index: number, isPayer: boolean) => {
    if (isPayer) {
      setPassengers((prev) =>
        prev.map((passenger, i) => ({
          ...passenger,
          isPayer: i === index,
        })),
      )
      setPayerIndex(index)
    } else {
      setPassengers((prev) =>
        prev.map((passenger, i) => ({
          ...passenger,
          isPayer: false,
        })),
      )
      setPayerIndex(null)
    }
  }

  return (
    <>
      <EmailRequirementProvider totalPassengers={passengers.length}>
        {passengers.map((passenger, index) => (
          <PassengerInfo
            key={index}
            formRef={(el) => (formRefs.current[index] = el)}
            passengerIndex={index}
            isPayer={index === payerIndex}
            onPayerChange={(isPayer) => handlePayerChange(index, isPayer)}
            initialValues={passenger}
          />
        ))}
      </EmailRequirementProvider>
      <BookingStepActions
        onContinue={handleSubmit}
        onGoBack={goPreviousStep}
        isLoading={isUpdatingOrder || isNavigating}
      />

      <Modal open={oneAdultModalIsOpen} onClose={() => setOneAdultModalIsOpen(false)}>
        <AtLeastOneAdultPassengerModal onClose={() => setOneAdultModalIsOpen(false)} />
      </Modal>
      <Modal open={oneYoungAdultModalIsOpen} onClose={() => setOneYoungAdultModalIsOpen(false)}>
        <AtLeastOneYoungAdultPassengerModal onClose={() => setOneYoungAdultModalIsOpen(false)} />
      </Modal>
    </>
  )
}
