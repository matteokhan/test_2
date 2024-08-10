'use client'

import { SearchFlightParamsDto, SearchResponseDto } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { env } from 'next-runtime-env'

export const searchFlights = async ({ params }: { params: SearchFlightParamsDto }) => {
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

export const useSearchFlights = ({ params }: { params: SearchFlightParamsDto }) => {
  return useQuery<SearchResponseDto>({
    // TODO: use a better key
    queryKey: ['searchFlightsResults', JSON.stringify(params)],
    queryFn: async () => searchFlights({ params }),
    refetchOnWindowFocus: false,
  })
}
