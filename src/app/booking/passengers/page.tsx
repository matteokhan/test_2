'use client'

import React, { useRef } from 'react'
import { BookingStepActions, PassengerInfo, PurchaseDetails } from '@/components'
import { Box, Stack, Typography } from '@mui/material'
import { useBooking } from '@/contexts'
import { PassengerData } from '@/types'
import { FormikProps } from 'formik'

export default function PassengersPage() {
  const { passengers, setPassengers, payerIndex, setPayerIndex, goNextStep, goPreviousStep } =
    useBooking()
  const formRefs = useRef<(FormikProps<PassengerData> | null)[]>([])

  const handleSubmit = async () => {
    let allFormsValid = true
    let formErrors: { [key: number]: any } = {}

    // At least one payer must be selected
    if (payerIndex === null) {
      return
    }

    for (let i = 0; i < formRefs.current.length; i++) {
      const formRef = formRefs.current[i]
      if (formRef) {
        try {
          const errors = await formRef.validateForm()
          if (Object.keys(errors).length > 0) {
            allFormsValid = false
            formErrors[i] = errors
            formRef.setTouched(
              Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
            )
          }
        } catch (error) {
          allFormsValid = false
        }
      }
    }

    if (allFormsValid) {
      // Try to submit all forms
      formRefs.current.forEach((formRef, index) => {
        if (formRef) {
          try {
            formRef.handleSubmit()
          } catch (error) {}
        }
      })
      setPassengers((prev) =>
        prev.map((passenger, index) => ({
          ...passenger,
          isPayer: index === payerIndex,
        })),
      )
      goNextStep()
    }
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
      if (payerIndex !== index) {
        setPassengers((prev) =>
          prev.map((passenger, i) => ({
            ...passenger,
            isPayer: i === payerIndex,
          })),
        )
      }
    }
  }

  return (
    <>
      <Typography variant="headlineMd" py={3}>
        Qui sont les passagers ?
      </Typography>
      <Stack direction="row" gap={2}>
        <Box flexGrow="1">
          {passengers.map((passenger, index) => (
            <PassengerInfo
              key={index}
              formRef={(el) => (formRefs.current[index] = el)}
              onSubmit={(values) => handlePassengerSubmit(values, index)}
              passengerNumber={index + 1}
              isPayer={index === payerIndex}
              onPayerChange={(isPayer) => handlePayerChange(index, isPayer)}
              initialValues={passenger}
            />
          ))}
          <BookingStepActions onContinue={handleSubmit} onGoBack={goPreviousStep} />
        </Box>
        <Box>
          <PurchaseDetails />
        </Box>
      </Stack>
    </>
  )
}
