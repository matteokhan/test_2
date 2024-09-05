import { CorrelationId, RouteId, SolutionId } from '@/types'

export type ReservationTokenDto = {
  token: string
  expires_at: string
}

export type CreateReservationDto = {
  ticket: ReservationTicketDto
}

export type ReservationId = string
export type ReservationDto = {
  id: ReservationId
  client: ReservationClientDto | null
  passangers: ReservationPassengerDto[]
  ticket: ReservationTicketDto | null
  amount: null
  is_paid: boolean
  payment_token: string | null
  payment_redirect_url: string | null
  payment_status_code: string | null
  payment_status_message: string | null
  payment_transaction_id: string | null
  payment_transaction_date: string | null
  created_at: string
  modified_at: string
  agency: number | null
  insurance: number | null
}

export type ReservationTicketDto = {
  correlation_id: CorrelationId
  data_object: string
  verification_price: number
  routes: ReservationRouteDto[]
}

export type ReservationRouteDto = {
  solution_id: SolutionId
  route_ids: RouteId[]
}

export type ReservationClientDto = {
  title: string
  first_name: string
  last_name: string
  birth_date: string
  email: string
  phone: string
  phone_country_prefix: string
  address: string
  postal_code: string
  city: string
  country: string
  create_account: boolean
  subscribe_to_newsletter: boolean
}

export type ReservationPassengerDto = {
  category: string
  title: string
  first_name: string
  last_name: string
  email: string
  birth_date: string
  phone: string
}
