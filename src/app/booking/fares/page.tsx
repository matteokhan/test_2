'use client'

import React, { useEffect } from 'react'
import {
  BookingStepActions,
  BookingStepActionsMobile,
  FareOption,
  SimpleContainer,
} from '@/components'
import { useBooking } from '@/contexts'
import { Box, Stack } from '@mui/material'
import { useBrandedFares } from '@/services'
import { getSearchBrandedFaresDto } from '@/utils'

export default function FaresPage() {
  const {
    previousStep,
    currentStep,
    goPreviousStep,
    goNextStep,
    setSelectedFare,
    selectedFare,
    selectedFlight,
    passengers,
    correlationId,
  } = useBooking()

  if (!selectedFlight || !passengers || !correlationId) {
    // TODO: log this somewhere
    // TODO: Warn the user that something went wrong
    return null
  }

  const searchFaresParams = getSearchBrandedFaresDto({
    correlationId: correlationId,
    solution: selectedFlight,
    passengers: passengers,
  })
  const { data: brandedFares, isSuccess } = useBrandedFares({ params: searchFaresParams })

  useEffect(() => {
    // TODO: Ask for branded fares before rendering this page
    // Then decide if this step should be skipped
    // Try to avoid the use of previousStep variable
    if (isSuccess && brandedFares.length === 0) {
      if (previousStep > currentStep) {
        goPreviousStep()
      } else {
        goNextStep()
      }
    }
    if (!selectedFare && isSuccess && brandedFares.length > 0) {
      setSelectedFare(brandedFares[0])
    }
  }, [brandedFares])

  return (
    <>
      <SimpleContainer>
        <Stack gap={2} pt={4} data-testid="faresPage-options">
          {brandedFares &&
            brandedFares.map((fare) => (
              <FareOption
                key={fare.id}
                basePrice={selectedFlight.priceInfo.total}
                fare={fare}
                onSelect={setSelectedFare}
                isSelected={
                  selectedFare?.routes[0].segments[0].fare.name ===
                  fare?.routes[0].segments[0].fare.name
                }
              />
            ))}
        </Stack>
      </SimpleContainer>
      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        <BookingStepActions onContinue={goNextStep} onGoBack={goPreviousStep} />
      </Box>
      <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
        <BookingStepActionsMobile onContinue={goNextStep} onGoBack={goPreviousStep} />
      </Box>
    </>
  )
}
