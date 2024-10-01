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
  flightTimeReturn?: FlightTimeFilterOption
  airlinesSelected?: string[]
  airportsSelected?: AirportFilterData[]
  routes: {
    routeIndex: number
    departureAirports: string[]
    arrivalAirports: string[]
  }[]
}
export type AirlineFilterData = {
  carrier: string
  price: number
  currencySymbol: string
}

export type AirportFilterData = {
  routeIndex: number
  from: string[]
  to: string[]
}
