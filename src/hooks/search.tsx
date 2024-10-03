'use client'

import { useAgencySelector, useBooking, useFlights } from '@/contexts'
import { useCreateOrder, useSearchFlights } from '@/services'
import { SearchFlightsParams } from '@/types'
import { useCallback } from 'react'

export const useSearch = () => {
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder()
  const { selectedAgency } = useAgencySelector()
  const { setOrder, resetSteps, order } = useBooking()
  const { setSearchParams, searchParamsDto } = useFlights()
  const {
    data,
    isSuccess,
    isLoading: isSearching,
  } = useSearchFlights({
    params: searchParamsDto,
    orderId: order?.id,
  })

  const searchFlights = useCallback(
    async ({ searchParams }: { searchParams: SearchFlightsParams }) => {
      if (!selectedAgency) {
        // TODO: log this somewhere
        // TODO: Warn the user that something went wrong
        return
      }
      resetSteps()
      createOrder(
        { agencyId: selectedAgency.id },
        {
          onSuccess: (order) => {
            setOrder(order)
            setSearchParams(searchParams)
          },
          onError: (error) => {
            // TODO: log this somewhere
            // TODO: Warn the user that something went wrong
          },
        },
      )
    },
    [selectedAgency, createOrder, setOrder, setSearchParams, resetSteps],
  )

  return {
    searchFlights,
    isSearching: isSearching || isCreatingOrder,
    data,
    isSuccess,
  }
}
