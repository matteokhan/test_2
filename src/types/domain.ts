export type SearchFlightSegment = {
  from: string
  to: string
  date: Date
}

export type SearchFlightParams = {
  adults: number
  children: number
  infants: number
  directFlight: boolean
  nonStopFlight: boolean
  segments: SearchFlightSegment[]
}

export type ScalesFilterOption = 'all' | 'direct' | '1-scale' | '2-scale'
export type ExperienceFilterOption = 'no-night-flight' | 'short-scales' | null
export type MaxPriceTypeFilterOption = 'per-person' | 'total'

export type SearchFlightFilters = {
  scales: ScalesFilterOption
  oneNightScale: boolean
  experience: ExperienceFilterOption
  maxPrice?: number
  maxPriceType: MaxPriceTypeFilterOption
}
