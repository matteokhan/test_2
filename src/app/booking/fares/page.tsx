'use client'

import React, { useState } from 'react'
import { BookingStepActions, FareOption, FareOptionSkeleton, SimpleContainer } from '@/components'
import { useBooking } from '@/contexts'
import { Stack } from '@mui/material'
import { useBrandedFares, useUpdateOrder } from '@/services'
import { UpdateOrderParams } from '@/types'
import { getFareDataFromSolution } from '@/utils'

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

  const {
    data: solutions,
    isSuccess,
    isFetching,
  } = useBrandedFares({
    orderId: order.id,
    solutionId: selectedFlight.id,
  })
  const { mutate: updateOrder, isPending: isUpdatingOrder } = useUpdateOrder()
  const isLoading = isFetching || isUpdatingOrder || isNavigating

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
          {isFetching && (
            <>
              <FareOptionSkeleton />
              <FareOptionSkeleton />
            </>
          )}
          {solutions &&
            !isFetching &&
            isSuccess &&
            solutions.map((solution) => {
              const fare = getFareDataFromSolution(solution)
              return (
                <FareOption
                  key={fare.id}
                  basePrice={selectedFlight.priceInfo.total}
                  fare={fare}
                  onSelect={() => setSelectedFare(solution)}
                  isSelected={
                    selectedFare?.routes[0].segments[0].fare.name ===
                    solution?.routes[0].segments[0].fare.name
                  }
                />
              )
            })}
        </Stack>
      </SimpleContainer>
      <BookingStepActions
        onContinue={handleSubmit}
        onGoBack={goPreviousStep}
        isLoading={isLoading}
      />
    </>
  )
}
