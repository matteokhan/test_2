'use client'

import {
  Agency,
  Airlines,
  AirportData,
  Airports,
  CreateReservationDto,
  InsuranceWithSteps,
  PagesAPIBaseParams,
  ReservationDto,
  ReservationId,
} from '@/types'
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { env } from 'next-runtime-env'

const queryClient = new QueryClient()

export const searchAgencies = async ({ searchTerm }: { searchTerm?: string }) => {
  const NEXT_PUBLIC_CMS_API_URL = env('NEXT_PUBLIC_CMS_API_URL') || ''
  const params: PagesAPIBaseParams = {
    type: 'agency.AgencyPage',
    fields: '*',
  }
  if (searchTerm) {
    params.search = searchTerm
  }

  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, value as string)
  })

  const response = await fetch(
    `${NEXT_PUBLIC_CMS_API_URL}/api/v2/pages?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    },
  )
  if (response.ok) {
    return (await response.json()).items
  }
  throw new Error('Failed to fetch agencies')
}

export const useSearchAgencies = ({ searchTerm }: { searchTerm?: string }) => {
  return useQuery<Agency[]>({
    queryKey: ['searchAgenciesResults', searchTerm],
    queryFn: async () => searchAgencies({ searchTerm }),
    refetchOnWindowFocus: false,
  })
}

export const listInsurances = async () => {
  const NEXT_PUBLIC_CMS_API_URL = env('NEXT_PUBLIC_CMS_API_URL') || ''
  const params: PagesAPIBaseParams = {
    type: 'insurance.InsurancePage',
    fields: '*',
  }

  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, value as string)
  })

  const response = await fetch(
    `${NEXT_PUBLIC_CMS_API_URL}/api/v2/pages?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    },
  )
  if (response.ok) {
    return (await response.json()).items
  }
  throw new Error('Failed to fetch insurances')
}

export const useInsurances = () => {
  return useQuery<InsuranceWithSteps[]>({
    queryKey: ['insurances'],
    queryFn: listInsurances,
    refetchOnWindowFocus: false,
  })
}

export const getAirlinesData = async () => {
  const NEXT_PUBLIC_CMS_API_URL = env('NEXT_PUBLIC_CMS_API_URL') || ''
  let allResults: Airlines = {}

  const fetchPage = async (pageNumber: number): Promise<void> => {
    const response = await fetch(
      `${NEXT_PUBLIC_CMS_API_URL}/api/v2/report-airline-dict/?page_size=500&page=${pageNumber}`,
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      },
    )

    if (!response.ok) {
      throw new Error('Failed to fetch airlines data')
    }

    const data = await response.json()
    allResults = { ...allResults, ...data.results }

    if (data.next) {
      await fetchPage(pageNumber + 1)
    }
  }

  await fetchPage(1)
  return allResults
}

export const useAirlinesData = () => {
  // TODO: prefetching is not working as expected. Look at the useSearchFlights hook
  return useQuery<Airlines>({
    queryKey: ['airlinesData'],
    queryFn: getAirlinesData,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })
}

export const getAirportData = async ({ airportCode }: { airportCode: string }) => {
  const NEXT_PUBLIC_CMS_API_URL = env('NEXT_PUBLIC_CMS_API_URL') || ''
  const params = {
    code: airportCode,
  }

  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, value as string)
  })

  const response = await fetch(
    `${NEXT_PUBLIC_CMS_API_URL}/api/v2/report-airport-dict/?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    },
  )

  if (!response.ok) {
    throw new Error('Failed to fetch airport data')
  }

  return (await response.json()).results[airportCode]
}

export const useAirportData = ({ airportCode }: { airportCode: string }) => {
  return useQuery<AirportData>({
    queryKey: ['airportData', airportCode],
    queryFn: () => getAirportData({ airportCode }),
    refetchOnWindowFocus: false,
  })
}

export const searchAirportsByName = async ({ searchTerm }: { searchTerm: string }) => {
  const NEXT_PUBLIC_CMS_API_URL = env('NEXT_PUBLIC_CMS_API_URL') || ''
  const params = {
    name__icontains: searchTerm,
    ordering: '-category,code',
    page_size: 10,
  }
  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, value as string)
  })

  const response = await fetch(
    `${NEXT_PUBLIC_CMS_API_URL}/api/v2/report-airport-dict/?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    },
  )
  if (!response.ok) {
    throw new Error('Failed to fetch airport data')
  }
  return (await response.json()).results
}

export const useSearchAirportsByName = ({ searchTerm }: { searchTerm: string }) => {
  return useQuery<Airports>({
    queryKey: ['searchAirportsByName', searchTerm],
    queryFn: () => searchAirportsByName({ searchTerm }),
    refetchOnWindowFocus: false,
    enabled: !!searchTerm,
  })
}

