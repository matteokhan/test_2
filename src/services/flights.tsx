'use client'

import { SearchFlightsParamsDto, SearchResponseDto } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { env } from 'next-runtime-env'
import { getAirlinesData } from '@/services'
import { QueryClient } from '@tanstack/react-query'
import { BrandedFareRequestDto } from '@/types'

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

export const getBrandedFares = async ({ params }: { params: BrandedFareRequestDto }) => {
  const NEXT_PUBLIC_FLIGHTS_API_URL = env('NEXT_PUBLIC_FLIGHTS_API_URL') || ''
  const NEXT_PUBLIC_FLIGHTS_API_TOKEN = env('NEXT_PUBLIC_FLIGHTS_API_TOKEN') || ''
  const response = await fetch(NEXT_PUBLIC_FLIGHTS_API_URL + '/brands/list', {
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
  throw new Error('Failed to fetch branded fares')
}
