'use client'

import { Airlines, Formality, LocationData, Locations } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { getEnvVar } from '@/utils'

export const getAirlinesData = async () => {
  const CMS_API_URL = getEnvVar({ name: 'NEXT_PUBLIC_CMS_API_URL' })
  let allResults: Airlines = {}

  const fetchPage = async (pageNumber: number): Promise<void> => {
    const response = await fetch(
      `${CMS_API_URL}/api/v2/report-airline-dict/?page_size=500&page=${pageNumber}`,
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

export const getLocationData = async ({ locationCode }: { locationCode: string }) => {
  const CMS_API_URL = getEnvVar({ name: 'NEXT_PUBLIC_CMS_API_URL' })
  const params = {
    code: locationCode,
  }

  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, value as string)
  })

  const response = await fetch(
    `${CMS_API_URL}/api/v2/report-airport-dict/?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    },
  )

  if (!response.ok) {
    throw new Error('Failed to fetch location data')
  }

  return (await response.json()).results[locationCode]
}

export const useLocationData = ({ locationCode }: { locationCode: string }) => {
  return useQuery<LocationData>({
    queryKey: ['locationData', locationCode],
    queryFn: () => getLocationData({ locationCode }),
    enabled: !!locationCode,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: Infinity,
  })
}

export const searchLocationsByName = async ({ searchTerm }: { searchTerm: string }) => {
  const CMS_API_URL = getEnvVar({ name: 'NEXT_PUBLIC_CMS_API_URL' })
  const params = {
    search: searchTerm,
    ordering: '-category,code',
    page_size: 10,
  }
  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, value as string)
  })

  const response = await fetch(
    `${CMS_API_URL}/api/v2/report-airport-dict/?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    },
  )
  if (!response.ok) {
    throw new Error('Failed to fetch locations data')
  }
  return (await response.json()).results
}

export const useLocationsByName = ({ searchTerm }: { searchTerm: string }) => {
  return useQuery<Locations>({
    queryKey: ['locationsByName', searchTerm],
    queryFn: () => searchLocationsByName({ searchTerm }),
    refetchOnWindowFocus: false,
    enabled: !!searchTerm,
  })
}

export const getFormalities = async ({
  countryCode,
  areaCode,
}: {
  countryCode?: string
  areaCode?: string
}) => {
  const CMS_API_URL = getEnvVar({ name: 'NEXT_PUBLIC_CMS_API_URL' })
  const params: {
    type: string
    fields: string
    country_code?: string
    area_code?: string
  } = {
    type: 'airport.FormalityPage',
    fields: '*',
  }
  if (countryCode) {
    params.country_code = countryCode
  }
  if (areaCode) {
    params.area_code = areaCode
  }
  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, value as string)
  })

  const response = await fetch(`${CMS_API_URL}/api/v2/pages/?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  })
  if (!response.ok) {
    throw new Error('Failed to fetch locations data')
  }
  return (await response.json()).items
}

export const useFormalities = ({
  countryCode,
  areaCode,
}: {
  countryCode?: string
  areaCode?: string
}) => {
  return useQuery<Formality[]>({
    queryKey: ['formalitiesByCountry', countryCode],
    queryFn: () => getFormalities({ countryCode, areaCode }),
    refetchOnWindowFocus: false,
    enabled: !!countryCode || !!areaCode,
  })
}
