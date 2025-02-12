'use client'

import {
  CreateOrderDto,
  CreateOrderParams,
  FloaPaymentOption,
  OrderDto,
  OrderId,
  OrderTicketDto,
  SolutionId,
  UpdateOrderParams,
} from '@/types'
import { getCreateOrderDto, getOrderClientDto, getOrderPassengerDto } from '@/utils'
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { getEnvVar } from '@/utils'

const queryClient = new QueryClient()

// Fetches a reservation token from the CMS API and stores it in localStorage.
// A reservation token belongs to a "user" in the CMS API. It is used to create and update orders.
// If a token is already on local storage, we return that token. This means the "user" will
// always be the same until the token is cleared.
export const getReservationToken = async () => {
  const CMS_API_URL = getEnvVar({ name: 'NEXT_PUBLIC_CMS_API_URL' })
  const token = localStorage.getItem('reservationToken')
  let options: { method: string; headers?: { authorization: string } } = {
    method: 'GET',
  }
  if (token) {
    options['headers'] = { authorization: `Token ${token}` }
  }
  const response = await fetch(CMS_API_URL + '/api/v2/session/token', options)
  if (!response.ok) {
    throw new Error('Failed to fetch reservation token')
  }
  const data = await response.json()
  localStorage.setItem('reservationToken', data.token)
  return data
}

