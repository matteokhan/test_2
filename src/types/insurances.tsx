import { Currency, WagtailImageMetadata, WagtailPageMetadata } from '@/types'

export type InsuranceMetaData = WagtailPageMetadata & {
  type: 'insurance.InsurancePage'
}

export type InsuranceStepMetaData = {
  type: 'insurance.InsuranceStepPage'
}

export type InsuranceStep = {
  id: number
  meta: InsuranceStepMetaData
  min: string
  max: string
  amount: string
  amount_repartition: string
  cost_type: 'fixed'
  currency: Currency
}

export type InsuranceWithSteps = {
  id: number
  meta: InsuranceMetaData
  title: string
  code: string
  name: string
  description: string
  contract_number: string
  logo: {
    id: number
    meta: WagtailImageMetadata
    title: string
  }
  document: {
    type: 'document'
    value: [number, number]
    id: string
  }[]
  steps: InsuranceStep[]
}

export type Insurance = {
  id: number
  title: string
  code: string
  amount: number
  currency: Currency
}
