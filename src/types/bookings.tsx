import { Dayjs } from 'dayjs'
import { CountryCallingCode } from 'libphonenumber-js'
import {
  Agency,
  AgencyId,
  CorrelationId,
  LCCAncillary,
  RouteId,
  SearchFlightsParamsDto,
  SolutionId,
} from '@/types'

export type BookingStepCode =
  | 'fares'
  | 'passengers'
  | 'contact'
  | 'insurances'
  | 'ancillaries'
  | 'summary'
  | 'confirmation'

export type BookingStep = {
  code: BookingStepCode
  name: string
  url: string
  title: string
  skip: boolean
}

export type SalutationOption = 'Mr' | 'Mrs' | 'Ms' | null
export type PassengerType = 'ADT' | 'CHD' | 'INF'

export type PassengerData = {
  salutation: SalutationOption
  firstName: string
  lastName: string
  isPayer: boolean
  dateOfBirth: Dayjs | null
  phoneNumber: string
  phoneCode: CountryCallingCode
  email: string
  type: PassengerType
  ancillaries: LCCAncillary[]
}

export type PayerData = {
  salutation: SalutationOption
  firstName: string
  lastName: string
  dateOfBirth: Dayjs | null
  phoneNumber: string
  phoneCode: CountryCallingCode
  email: string
  address: string
  postalCode: string
  city: string
  country: string
  createAccountOptIn: boolean
  subscribeNewsletterOptIn: boolean
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

export type PNR = string

export type CreateOrderParams = { agencyId: AgencyId }
export type UpdateOrderParams = {
  orderId: OrderId
  payer?: PayerData
  passengers?: PassengerData[]
  amount?: number
  insurance?: number | null
  agency?: number | null
  agencyContract?: string | null
}

export type ReservationTokenDto = {
  token: string
  expires_at: string
}

export type CreateOrderDto = {
  agency: AgencyId
}

export type OrderId = string
export type OrderDto = {
  id: OrderId
  client: OrderClientDto | null
  passengers: OrderPassengerDto[]
  ticket: OrderTicketDto | null
  amount: number // TODO: Add amount type
  is_paid: boolean
  payment_token: string | null
  payment_redirect_url: string | null
  payment_status_code: string | null
  payment_status_message: string | null
  payment_transaction_id: string | null
  payment_transaction_date: string | null
  payment_paid_amount: string | null
  created_at: string
  modified_at: string
  agency: number | null
  agency_data: Agency | null
  insurance: number | null
  agency_contract: string | null
  agency__name: string | null
  search: SearchFlightsParamsDto & {
    correlation_id: CorrelationId
    number_of_searches: number
    searched_at: string
    solution_id: SolutionId
  }
}

export type OrderTicketDto = {
  correlation_id: CorrelationId
  data_object: string
  verification_price: number
  routes: OrderRouteDto[]
  is_reserved?: boolean
  travel_data?: OrderTravelDataDto
  trip_end_date: string | null
}

export type OrderTravelDataDto = {
  departure_city: string
  departure_city_name: string
  passenger_name_record: PNR
  return_city: string
  return_city_name: string
  stay_city: string | null
  stay_country: string | null
  transports: OrderTransportDto[]
  trip_end_date: string
  trip_start_date: string
}

export type OrderTransportDto = {
  arrival_city: string
  arrival_city_name: string
  carrier: string
  departure_city: string
  departure_city_name: string
  flight_number: string
  service_period: {
    end: string
    start: string
  }
}

export type OrderRouteDto = {
  solution_id: SolutionId
  route_ids: RouteId[]
}

export type OrderClientDto = {
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

export type OrderPassengerDto = {
  category: string
  title: string
  first_name: string
  last_name: string
  email: string
  birth_date: string
  phone: string
  ancillaries: LCCAncillary[]
}
