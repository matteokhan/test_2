'use client'

import { Ancillary, AncillaryServiceInfo, OrderId, OrderTicketDto } from '@/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { env } from 'next-runtime-env'

const NEXT_PUBLIC_CMS_API_URL = env('NEXT_PUBLIC_CMS_API_URL') || ''

export const getAncillaries = async ({ orderId }: { orderId: OrderId }) => {
  const token = localStorage.getItem('reservationToken')
  if (!token) {
    throw new Error('No reservation token found')
  }
  const response = await fetch(
    `${NEXT_PUBLIC_CMS_API_URL}/api/v2/order/${orderId}/ticket/ancillaries`,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        authorization: `Token ${token}`,
      },
    },
  )
  if (!response.ok) {
    throw new Error('Failed to get ancillaries')
  }
  return (await response.json()).ancillaries
}

export const useAncillaries = ({ orderId }: { orderId: OrderId }) => {
  return useQuery<Ancillary[]>({
    // TODO: use a better key
    queryKey: ['ancillaries', orderId],
    queryFn: () => getAncillaries({ orderId }),
    enabled: !!orderId,
    staleTime: 0,
    refetchOnWindowFocus: false,
  })
}

export const selectAncillaries = async ({
  orderId,
  ancillaries,
}: {
  orderId: OrderId
  ancillaries: AncillaryServiceInfo[]
}) => {
  const token = localStorage.getItem('reservationToken')
  if (!token) {
    throw new Error('No reservation token found')
  }

  const payload = {
    ancillaries: ancillaries.map((ancillary) => ({
      externalId: ancillary.externalId,
      type: ancillary.type,
    })),
  }

  const response = await fetch(
    `${NEXT_PUBLIC_CMS_API_URL}/api/v2/order/${orderId}/ticket/ancillaries`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'content-type': 'application/json',
        authorization: `Token ${token}`,
      },
    },
  )
  if (!response.ok) {
    throw new Error('Failed to select ancillaries')
  }

  const data = await response.json()
  if (!data.ancillaries_response?.success) {
    alert(data.ancillaries_response?.error || 'Failed to select ancillaries')
    throw new Error(data.ancillaries_response?.error || 'Failed to select ancillaries')
  }

  return data
}

export const useSelectAncillaries = () => {
  return useMutation<
    OrderTicketDto,
    Error,
    { orderId: OrderId; ancillaries: AncillaryServiceInfo[] }
  >({
    mutationFn: selectAncillaries,
  })
}
