import { AgencyContractCode } from '@/types'

export type PaymentMethod = {
  name: string
  icon: React.ReactNode
  contractCode: AgencyContractCode
}

export type FloaPaymentOption = {
  country_code: string
  customer_fees: number
  customer_total_amount: number
  installment_count: number
  product_code: 'BC3XC' | 'BC4XC'
  simulated_installments: {
    amount: number
    date: string
    rank: number
  }[]
}
