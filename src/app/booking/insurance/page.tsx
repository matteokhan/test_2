'use client'

import React, { useEffect, useState } from 'react'
import {
  BookingStepActions,
  InsuranceOption,
  SimpleContainer,
  NoInsuranceConfirmationModal,
  BookingStepActionsMobile,
} from '@/components'
import { useBooking } from '@/contexts'
import { Alert, Grid, Stack, Modal, Button, Box } from '@mui/material'
import { useInsurances, useUpdateReservation } from '@/services'
import { ReservationDto } from '@/types'
import WarningIcon from '@mui/icons-material/Warning'

export default function InsurancesPage() {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [firstWarning, setFirstWarning] = useState(true)
  const [noInsurance, setNoInsurance] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
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
      setFirstWarning(false)
      setModalIsOpen(true)
      return
    }
    if (noInsurance && firstWarning) {
      setFirstWarning(false)
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
        setIsNavigating(true)
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
        <Stack gap={2} sx={{ pt: { xs: 3, lg: 4 } }}>
          <Alert severity="info" icon={<WarningIcon fontSize="inherit" />}>
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
      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        <BookingStepActions
          onContinue={handleSubmit}
          onGoBack={goPreviousStep}
          isLoading={isUpdatingReservation || isNavigating}
        />
      </Box>
      <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
        <BookingStepActionsMobile
          onContinue={handleSubmit}
          onGoBack={goPreviousStep}
          isLoading={isUpdatingReservation || isNavigating}
        />
      </Box>
      <Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
        <NoInsuranceConfirmationModal
          onChooseInsurance={() => setModalIsOpen(false)}
          onNoInsurance={() => {
            setModalIsOpen(false)
            if (noInsurance) {
              handleSubmit()
              return
            }
            setNoInsurance(true)
          }}
        />
      </Modal>
    </>
  )
}
