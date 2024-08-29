'use client'

import {
  Agency,
  Airlines,
  AirportData,
  Airports,
  InsuranceWithSteps,
  PagesAPIBaseParams,
} from '@/types'
import { useQuery } from '@tanstack/react-query'
import { env } from 'next-runtime-env'

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

export const getArroundAgencies = async ({
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

  return await response.json()
}

export const useGetArroundAgencies = ({
  lat,
  lng,
  distance,
}: {
  lat?: number
  lng?: number
  distance?: number
}) => {
  return useQuery<{ meta: any; items: Agency[] }>({
    queryKey: ['getArroudAgenciesResults', lat, lng, distance],
    queryFn: async () => getArroundAgencies({ lat, lng, distance }),
    refetchOnWindowFocus: false,
  })
}
