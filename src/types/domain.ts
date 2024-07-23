export type SearchFlightSegment = {
  from: string
  to: string
  date: Date
}

export type SearchFlightParams = {
  adults: number
  childrens: number
  infant: number
  directFlight: boolean
  nonStopFlight: boolean
  segments: SearchFlightSegment[]
}

export type ScalesFilterOption = 'all' | 'direct' | '1-scale' | '2-scale'
export type ExperienceFilterOption = 'no-night-flight' | 'short-scales' | null
export type MaxPriceTypeFilterOption = 'per-person' | 'total'
export type FlightTimeFilterOption = '0-6' | '6-12' | '12-18' | '18-24' | null

export type SearchFlightFilters = {
  scales?: ScalesFilterOption
  oneNightScale?: boolean
  experience?: ExperienceFilterOption
  maxPrice?: number
  maxPriceType?: MaxPriceTypeFilterOption
  flightTime?: FlightTimeFilterOption
}

export type SearchFlightSegmentDto = {
  from: string
  to: string
  date: string
}

export type SearchFlightParamsDto = {
  adults: number
  childrens: number
  infant: number
  // directFlight: boolean
  // nonStopFlight: boolean
  segments: SearchFlightSegmentDto[]
}

export type SearchResponseFilterData = {
  minPrice: number
  maxPrice: number
  allCarriers: string[]
  allCabinClasses: string[]
  allStops: number[]
}

export type SearchResponseDto = {
  correlationId: string
  solutions: Solution[]
  searchFilters: SearchResponseFilterData
}

export type Solution = {
  id: string
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
  id: string
  segments: RouteSegment[]
  travelTime: string
  nightsBeforeRoute?: number
  stopNumber?: number
}

type RouteSegment = {
  id: string
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
  // hourBeforeNextSegment: number
}

type PriceInfo = {
  total: number
  tax: number
  currencyCode: string
  currencySymbol: string
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
