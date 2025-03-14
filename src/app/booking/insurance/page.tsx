'use client'

import React, { useEffect, useState } from 'react'
import {
  BookingStepActions,
  InsuranceOption,
  SimpleContainer,
  NoInsuranceConfirmationModal,
} from '@/components'
import { useBooking } from '@/contexts'
import { Alert, Grid2, Stack, Modal, Button } from '@mui/material'
import { useInsurances, useUpdateOrder } from '@/services'
import { UpdateOrderParams } from '@/types'
import WarningIcon from '@mui/icons-material/Warning'
import useMetadata from '@/contexts/useMetadata'
import { AppError } from '@/utils'

export default function InsurancesPage() {
  useMetadata('Assurances')
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [firstWarning, setFirstWarning] = useState(true)
  const [noInsurance, setNoInsurance] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const { goPreviousStep, goNextStep, selectedInsurance, setSelectedInsurance, setOrder, order } =
    useBooking()
  const { data: insuranceOptions, isSuccess } = useInsurances()
  const { mutate: updateOrder, isPending: isUpdatingOrder } = useUpdateOrder()

  const handleSubmit = () => {
    if (!order) {
      throw new AppError(
        'Something went wrong loading insurances page',
        'Insurances page preconditions not met',
        {
          missingData: {
            order: !order,
          },
        },
      )
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

    const newOrder: UpdateOrderParams = {
      orderId: order.id,
      insurance: selectedInsurance?.id,
    }
    updateOrder(newOrder, {
      onSuccess: (data) => {
        setOrder(data)
        setIsNavigating(true)
        goNextStep()
      },
      onError: (error) => {
        throw new AppError(
          'Something went wrong updating order',
          'Updating order at insurances step failed',
          { serverError: error },
        )
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
            Pour votre confort nous vous recommandons de souscrire une des assurances proposées. Il
            ne sera plus possible de souscrire la garantie annulation après votre réservation.
          </Alert>
          <Grid2 container spacing={2} data-testid="insurancesPage-options">
            {isSuccess &&
              insuranceOptions.map((insurance) => (
                <InsuranceOption
                  key={insurance.id}
                  insurance={insurance}
                  isSelected={selectedInsurance?.id === insurance.id}
                  onSelect={setSelectedInsurance}
                />
              ))}
          </Grid2>
        </Stack>
        <Stack direction="row" width="100%" justifyContent="center">
          <Button
            sx={{
              mt: 3,
              textWrap: { xs: 'unset', lg: 'nowrap' },
              height: { xs: 'auto', lg: '40px' },
            }}
            variant={noInsurance ? 'contained' : 'outlined'}
            onClick={() => {
              noInsurance ? setNoInsurance(false) : setNoInsurance(true)
            }}>
            Je ne souhaite pas souscrire d’assurance pour mon voyage
          </Button>
        </Stack>
      </SimpleContainer>
      <BookingStepActions
        onContinue={handleSubmit}
        onGoBack={goPreviousStep}
        isLoading={isUpdatingOrder || isNavigating}
      />
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
