'use client'

import React, { useRef } from 'react'
import {
  BookingStepsTopbar,
  Header,
  PassengersInfo,
  SectionContainer,
  SelectedFlightInfoTopbar,
} from '@/components'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useFlightsContext, usePassengers } from '@/contexts'
import { BookingStep, PassengerData } from '@/types'
import { FormikProps } from 'formik'
import Link from 'next/link'

export default function BookingPage() {
  const steps: BookingStep[] = [
    { name: 'Passagers et bagages', isActive: true },
    { name: 'Choix des options', isActive: false },
    { name: 'Choix des sièges', isActive: false },
    { name: 'Coordonnées', isActive: false },
    { name: 'Récapitulatif et paiement', isActive: false },
  ]
  const { passengers, setPassengers, payerIndex, setPayerIndex } = usePassengers()
  const formRefs = useRef<(FormikProps<PassengerData> | null)[]>([])

  const handleSubmit = async () => {
    let allFormsValid = true
    let formErrors: { [key: number]: any } = {}

    // At least one payer must be selected
    if (payerIndex === null) {
      console.log('At least one payer must be selected.')
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
          console.error(`Error validating form ${i}:`, error)
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
          } catch (error) {
            console.error(`Error submitting form ${index}:`, error)
          }
        }
      })

      setPassengers((prev) =>
        prev.map((passenger, index) => ({
          ...passenger,
          isPayer: index === payerIndex,
        })),
      )

      // If all forms are valid, navigate to the next step
      console.log('Next step')
    } else {
      console.log('Form errors:', formErrors)
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

  React.useEffect(() => {
    // First passenger is the payer by default
    setPassengers([
      {
        salutation: null,
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        phoneNumber: '',
        isPayer: true,
      },
      {
        salutation: null,
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        phoneNumber: '',
        isPayer: false,
      },
    ])
    setPayerIndex(0)
  }, [])

  return (
    <>
      <Header />
      <SelectedFlightInfoTopbar />
      <Box sx={{ backgroundColor: 'grey.200' }}>
        <SectionContainer
          sx={{ justifyContent: 'space-between', paddingY: 3, flexDirection: 'column' }}>
          <BookingStepsTopbar steps={steps} />
          <Typography variant="headlineMd" py={3}>
            Qui sont les passagers ?
          </Typography>
          <Stack direction="row" gap={2}>
            <Box flexGrow="1">
              {passengers.map((passenger, index) => (
                <PassengersInfo
                  key={index}
                  formRef={(el) => (formRefs.current[index] = el)}
                  onSubmit={(values) => handlePassengerSubmit(values, index)}
                  passengerNumber={index + 1}
                  isPayer={index === payerIndex}
                  onPayerChange={(isPayer) => handlePayerChange(index, isPayer)}
                  initialValues={passenger}
                />
              ))}
              <Stack pt={2} px={4} pb={11} direction="row" justifyContent="flex-end" gap={1}>
                <Link href="flights" style={{ textDecoration: 'none' }}>
                  <Button variant="text" size="large">
                    Précédent
                  </Button>
                </Link>
                <Button onClick={handleSubmit} variant="contained" size="large">
                  Continuer
                </Button>
              </Stack>
            </Box>
            <Box>Dos</Box>
          </Stack>
        </SectionContainer>
      </Box>
    </>
  )
}
