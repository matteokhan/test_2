'use client'

import { Agency, AgencyId, PagesAPIBaseParams } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { env } from 'next-runtime-env'

const NEXT_PUBLIC_CMS_API_URL = env('NEXT_PUBLIC_CMS_API_URL') || ''

export const getAgency = async ({ agencyId }: { agencyId: AgencyId }) => {
  const response = await fetch(`${NEXT_PUBLIC_CMS_API_URL}/api/v2/pages/${agencyId}/`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  })
  if (response.ok) {
    return await response.json()
  }
  throw new Error('Failed to fetch agency')
}

export const useAgency = ({ agencyId }: { agencyId: AgencyId }) => {
  return useQuery<Agency>({
    queryKey: ['agency', agencyId],
    queryFn: () => getAgency({ agencyId }),
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0,
  })
}

export const searchAgencies = async ({ searchTerm }: { searchTerm?: string }) => {
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
  console.log('queryParams:', queryParams.toString())

  const response = await fetch(
    `${NEXT_PUBLIC_CMS_API_URL}/api/v2/pages/?${queryParams.toString()}`,
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
    gcTime: Infinity,
    staleTime: Infinity,
  })
}
