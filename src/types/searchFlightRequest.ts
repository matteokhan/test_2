export type SearchFlightSegment = {
  from: string
  to: string
  date: Date
}

export type OneWayFlightSearchParams = {
  _type: 'oneWay'
  from: string
  to: string
  departure: Date
  adults: number
  childrens: number
  infant: number
}

export type RoundTripFlightSearchParams = {
  _type: 'roundTrip'
  from: string
  to: string
  departure: Date
  return: Date
  adults: number
  childrens: number
  infant: number
}

export type MultiDestinationsFlightSearchParams = {
  _type: 'multiDestinations'
  destinations: {
    from: string
    to: string
    departure: Date
  }[]
  adults: number
  childrens: number
  infant: number
}

export type SearchFlightsParams =
  | OneWayFlightSearchParams
  | RoundTripFlightSearchParams
  | MultiDestinationsFlightSearchParams

export type SearchFlightsParamsDto = {
  adults: number
  childrens: number
  infant: number
  segments: SearchFlightSegment[]
}
