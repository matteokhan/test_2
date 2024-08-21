'use client'

import {
  ConfirmReservationRequestDto,
  CreateReservationRequest,
  SearchFlightsParamsDto,
  SearchResponseDto,
} from '@/types'
import { useQuery } from '@tanstack/react-query'
import { env } from 'next-runtime-env'
import { getAirlinesData } from './cms'
import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

export const searchFlights = async ({ params }: { params?: SearchFlightsParamsDto }) => {
  const NEXT_PUBLIC_FLIGHTS_API_URL = env('NEXT_PUBLIC_FLIGHTS_API_URL') || ''
  const NEXT_PUBLIC_FLIGHTS_API_TOKEN = env('NEXT_PUBLIC_FLIGHTS_API_TOKEN') || ''
  const response = await fetch(NEXT_PUBLIC_FLIGHTS_API_URL + '/search', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'content-type': 'application/json',
      authorization: NEXT_PUBLIC_FLIGHTS_API_TOKEN,
    },
  })
  if (response.ok) {
    return (await response.json()) as SearchResponseDto
  }
  throw new Error('Failed to fetch flights')
}

export const useSearchFlights = ({ params }: { params: SearchFlightsParamsDto | undefined }) => {
  return useQuery<SearchResponseDto>({
    // TODO: use a better key
    // TODO: prefetching is not working as expected
    queryKey: ['searchFlightsResults', JSON.stringify(params)],
    queryFn: async () => {
      queryClient.prefetchQuery({
        queryKey: ['airlinesData'],
        queryFn: getAirlinesData,
        staleTime: Infinity,
      })
      return searchFlights({ params: params })
    },
    refetchOnWindowFocus: false,
    enabled: !!params,
  })
}

export const createReservation = async ({
  params,
}: {
  params: CreateReservationRequest | undefined
}) => {
  const NEXT_PUBLIC_FLIGHTS_API_URL = env('NEXT_PUBLIC_FLIGHTS_API_URL') || ''
  const NEXT_PUBLIC_FLIGHTS_API_TOKEN = env('NEXT_PUBLIC_FLIGHTS_API_TOKEN') || ''
  const response = await fetch(NEXT_PUBLIC_FLIGHTS_API_URL + '/reservation/create', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'content-type': 'application/json',
      authorization: NEXT_PUBLIC_FLIGHTS_API_TOKEN,
    },
  })
  if (response.ok) {
    return await response.json()
  }
  throw new Error('Failed to create reservation')
}

export const confirmReservation = async ({ params }: { params: ConfirmReservationRequestDto }) => {
  const NEXT_PUBLIC_FLIGHTS_API_URL = env('NEXT_PUBLIC_FLIGHTS_API_URL') || ''
  const NEXT_PUBLIC_FLIGHTS_API_TOKEN = env('NEXT_PUBLIC_FLIGHTS_API_TOKEN') || ''
  const response = await fetch(NEXT_PUBLIC_FLIGHTS_API_URL + '/reservation/confirm', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'content-type': 'application/json',
      authorization: NEXT_PUBLIC_FLIGHTS_API_TOKEN,
    },
  })
  if (response.ok) {
    return await response.json()
  }
  throw new Error('Failed to confirm reservation')
}

export const useCreateReservation = ({
  params,
}: {
  params: CreateReservationRequest | undefined
}) => {
  return useQuery({
    queryKey: ['createReservation', JSON.stringify(params)],
    queryFn: () => createReservation({ params }),
    refetchOnWindowFocus: false,
    enabled: !!params,
  })
}
