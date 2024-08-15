'use client'

import React from 'react'
import { BookingStepActions, InsuranceOption, SimpleContainer } from '@/components'
import { useBooking } from '@/contexts'
import { Alert, Grid, Stack } from '@mui/material'
import { useInsurances } from '@/services'

export default function InsurancesPage() {
  const { goPreviousStep, goNextStep, selectedInsurance, setSelectedInsurance } = useBooking()
  const { data: insuranceOptions, isSuccess } = useInsurances()
  const handleSubmit = () => {
    goNextStep()
  }

  return (
    <>
      <SimpleContainer>
        <Stack gap={2} pt={4}>
          <Alert severity="info">
            Pour votre confort, nous vous recommandons de sélectionner une des assurances proposées.
            Il ne sera plus possible d’y souscrire après votre réservation.
          </Alert>
          <Grid container spacing={2}>
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
      <BookingStepActions onContinue={handleSubmit} onGoBack={goPreviousStep} />
    </>
  )
}