// Creates an order in the CMS API using the reservation token.
// The reservation token is required to create an order.
export const createOrder = async ({ agencyId }: CreateOrderParams) => {
  const CMS_API_URL = getEnvVar({ name: 'NEXT_PUBLIC_CMS_API_URL' })
  const token = localStorage.getItem('reservationToken')
  if (!token) {
    throw new Error('No reservation token found')
  }
  const createOrderDto: CreateOrderDto = getCreateOrderDto({ agencyId })
  const response = await fetch(CMS_API_URL + '/api/v2/order/', {
    method: 'POST',
    body: JSON.stringify(createOrderDto),
    headers: {
      'content-type': 'application/json',
      authorization: `Token ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error('Failed to create order')
  }
  return await response.json()
}

// Hook to create an order. It ensures there is a token in local storage before creating the order.
export const useCreateOrder = () => {
  return useMutation<OrderDto, Error, CreateOrderParams>({
    mutationFn: async ({ agencyId }: CreateOrderParams) => {
      await queryClient.ensureQueryData({
        queryKey: ['reservationToken'],
        queryFn: getReservationToken,
        staleTime: Infinity,
        gcTime: Infinity,
      })
      return createOrder({ agencyId })
    },
  })
}

// Updates an order in the CMS API using the reservation token.
// The reservation token is required to update the order.
// The update can be partial, only the fields that are sent will be updated.
export const updateOrder = async ({
  orderId,
  payer,
  passengers,
  amount,
  agency,
  agencyContract,
  insurance,
}: UpdateOrderParams) => {
  const CMS_API_URL = getEnvVar({ name: 'NEXT_PUBLIC_CMS_API_URL' })
  const token = localStorage.getItem('reservationToken')
  if (!token) {
    throw new Error('No reservation token found')
  }

  const order: Partial<OrderDto> = {}
  if (payer) {
    order.client = getOrderClientDto({ payer })
  }
  if (amount) {
    order.amount = amount
  }
  if (passengers) {
    order.passengers = passengers.map((passenger) => getOrderPassengerDto({ passenger }))
  }
  if (agency) {
    order.agency = agency
  }
  if (agencyContract) {
    order.agency_contract = agencyContract
  }
  if (insurance) {
    order.insurance = insurance
  }

  const response = await fetch(`${CMS_API_URL}/api/v2/order/${orderId}/`, {
    method: 'PUT',
    body: JSON.stringify(order),
    headers: {
      'content-type': 'application/json',
      authorization: `Token ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error('Failed to update order')
  }
  return await response.json()
}

// Hook to update an order. We asume the reservation token is already in local storage.
export const useUpdateOrder = () => {
  return useMutation<OrderDto, Error, UpdateOrderParams>({
    mutationFn: updateOrder,
  })
}

// Fetches an order from the CMS API using the reservation token and an order ID.
// The reservation token is required to fetch the order.
export const getOrder = async ({ orderId }: { orderId: OrderId }) => {
  const CMS_API_URL = getEnvVar({ name: 'NEXT_PUBLIC_CMS_API_URL' })
  const token = localStorage.getItem('reservationToken')
  if (!token) {
    throw new Error('No reservation token found')
  }
  const response = await fetch(`${CMS_API_URL}/api/v2/order/${orderId}/`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      authorization: `Token ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error('Failed to get order')
  }
  return await response.json()
}

// Hook to fetch a order. We asume the reservation token is already in local storage.
export const useOrder = ({ orderId }: { orderId: OrderId }) => {
  return useQuery<OrderDto>({
    queryKey: ['order', orderId],
    queryFn: () => getOrder({ orderId }),
    refetchOnWindowFocus: false,
  })
}

// Reserves an order in the CMS API using the reservation token and an order ID.
// The reservation token is required to reserve the order.
export const reserveOrder = async ({
  orderId,
  solutionId,
}: {
  orderId: OrderId
  solutionId: SolutionId
}) => {
  const CMS_API_URL = getEnvVar({ name: 'NEXT_PUBLIC_CMS_API_URL' })
  const token = localStorage.getItem('reservationToken')
  if (!token) {
    throw new Error('No reservation token found')
  }
  const payload = { solution_id: solutionId }
  const response = await fetch(`${CMS_API_URL}/api/v2/order/${orderId}/ticket/reserve`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'content-type': 'application/json',
      authorization: `Token ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error('Failed to reserve order')
  }
  return await response.json()
}

// Hook to reserve an order. We asume the reservation token is already in local storage.
export const useReserveOrder = () => {
  return useMutation<OrderTicketDto, Error, { orderId: OrderId; solutionId: SolutionId }>({
    mutationFn: reserveOrder,
  })
}

// Fetches the payment information for an order from the CMS API using the reservation token and an order ID.
// The reservation token is required to fetch the payment information.
export const prepareOrderPayment = async ({ orderId }: { orderId: OrderId }) => {
  const CMS_API_URL = getEnvVar({ name: 'NEXT_PUBLIC_CMS_API_URL' })
  const token = localStorage.getItem('reservationToken')
  if (!token) {
    throw new Error('No reservation token found')
  }
  const response = await fetch(`${CMS_API_URL}/api/v2/order/${orderId}/payment/prepare`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Token ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error('Failed to get payment data')
  }
  return await response.json()
}

// Hook to fetch the payment information for an order.
// We asume the reservation token is already in local storage.
export const usePrepareOrderPayment = () => {
  return useMutation<OrderDto, Error, { orderId: OrderId }>({
    mutationFn: prepareOrderPayment,
  })
}

// Fetches the payment information for an order from the CMS API using the reservation token and an order ID.
// The reservation token is required to fetch the payment information.
// Use this endpoint when gdsType = 1 (LowCostCarrier)
export const prepareLccOrderPayment = async ({
  orderId,
  solutionId,
}: {
  orderId: OrderId
  solutionId: SolutionId
}) => {
  const CMS_API_URL = getEnvVar({ name: 'NEXT_PUBLIC_CMS_API_URL' })
  const token = localStorage.getItem('reservationToken')
  if (!token) {
    throw new Error('No reservation token found')
  }

  const payload = { solution_id: solutionId }
  const response = await fetch(
    `${CMS_API_URL}/api/v2/order/${orderId}/payment/prepare/low-cost-carrier`,
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
    return await response.json() // TODO: handle error
  }
  return await response.json()
}

// Hook to fetch the payment information for an order.
// We asume the reservation token is already in local storage.
export const usePrepareLccOrderPayment = () => {
  return useMutation<OrderDto, OrderDto, { orderId: OrderId; solutionId: SolutionId }>({
    mutationFn: prepareLccOrderPayment,
  })
}

// Fetches the payment FLOA payment options from CMS API using the reservation token and an order ID.
// The reservation token is required.
export const getFloaPaymentOptions = async ({
  orderId,
  amount,
}: {
  orderId?: OrderId
  amount?: string
}) => {
  const CMS_API_URL = getEnvVar({ name: 'NEXT_PUBLIC_CMS_API_URL' })
  const token = localStorage.getItem('reservationToken')
  if (!token) {
    throw new Error('No reservation token found')
  }

  const params = {
    amount: amount,
    product_codes: 'BC3XC,BC4XC',
  }

  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, value as string)
  })

  const response = await fetch(
    `${CMS_API_URL}/api/v2/order/${orderId}/payment/floa/simulate?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        authorization: `Token ${token}`,
      },
    },
  )
  if (!response.ok) {
    throw new Error('Failed to get FLOA payment options')
  }
  return await response.json()
}

// Hook to fetch the FLOA payment information for an order.
// We asume the reservation token is already in local storage.
export const useFloaPaymentOptions = ({
  orderId,
  amount,
}: {
  orderId?: OrderId
  amount?: string
}) => {
  return useQuery<FloaPaymentOption[]>({
    queryKey: ['floaOptions', orderId],
    queryFn: () => getFloaPaymentOptions({ orderId, amount }),
    refetchOnWindowFocus: false,
    enabled: !!orderId,
  })
}
