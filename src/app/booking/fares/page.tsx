'use client'

import React, { useEffect } from 'react'
import { BookingStepActions, FareOption, SimpleContainer } from '@/components'
import { useBooking } from '@/contexts'
import { Stack } from '@mui/material'
import { Fare, FareService, Solution } from '@/types'
import CheckIcon from '@mui/icons-material/Check'
import PaymentsIcon from '@mui/icons-material/Payments'
import CloseIcon from '@mui/icons-material/Close'
import { getBrandedFares } from '@/services'
import { BrandedFareRequestDto } from '@/types/brandedFareRequest'
import { Description } from '@mui/icons-material'
import { get } from 'http'
import { BrandedFareResponse } from '@/types/brandedFareResponse'

export default function FaresPage() {
  const {
    goPreviousStep,
    goNextStep,
    setSelectedFare,
    selectedFare,
    selectedFlight,
    passengers,
    correlationId,
  } = useBooking()
  const handleSubmit = () => {
    if (!selectedFare) return
    goNextStep()
  }

  const [loading, setLoading] = React.useState(false)
  const [brandedFares, setBrandedFares] = React.useState<BrandedFareResponse>()
  const [brandLoaded, setBrandLoaded] = React.useState(false)

  // TODO: Fetch fares from API
  useEffect(() => {
    if (!loading && !brandLoaded) {
      setLoading(true)
      fetchBrandedFares()
      // fetchBrandedFares()
      setLoading(false)
    }
  })

  const fetchBrandedFares = async () => {
    setSelectedFare(null)
    if (!correlationId) return
    if (!selectedFlight) return
    const params = {
      correlationId: correlationId,
      ticket: selectedFlight.ticket,
      adults: passengers.filter((passenger) => passenger.type === 'ADT').length,
      childrens: passengers.filter((passenger) => passenger.type === 'CHD').length,
      infants: passengers.filter((passenger) => passenger.type === 'INF').length,
    } as BrandedFareRequestDto
    const result = await getBrandedFares({ params: params })

    setBrandedFares(result)
    setBrandLoaded(true)
  }

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

  const getFaresOptions = () => {
    if (!selectedFlight) return []
    if (!brandedFares) return []
    return brandedFares?.solutions?.map((brandedFare) => {
      const fareOption = getFareOption(brandedFare, selectedFlight.priceInfo.total)
      if (!selectedFare && fareOption.id == selectedFlight.id) {
        setSelectedFare(fareOption)
      }
      return fareOption
    })
  }

  const getFareOption = (fare: Solution, basePrice: number) => {
    const brand = fare.routes[0].segments[0].fare
    const services: FareService[] = brand.options
      .filter((option) => option.indicator !== 'Unknown')
      .map((option) => {
        switch (option.description) {
          case 'CHANGES':
            switch (option.indicator) {
              case 'IncludedInBrand':
                return { name: 'Modification autorisé', icon: <CheckIcon color="primary" /> }
              case 'NotOffered':
                return { name: 'Pas de modification possible', icon: <CloseIcon color="error" /> }
              case 'AvailableForACharge':
                return { name: 'Modification payante', icon: <PaymentsIcon /> }
            }
          case 'REFUND':
            switch (option.indicator) {
              case 'IncludedInBrand':
                return { name: 'Remboursement complet', icon: <CheckIcon color="primary" /> }
              case 'NotOffered':
                return { name: 'Pas de remboursement possible', icon: <CloseIcon color="error" /> }
              case 'AvailableForACharge':
                return { name: 'Remboursable en partie', icon: <PaymentsIcon /> }
            }
          case 'VOID':
            switch (option.indicator) {
              case 'IncludedInBrand':
                return { name: 'Annulation comprise', icon: <CheckIcon color="primary" /> }
              case 'NotOffered':
                return { name: "Pas d'annulation possible", icon: <CloseIcon color="error" /> }
              case 'AvailableForACharge':
                return { name: 'Annulation payante', icon: <PaymentsIcon /> }
            }
          case 'BAGGAGE_CHECKED':
            switch (option.indicator) {
              case 'IncludedInBrand':
                if (brand.baggagePieces) {
                  return {
                    name: `${brand.baggagePieces} bagages enregistrés inclus`,
                    icon: <CheckIcon color="primary" />,
                  }
                } else {
                  return { name: '1er bagage enregistré payant', icon: <PaymentsIcon /> }
                }
              case 'NotOffered':
                return {
                  name: 'Pas de bagage enregistré inclus',
                  icon: <CloseIcon color="error" />,
                }
              case 'AvailableForACharge':
                return { name: '1er bagage enregistré payant', icon: <PaymentsIcon /> }
            }
        }
        return { name: option.description, icon: <CloseIcon color="error" /> }
      })
    return {
      id: fare.id,
      name: brand.name,
      description:
        'Nous gérons votre enregistrement et l’envoi des cartes d’embarquement par e-mail est automatique',
      price: fare.priceInfo.total - basePrice,
      services: services,
    } as Fare
  }

  return (
    <>
      <SimpleContainer>
        <Stack gap={2} pt={4} data-testid="faresPage-options">
          {getFaresOptions().map((oneFare) => {
            if (oneFare)
              return (
                <FareOption
                  key={oneFare?.id}
                  fare={oneFare}
                  onSelect={setSelectedFare}
                  isSelected={selectedFare?.id === oneFare?.id}
                />
              )
          })}
        </Stack>
      </SimpleContainer>
      <BookingStepActions onContinue={handleSubmit} onGoBack={goPreviousStep} />
    </>
  )
}
