'use client'

import React from 'react'
import { BookingStepActions, InsuranceOption, SimpleContainer } from '@/components'
import { useBooking } from '@/contexts'
import { Alert, Grid, Stack } from '@mui/material'
import { useInsurances, useUpdateReservation } from '@/services'
import { ReservationDto } from '@/types'

export default function InsurancesPage() {
  const {
    goPreviousStep,
    goNextStep,
    selectedInsurance,
    setSelectedInsurance,
    setReservation,
    reservation,
  } = useBooking()
  const { data: insuranceOptions, isSuccess } = useInsurances()
  const { mutate: updateReservation, isPending: isUpdatingReservation } = useUpdateReservation()

  const handleSubmit = () => {
    if (!reservation) {
      // TODO: log this somewhere
      // TODO: Warn the user that something went wrong
      return
    }

    const newReservation: ReservationDto = {
      ...reservation,
      insurance: selectedInsurance?.id || null,
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

  return (
    <>
      <SimpleContainer>
        <Stack gap={2} pt={4}>
          <Alert severity="info">
            Pour votre confort, nous vous recommandons de sélectionner une des assurances proposées.
            Il ne sera plus possible d’y souscrire après votre réservation.
          </Alert>
          <Grid container spacing={2} data-testid="insurancesPage-options">
            {isSuccess &&
              insuranceOptions.map((insurance) => (
                <InsuranceOption
                  key={insurance.id}
                  insurance={insurance}
                  isSelected={selectedInsurance?.id === insurance.id}
                  onSelect={setSelectedInsurance}
                />
              ))}
          </Grid>
        </Stack>
      </SimpleContainer>
      <BookingStepActions
        onContinue={handleSubmit}
        onGoBack={goPreviousStep}
        isLoading={isUpdatingReservation}
      />
    </>
  )
}
