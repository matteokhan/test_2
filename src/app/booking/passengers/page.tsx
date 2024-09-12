'use client'

import React, { useRef } from 'react'
import { BookingStepActions, PassengerInfo } from '@/components'
import { useBooking } from '@/contexts'
import { PassengerData, ReservationDto, ReservationPassengerDto } from '@/types'
import { FormikProps } from 'formik'
import { getReservationPassengerDto } from '@/utils'
import { useUpdateReservation } from '@/services'

export default function PassengersPage() {
  const {
    passengers,
    setPassengers,
    payerIndex,
    setPayerIndex,
    goNextStep,
    goPreviousStep,
    reservation,
    setReservation,
  } = useBooking()
  const formRefs = useRef<(FormikProps<PassengerData> | null)[]>([])
  const { mutate: updateReservation, isPending: isUpdatingReservation } = useUpdateReservation()

  const handleSubmit = async () => {
    if (!reservation) {
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
          return
        }
      }
    }

    const passengersDto: ReservationPassengerDto[] = []
    formRefs.current.forEach((formRef, index) => {
      if (formRef) {
        const passengerDataValidated = formRef.values
        const passengerDto = getReservationPassengerDto({ passenger: passengerDataValidated })
        passengersDto.push(passengerDto)
        handlePassengerSubmit(passengerDataValidated, index)
      }
    })

    const newReservation: ReservationDto = {
      ...reservation,
      passengers: passengersDto,
    }
    updateReservation(newReservation, {
      onSuccess: (data) => {
        setReservation(data)
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
      {passengers.map((passenger, index) => (
        <PassengerInfo
          key={index}
          formRef={(el) => (formRefs.current[index] = el)}
          passengerNumber={index + 1}
          isPayer={index === payerIndex}
          onPayerChange={(isPayer) => handlePayerChange(index, isPayer)}
          initialValues={passenger}
        />
      ))}
      <BookingStepActions
        onContinue={handleSubmit}
        onGoBack={goPreviousStep}
        isLoading={isUpdatingReservation}
      />
    </>
  )
}
