export type CorrelationId = string
export type SolutionId = string
export type RouteId = string
export type SegmentId = string

export type SearchResponseFilterData = {
  minPrice: number
  maxPrice: number
  allCarriers: string[]
  allCabinClasses: string[]
  allStops: number[]
}

export type SearchResponseDto = {
  correlationId: CorrelationId
  solutions: Solution[]
  searchFilters: SearchResponseFilterData
}

export type Solution = {
  id: SolutionId
  routes: Route[]
  ticket: string
  priceInfo: PriceInfo
  adults: PassengerTypeInfo
  childrens: PassengerTypeInfo
  infants?: PassengerTypeInfo | null
  provider: string
  platingCarrier: string
}

export type Route = {
  id: RouteId
  segments: RouteSegment[]
  travelTime: string
  nightsBeforeRoute?: number
  stopNumber: number
  carrier: string
  airportChange: boolean
  totalStopDuration?: string
  baggages?: number
}

export type RouteSegment = {
  id: SegmentId
  departure: string
  departureCityCode: string
  departureDateTime: string
  arrival: string
  arrivalCityCode: string
  arrivalDateTime: string
  carrier: string
  flightNumber: string
  operatingCarrier: string
  operatingFlightNumber?: string | null
  duration: string
  cabinClass: number
  cabinClassName: string
  equipment: string
  timeBeforeSegment: string
  fare: Fare
}

type Fare = {
  fareBasis: string
  baggagePieces: number
  brandId: string
  name: string
  baggageWeight: string
  options: FareOption[]
}

type FareOption = {
  description: string
  indicator: string
}

type PriceInfo = {
  total: number
  tax: number
  currencyCode: string
  currencySymbol: string
  passengerNumber: number
}

type PassengerTypeInfo = {
  number: number
  type?: 'ADT' | 'CHD' | 'INF'
  tax: number
  pricePerPerson: number
  total: number
  currencyCode: string
  currencySymbol: string
}
