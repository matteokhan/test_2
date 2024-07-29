export type BookingStep = {
  name: string
  isActive: boolean
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
