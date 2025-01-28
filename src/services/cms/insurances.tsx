'use client'

import { InsuranceWithSteps, PagesAPIBaseParams } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { getEnvVar } from '@/utils'

export const listInsurances = async () => {
  const CMS_API_URL = getEnvVar({ name: 'NEXT_PUBLIC_CMS_API_URL' })
  const params: PagesAPIBaseParams = {
    type: 'insurance.InsurancePage',
    fields: '*',
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
