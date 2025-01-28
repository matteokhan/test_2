import { BrandedFareRequestDto, OrderId, Solution, SolutionId } from '@/types'
import { getSearchBrandedFaresDto } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { getEnvVar } from '@/utils'

export const getBrandedFares = async ({
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
  const searchParams: BrandedFareRequestDto = getSearchBrandedFaresDto({ solutionId })
  const response = await fetch(`${CMS_API_URL}/api/v2/order/${orderId}/ticket/branded/search`, {
    method: 'POST',
    body: JSON.stringify(searchParams),
    headers: {
      'content-type': 'application/json',
      authorization: `Token ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error('Failed to fetch fares')
  }
  return (await response.json()).solutions
}

export const useBrandedFares = ({
  orderId,
  solutionId,
}: {
  orderId: OrderId
  solutionId: SolutionId
}) => {
  return useQuery<Solution[]>({
    // TODO: use a better key
    queryKey: ['brandedFares', orderId, solutionId],
    queryFn: () => getBrandedFares({ orderId, solutionId }),
    refetchOnWindowFocus: false,
    enabled: !!orderId && !!solutionId,
    gcTime: Infinity, // TODO: this is not true
    staleTime: Infinity, // TODO: this is not true
  })
}
