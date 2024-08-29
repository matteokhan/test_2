import { CorrelationId, PassengerType, RouteId, SolutionId } from '@/types'

export type CreateReservationDto = {
  correlationId: CorrelationId
  ticket: string
  routes: ReservationRoute[]
  passengers: ReservationPassenger[]
  booker: ReservationBooker
}

export type ReservationRoute = {
  solutionId: SolutionId
  routeIds: RouteId[]
}

export type ReservationPassenger = {
  type: PassengerType
  title: string
  firstName: string
  lastName: string
  dateOfBirth: string
}

export type ReservationBooker = {
  firstName: string
  lastName: string
  email: string
  phone: string
  phoneCountry: string
  address: ReservationAddress
  sex: string
}

export type ReservationAddress = {
  street: string
  city: string
  country: string
  zipCode: string
  number: string
}
