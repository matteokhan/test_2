'use client'

import { Agency, Airlines, AirportData, InsuranceWithSteps, PagesAPIBaseParams } from '@/types'
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

export const getArroundAgency = async ({ lat, lng }: { lat: any; lng: any }) => {
  const NEXT_PUBLIC_CMS_API_URL = env('NEXT_PUBLIC_CMS_API_URL') || ''
  const params = {
    lat: lat,
    lng: lng,
    fields: '*',
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
