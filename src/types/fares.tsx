import { SolutionId, Solution } from '@/types'

export type BrandedFareRequestDto = {
  solution_id: SolutionId
}

export type BrandedFareResponse = {
  solutions: Solution[]
}
