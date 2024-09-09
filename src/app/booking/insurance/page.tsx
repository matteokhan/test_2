'use client'

import React, { useEffect, useState } from 'react'

import {
  BookingStepActions,
  InsuranceOption,
  SimpleContainer,
  NoInsuranceConfirmationModal,
} from '@/components'
import { useBooking } from '@/contexts'
import { Alert, Grid, Stack, Modal, Button } from '@mui/material'
import { useInsurances, useUpdateReservation } from '@/services'
import { ReservationDto } from '@/types'

export default function InsurancesPage() {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [noInsurance, setNoInsurance] = useState(false)
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
    if (!selectedInsurance && !noInsurance) {
      setModalIsOpen(true)
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

  useEffect(() => {
    if (noInsurance) {
      setSelectedInsurance(null)
    }
  }, [noInsurance])

  useEffect(() => {
    if (selectedInsurance) {
      setNoInsurance(false)
    }
  }, [selectedInsurance])

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
        <Stack direction="row" width="100%" justifyContent="center">
          <Button
            sx={{ mt: 3 }}
            variant={noInsurance ? 'contained' : 'outlined'}
            onClick={() => {
              noInsurance ? setNoInsurance(false) : setNoInsurance(true)
            }}>
            Je ne souhaite pas souscrite d’assurance pour mon voyage
          </Button>
        </Stack>
      </SimpleContainer>
      <BookingStepActions
        onContinue={handleSubmit}
        onGoBack={goPreviousStep}
        isLoading={isUpdatingReservation}
      />
      <Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
        <NoInsuranceConfirmationModal
          onChooseInsurance={() => setModalIsOpen(false)}
          onNoInsurance={() => {
            setModalIsOpen(false)
            setNoInsurance(true)
          }}
        />
      </Modal>
    </>
  )
}
