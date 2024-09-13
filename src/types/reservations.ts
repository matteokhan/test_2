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
  passengers: ReservationPassengerDto[]
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
  agency_contract: string | null
  agency__name: string | null
}

export type ReservationTicketDto = {
  correlation_id: CorrelationId
  data_object: string
  verification_price: number
  routes: ReservationRouteDto[]
  is_reserved?: boolean
  travel_data?: ReservationTravelDataDto
  trip_end_date: string | null
}

export type ReservationTravelDataDto = {
  departure_city: string
  departure_city_name: string
  passenger_name_record: string
  return_city: string
  return_city_name: string
  stay_city: string | null
  stay_country: string | null
  transports: ReservationTransportDto[]
  trip_end_date: string
  trip_start_date: string
}

export type ReservationTransportDto = {
  arrival_city: string
  arrival_city_name: string
  carrier: string
  departure_city: string
  departure_city_name: string
  flight_number: string
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
