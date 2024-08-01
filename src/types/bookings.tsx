export type BookingStep = {
  name: string
  url: string
}

export type SalutationOption = 'Mr' | 'Mme' | null

export type PassengerData = {
  salutation: SalutationOption
  firstName: string
  lastName: string
  isPayer: boolean
  dateOfBirth: string
  phoneNumber: string
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
}
