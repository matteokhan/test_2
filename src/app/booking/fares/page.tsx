'use client'

import React, { use, useEffect } from 'react'
import { BookingStepActions, FareOption, SimpleContainer } from '@/components'
import { useBooking } from '@/contexts'
import { Stack } from '@mui/material'
import { Fare, FareService, Solution } from '@/types'
import CheckIcon from '@mui/icons-material/Check'
import PaymentsIcon from '@mui/icons-material/Payments'
import CloseIcon from '@mui/icons-material/Close'
import { getBrandedFares, useGetBrandedFares } from '@/services'
import { BrandedFareRequestDto } from '@/types/brandedFareRequest'
import { Description, FlightClass, Star, Work } from '@mui/icons-material'
import { get } from 'http'
import { BrandedFareResponse } from '@/types/brandedFareResponse'

export default function FaresPage() {
  const {
    previousStep,
    currentStep,
    goPreviousStep,
    goNextStep,
    setSelectedFare,
    selectedFare,
    selectedFlight,
    setSelectedFlight,
    baseFlight,
    passengers,
    correlationId,
  } = useBooking()

  const handleSubmit = () => {
    if (!selectedFare) return
    const newSelectedFlight = brandedFares?.solutions.find(
      (solution: Solution) => solution.id === selectedFare.id,
    )
    if (newSelectedFlight) {
      setSelectedFlight(newSelectedFlight)
      setSelectedFare(null)
    }
    goNextStep()
  }

  const getBrandedFareParams = () => {
    return {
      correlationId: correlationId,
      ticket: baseFlight?.ticket,
      adults: passengers.filter((passenger) => passenger.type === 'ADT').length,
      childrens: passengers.filter((passenger) => passenger.type === 'CHD').length,
      infants: passengers.filter((passenger) => passenger.type === 'INF').length,
    } as BrandedFareRequestDto
  }

  const { data: brandedFares, isSuccess } = useGetBrandedFares({ params: getBrandedFareParams() })

  const getFaresOptions = () => {
    if (!selectedFlight) return []
    if (!brandedFares) return []
    return brandedFares?.solutions?.map((brandedFare: any) => {
      const fareOption = getFareOption(brandedFare, selectedFlight.priceInfo.total)
      return fareOption
    })
  }

  useEffect(() => {
    if (isSuccess && brandedFares.solutions.length === 0) {
      if (previousStep > currentStep) {
        goPreviousStep()
      } else {
        goNextStep()
      }
    }
    if (selectedFlight && brandedFares) {
      const fareOptions = getFaresOptions()
      const fareOption = fareOptions.find((option: any) => {
        return option.name === selectedFlight.routes[0].segments[0].fare.name
      })
      setSelectedFare(fareOption)
    }
  }, [brandedFares])

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
                  let name = `${brand.baggagePieces} bagages enregistrés inclus`
                  if (brand.baggageWeight) {
                    name = name + ` (${brand.baggageWeight} kg)`
                  }
                  return {
                    name: name,
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
    let bestCabinClass = 1
    fare.routes.forEach((route) => {
      route.segments.forEach((segment) => {
        if (segment.cabinClass > bestCabinClass) {
          bestCabinClass = segment.cabinClass
        }
      })
    })
    switch (bestCabinClass) {
      case 1:
        services.push({ name: 'Voyage en classe Economique', icon: <FlightClass /> })
        break
      case 2:
        services.push({ name: 'Voyage en classe Affaires', icon: <FlightClass /> })
        break
      case 4:
        services.push({ name: 'Voyage en Première classe', icon: <FlightClass /> })
        break
      case 8:
        services.push({ name: 'Voyage en classe Premium', icon: <FlightClass /> })
        break
    }
    return {
      id: fare.id,
      name: brand.name,
      description:
        'Nous gérons votre enregistrement et l’envoi des cartes d’embarquement par e-mail est automatique ' +
        fare.id,
      price: Number((fare.priceInfo.total - basePrice).toFixed(2)),
      services: services,
    } as Fare
  }

  return (
    <>
      <SimpleContainer>
        <Stack gap={2} pt={4} data-testid="faresPage-options">
          {getFaresOptions().map((oneFare: any) => {
            if (oneFare)
              return (
                <FareOption
                  key={oneFare?.id}
                  fare={oneFare}
                  onSelect={setSelectedFare}
                  isSelected={selectedFare?.name === oneFare?.name}
                />
              )
          })}
        </Stack>
      </SimpleContainer>
      <BookingStepActions onContinue={handleSubmit} onGoBack={goPreviousStep} />
    </>
  )
}
