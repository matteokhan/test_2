'use client'

import React, { useState } from 'react'
import {
  BookingStepActions,
  BookingStepActionsMobile,
  FareOption,
  SimpleContainer,
} from '@/components'
import { useBooking } from '@/contexts'
import { Box, Stack } from '@mui/material'
import { useBrandedFares, useUpdateOrder } from '@/services'
import { UpdateOrderParams } from '@/types'

export default function FaresPage() {
  const {
    goPreviousStep,
    goNextStep,
    setSelectedFare,
    selectedFare,
    selectedFlight,
    passengers,
    order,
    setOrder,
  } = useBooking()
  const [isNavigating, setIsNavigating] = useState(false)

  if (!selectedFlight || !passengers || !order) {
    // TODO: log this somewhere
    // TODO: Warn the user that something went wrong
    return null
  }

  const { data: brandedFares, isSuccess } = useBrandedFares({
    orderId: order.id,
    solutionId: selectedFlight.id,
  })
  const { mutate: updateOrder, isPending: isUpdatingOrder } = useUpdateOrder()

  const handleSubmit = async () => {
    const newOrder: UpdateOrderParams = {
      orderId: order.id,
      amount: selectedFare?.priceInfo.total || 0,
    }
    updateOrder(newOrder, {
      onSuccess: (data) => {
        setOrder(data)
        setIsNavigating(true)
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
        <Stack gap={2} pt={4} data-testid="faresPage-options">
          {brandedFares &&
            isSuccess &&
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
        <BookingStepActions
          onContinue={handleSubmit}
          onGoBack={goPreviousStep}
          isLoading={isUpdatingOrder || isNavigating}
        />
      </Box>
      <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
        <BookingStepActionsMobile
          onContinue={handleSubmit}
          onGoBack={goPreviousStep}
          isLoading={isUpdatingOrder || isNavigating}
        />
      </Box>
    </>
  )
}
