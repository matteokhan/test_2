'use client'

import { SearchFlightParamsDto, SearchResponseDto } from '@/types'
import { useQuery } from '@tanstack/react-query'

export const searchFlights = async ({ params }: { params: SearchFlightParamsDto }) => {
  const response = await fetch(process.env.NEXT_PUBLIC_FLIGHTS_API_URL + '/search' || '', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'content-type': 'application/json',
      authorization: process.env.NEXT_PUBLIC_FLIGHTS_API_TOKEN || '',
    },
  })
  if (response.ok) {
    return (await response.json()) as SearchResponseDto
  }
  throw new Error('Failed to fetch flights')
}

export const useSearchFlights = ({ params }: { params: SearchFlightParamsDto }) => {
  return useQuery<SearchResponseDto>({
    queryKey: ['searchFlightsResults'],
    queryFn: async () => searchFlights({ params }),
  })
}
