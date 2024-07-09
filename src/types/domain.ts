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
