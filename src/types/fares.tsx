import { SolutionId, Solution } from '@/types'

export type BrandedFareRequestDto = {
  solution_id: SolutionId
}

export type BrandedFareResponse = {
  correlationId: string
  solutions: Solution[]
}
