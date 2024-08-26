export type BookingStep = {
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
  dateOfBirth: string
  phoneNumber: string
  type: PassengerType
}

export type PayerData = {
  salutation: SalutationOption
  firstName: string
  lastName: string
  dateOfBirth: string
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
