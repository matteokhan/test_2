import { Dayjs } from 'dayjs'

export type BookingStepCode =
  | 'fares'
  | 'passengers'
  | 'contact'
  | 'insurances'
  | 'summary'
  | 'confirmation'

export type BookingStep = {
  code: BookingStepCode
  name: string
  url: string
  title: string
}

export type SalutationOption = 'Mr' | 'Mme' | null
export type PassengerType = 'ADT' | 'CHD' | 'INF'

export type PassengerData = {
  salutation: SalutationOption
  firstName: string
  lastName: string
  isPayer: boolean
  dateOfBirth: Dayjs | null
  phoneNumber: string
  email: string
  type: PassengerType
}

export type PayerData = {
  salutation: SalutationOption
  firstName: string
  lastName: string
  dateOfBirth: Dayjs | null
  phoneNumber: string
  email: string
  address: string
  postalCode: string
  city: string
  country: string
  createAccountOptIn: boolean
}

export type Fare = {
  id: string
  name: string
  price: number
  description: string
  services: FareService[]
}

export type FareService = {
  name: string
  icon: JSX.Element
}