export const getNearAgencies = async ({
  lat,
  lng,
  distance,
}: {
  lat?: number
  lng?: number
  distance?: number
}) => {
  if (!lat || !lng) return { meta: null, items: [] }
  const NEXT_PUBLIC_CMS_API_URL = env('NEXT_PUBLIC_CMS_API_URL') || ''
  const params = {
    lat: lat,
    lng: lng,
    fields: '*',
    distance__lte: distance ? distance : 40000,
  }

  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, value as string)
  })

  const response = await fetch(
    `${NEXT_PUBLIC_CMS_API_URL}/api/v2/report-agency/?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    },
  )

  if (!response.ok) {
    throw new Error('Failed to fetch arround agency')
  }

  return (await response.json()).items
}

export const useNearAgencies = ({
  lat,
  lng,
  distance,
}: {
  lat?: number
  lng?: number
  distance?: number
}) => {
  return useQuery<Agency[]>({
    queryKey: ['nearAgencies', lat, lng, distance],
    queryFn: async () => getNearAgencies({ lat, lng, distance }),
    refetchOnWindowFocus: false,
    enabled: !!lat && !!lng,
  })
}

export const getReservationToken = async () => {
  const NEXT_PUBLIC_CMS_API_URL = env('NEXT_PUBLIC_CMS_API_URL') || ''
  const token = localStorage.getItem('reservationToken')
  if (token) {
    return { token }
  }
  const response = await fetch(NEXT_PUBLIC_CMS_API_URL + '/api/v2/session/token', {
    method: 'GET',
  })
  if (!response.ok) {
    throw new Error('Failed to fetch reservation token')
  }
  const data = await response.json()
  localStorage.setItem('reservationToken', data.token)
  return data
}

export const createReservation = async ({ reservation }: { reservation: CreateReservationDto }) => {
  const NEXT_PUBLIC_CMS_API_URL = env('NEXT_PUBLIC_CMS_API_URL') || ''
  const token = localStorage.getItem('reservationToken')
  if (!token) {
    throw new Error('No reservation token found')
  }
  const response = await fetch(NEXT_PUBLIC_CMS_API_URL + '/api/v2/order/', {
    method: 'POST',
    body: JSON.stringify(reservation),
    headers: {
      'content-type': 'application/json',
      authorization: `Token ${token}`,
    },
  })
  if (response.ok) {
    return await response.json()
  }
  throw new Error('Failed to create reservation')
}

export const useCreateReservation = () => {
  return useMutation<ReservationDto, Error, CreateReservationDto>({
    mutationFn: async (reservation: CreateReservationDto) => {
      await queryClient.ensureQueryData({
        queryKey: ['reservationToken'],
        queryFn: getReservationToken,
        staleTime: Infinity,
        gcTime: Infinity,
      })
      return createReservation({ reservation })
    },
  })
}

export const updateReservation = async ({ reservation }: { reservation: ReservationDto }) => {
  const NEXT_PUBLIC_CMS_API_URL = env('NEXT_PUBLIC_CMS_API_URL') || ''
  const token = localStorage.getItem('reservationToken')
  if (!token) {
    throw new Error('No reservation token found')
  }
  const response = await fetch(`${NEXT_PUBLIC_CMS_API_URL}/api/v2/order/${reservation.id}/`, {
    method: 'PUT',
    body: JSON.stringify(reservation),
    headers: {
      'content-type': 'application/json',
      authorization: `Token ${token}`,
    },
  })
  if (response.ok) {
    return await response.json()
  }
  throw new Error('Failed to update reservation')
}

export const useUpdateReservation = () => {
  return useMutation<ReservationDto, Error, ReservationDto>({
    mutationFn: async (reservation: ReservationDto) => {
      await queryClient.ensureQueryData({
        queryKey: ['reservationToken'],
        queryFn: getReservationToken,
        staleTime: Infinity,
        gcTime: Infinity,
      })
      return updateReservation({ reservation })
    },
  })
}

export const getReservation = async ({ reservationId }: { reservationId: ReservationId }) => {
  const NEXT_PUBLIC_CMS_API_URL = env('NEXT_PUBLIC_CMS_API_URL') || ''
  const token = localStorage.getItem('reservationToken')
  if (!token) {
    throw new Error('No reservation token found')
  }
  const response = await fetch(`${NEXT_PUBLIC_CMS_API_URL}/api/v2/order/${reservationId}/`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      authorization: `Token ${token}`,
    },
  })
  if (response.ok) {
    return await response.json()
  }
  throw new Error('Failed to get reservation')
}

export const useReservation = ({ reservationId }: { reservationId: ReservationId }) => {
  return useQuery<ReservationDto>({
    queryKey: ['reservation', reservationId],
    queryFn: () => getReservation({ reservationId }),
    refetchOnWindowFocus: false,
  })
}

export const getReservationPaymentInfo = async ({
  reservationId,
}: {
  reservationId: ReservationId
}) => {
  const NEXT_PUBLIC_CMS_API_URL = env('NEXT_PUBLIC_CMS_API_URL') || ''
  const token = localStorage.getItem('reservationToken')
  if (!token) {
    throw new Error('No reservation token found')
  }
  const response = await fetch(
    `${NEXT_PUBLIC_CMS_API_URL}/api/v2/action-order-prepare-payment/${reservationId}/`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Token ${token}`,
      },
    },
  )
  if (response.ok) {
    return await response.json()
  }
  throw new Error('Failed to get payment data')
}

export const useReservationPaymentInfo = () => {
  return useMutation<ReservationDto, Error, ReservationId>({
    mutationFn: async (reservationId: ReservationId) => {
      await queryClient.ensureQueryData({
        queryKey: ['reservationToken'],
        queryFn: getReservationToken,
        staleTime: Infinity,
        gcTime: Infinity,
      })
      return getReservationPaymentInfo({ reservationId })
    },
  })
}
