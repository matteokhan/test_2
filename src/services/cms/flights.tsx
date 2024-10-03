'use client'

import { OrderId, SearchFlightsParamsDto, SearchResponseDto } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { env } from 'next-runtime-env'

const NEXT_PUBLIC_CMS_API_URL = env('NEXT_PUBLIC_CMS_API_URL') || ''

export const searchFlights = async ({
  params,
  orderId,
}: {
  params?: SearchFlightsParamsDto
  orderId?: OrderId
}) => {
  const token = localStorage.getItem('reservationToken')
  if (!token) {
    throw new Error('No reservation token found')
  }
  if (!orderId) {
    throw new Error('No order id provided')
  }

  const response = await fetch(`${NEXT_PUBLIC_CMS_API_URL}/api/v2/order/${orderId}/ticket/search`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'content-type': 'application/json',
      authorization: `Token ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error('Failed to fetch flights')
  }
  return await response.json()
}

export const useSearchFlights = ({
  params,
  orderId,
}: {
  params?: SearchFlightsParamsDto
  orderId?: OrderId
}) => {
  return useQuery<SearchResponseDto>({
    // TODO: use a better key
    queryKey: ['searchFlightsResults', orderId, JSON.stringify(params)],
    queryFn: () => searchFlights({ params, orderId }),
    refetchOnWindowFocus: false,
    enabled: !!params && !!orderId,
  })
}
