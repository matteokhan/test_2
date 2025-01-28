'use client'

import {
  AncillariesQueryResult,
  AncillaryServiceInfo,
  GDSType,
  LCCAncillary,
  OrderId,
  OrderTicketDto,
  SolutionId,
} from '@/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getEnvVar } from '@/utils'

// const CMS_API_URL = env('NEXT_PUBLIC_CMS_API_URL') || ''

export const getAncillaries = async ({
  orderId,
}: {
  orderId: OrderId
}): Promise<AncillariesQueryResult> => {
  const CMS_API_URL = getEnvVar({ name: 'NEXT_PUBLIC_CMS_API_URL' })
  const token = localStorage.getItem('reservationToken')
  if (!token) {
    throw new Error('No reservation token found')
  }
  const response = await fetch(`${CMS_API_URL}/api/v2/order/${orderId}/ticket/ancillaries`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      authorization: `Token ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error('Failed to get ancillaries')
  }

  const data = await response.json()
  if (!data.success) {
    throw new Error('Error when getting ancillaries')
  }

  return {
    ancillaries: data.ancillaries,
    passengers: data.passengerList,
    segments: data.segmentList,
  }
}

export const useAncillaries = ({ orderId, gdsType }: { orderId: OrderId; gdsType?: GDSType }) => {
  return useQuery<AncillariesQueryResult>({
    // TODO: can we get rid of the staleTime?
    queryKey: ['ancillaries', orderId],
    queryFn: () => getAncillaries({ orderId }),
    enabled: !!orderId && gdsType === GDSType.REGULAR,
    staleTime: 3 * 1000, // TODO: This is requiered to avoid a second request on the Ancillaries page when user came from contact page
    refetchOnWindowFocus: false,
    gcTime: 3 * 1000,
  })
}

export const selectAncillaries = async ({
  orderId,
  ancillaries,
}: {
  orderId: OrderId
  ancillaries: AncillaryServiceInfo[]
}) => {
  const CMS_API_URL = getEnvVar({ name: 'NEXT_PUBLIC_CMS_API_URL' })
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

  const response = await fetch(`${CMS_API_URL}/api/v2/order/${orderId}/ticket/ancillaries`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'content-type': 'application/json',
      authorization: `Token ${token}`,
    },
  })
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

export const getLCCAncillaries = async ({
  orderId,
  solutionId,
}: {
  orderId?: OrderId
  solutionId?: SolutionId
}) => {
  const CMS_API_URL = getEnvVar({ name: 'NEXT_PUBLIC_CMS_API_URL' })
  const token = localStorage.getItem('reservationToken')
  if (!token) {
    throw new Error('No reservation token found')
  }
  const response = await fetch(
    `${CMS_API_URL}/api/v2/order/${orderId}/ticket/ancillaries/low-cost-carrier`,
    {
      method: 'POST',
      body: JSON.stringify({ solution_id: solutionId }),
      headers: {
        'content-type': 'application/json',
        authorization: `Token ${token}`,
      },
    },
  )
  if (!response.ok) {
    throw new Error('Failed to get LCC ancillaries')
  }

  const data = await response.json()
  return data
}

export const useLCCAncillaries = ({
  orderId,
  solutionId,
  gdsType,
}: {
  orderId?: OrderId
  solutionId?: SolutionId
  gdsType?: GDSType
}) => {
  return useQuery<LCCAncillary[]>({
    queryKey: ['lcc-ancillaries', orderId, solutionId],
    queryFn: () => getLCCAncillaries({ orderId, solutionId }),
    enabled: !!orderId && !!solutionId && gdsType === GDSType.LOW_COST_CARRIER,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })
}
