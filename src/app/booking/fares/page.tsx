'use client'

import React from 'react'
import { BookingStepActions, FareOption, SimpleContainer } from '@/components'
import { useBooking } from '@/contexts'
import { Stack } from '@mui/material'
import { Fare } from '@/types'
import CheckIcon from '@mui/icons-material/Check'
import PaymentsIcon from '@mui/icons-material/Payments'
import CloseIcon from '@mui/icons-material/Close'

export default function FaresPage() {
  const { goPreviousStep, goNextStep, setSelectedFare, selectedFare } = useBooking()
  const handleSubmit = () => {
    if (!selectedFare) return
    goNextStep()
  }

  // TODO: Fetch fares from API
  const fareOptions: Fare[] = [
    {
      id: '1',
      name: 'Economy saver',
      description:
        'Nous gérons votre enregistrement et l’envoi des cartes d’embarquement par e-mail est automatique',
      price: 125,
      services: [
        { name: '1 bagage à main', icon: <CheckIcon color="primary" /> },
        { name: '1er bagage enregistré payant', icon: <PaymentsIcon /> },
        { name: 'Payable seat selection available', icon: <PaymentsIcon /> },
        { name: 'Pas de remboursement possible', icon: <CloseIcon color="error" /> },
        { name: 'Assistance prioritaire', icon: <CloseIcon color="error" /> },
      ],
    },
    {
      id: '2',
      name: 'Economy flex',
      description:
        'Nous gérons votre enregistrement et l’envoi des cartes d’embarquement par e-mail est automatique',
      price: 125,
      services: [
        { name: '1 bagage à main', icon: <CheckIcon color="primary" /> },
        { name: '1er bagage enregistré payant', icon: <PaymentsIcon /> },
        { name: 'Payable seat selection available', icon: <PaymentsIcon /> },
        { name: 'Pas de remboursement possible', icon: <CloseIcon color="error" /> },
        { name: 'Assistance prioritaire', icon: <CloseIcon color="error" /> },
      ],
    },
  ]

  return (
    <>
      <SimpleContainer>
        <Stack gap={2} pt={4} data-testid="faresPage-options">
          {fareOptions.map((fare) => (
            <FareOption
              key={fare.id}
              fare={fare}
              onSelect={setSelectedFare}
              isSelected={selectedFare?.id === fare.id}
            />
          ))}
        </Stack>
      </SimpleContainer>
      <BookingStepActions onContinue={handleSubmit} onGoBack={goPreviousStep} />
    </>
  )
}
