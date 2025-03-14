'use client'

import React, { useState } from 'react'
import { BookingStepActions, FareOption, FareOptionSkeleton, SimpleContainer } from '@/components'
import { useBooking } from '@/contexts'
import { Stack } from '@mui/material'
import { useBrandedFares, useUpdateOrder } from '@/services'
import { UpdateOrderParams } from '@/types'
import { AppError, getFareDataFromSolution } from '@/utils'
import useMetadata from '@/contexts/useMetadata'

export default function FaresPage() {
  useMetadata('Choix du tarif')
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

  if (!selectedFlight || passengers.length == 0 || !order) {
    throw new AppError(
      'Something went wrong loading fares page',
      'Fares page preconditions not met',
      {
        missingData: {
          selectedFlight: !selectedFlight,
          order: !order,
          passengers: passengers.length == 0,
        },
      },
    )
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
        throw new AppError(
          'Something went wrong updating order',
          'Updating order at fares step failed',
          { serverError: error },
        )
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
                  isSelected={selectedFare?.id === solution.id}
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
