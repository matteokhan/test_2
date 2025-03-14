'use client'

import { Agency, AgencyId, PagesAPIBaseParams } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { getEnvVar } from '@/utils'

export const getAgency = async ({ agencyId }: { agencyId: AgencyId }) => {
  const CMS_API_URL = getEnvVar({ name: 'NEXT_PUBLIC_CMS_API_URL' })
  const response = await fetch(`${CMS_API_URL}/api/v2/report-agency-simple/${agencyId}/`, {
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
  const CMS_API_URL = getEnvVar({ name: 'NEXT_PUBLIC_CMS_API_URL' })
  const params: PagesAPIBaseParams & { status: Agency['status'] } = {
    type: 'agency.AgencyPage',
    fields: '*',
    status: 'open',
  }
  if (searchTerm) {
    params.search = searchTerm
  }

  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, value as string)
  })

  const response = await fetch(
    `${CMS_API_URL}/api/v2/report-agency-simple/?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    },
  )
  if (!response.ok) {
    throw new Error('Failed to fetch agencies')
  }
  return (await response.json()).results
}

export const useSearchAgencies = ({ searchTerm }: { searchTerm?: string }) => {
  return useQuery<Agency[]>({
    queryKey: ['searchAgenciesResults', searchTerm],
    queryFn: async () => searchAgencies({ searchTerm }),
    refetchOnWindowFocus: false,
    enabled: !!searchTerm,
  })
}

export const listAllAgencies = async () => {
  const CMS_API_URL = getEnvVar({ name: 'NEXT_PUBLIC_CMS_API_URL' })
  const response = await fetch(`${CMS_API_URL}/cache/agency.json`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  })
  if (!response.ok) {
    throw new Error('Failed to list all agencies')
  }
  return await response.json()
}

export const useListAllAgencies = () => {
  return useQuery<Agency[]>({
    queryKey: ['listAllAgencies'],
    queryFn: async () => listAllAgencies(),
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
  const CMS_API_URL = getEnvVar({ name: 'NEXT_PUBLIC_CMS_API_URL' })
  if (!lat || !lng) return { meta: null, items: [] }
  const params = {
    lat: lat,
    lng: lng,
    fields: '*',
    status: 'open',
    distance__lte: distance ? distance : 40000,
  }

  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, value as string)
  })

  const response = await fetch(
    `${CMS_API_URL}/api/v2/report-agency-simple/?${queryParams.toString()}`,
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

  return (await response.json()).results
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
