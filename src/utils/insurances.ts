import { InsuranceWithSteps } from '@/types'

export const getInsurancePrice = (
  amount: number,
  insurance: InsuranceWithSteps,
  totalPeople: number,
) => {
  const rate = amount / totalPeople
  const step = insurance.steps.find((step) => {
    return Number(step.min) <= rate && Number(step.max) >= rate
  })
  return Number(step?.amount)
}
