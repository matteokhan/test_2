export type SearchFlightSegment = {
  from: string
  to: string
  date: string
}

export type OneWayFlightSearchParams = {
  _type: 'oneWay'
  from: string
  to: string
  departure: string
  adults: number
  childrens: number
  infant: number
}

export type RoundTripFlightSearchParams = {
  _type: 'roundTrip'
  from: string
  to: string
  departure: string
  return: string
  adults: number
  childrens: number
  infant: number
}

export type MultiDestinationsFlightSearchParams = {
  _type: 'multiDestinations'
  destinations: {
    from: string
    to: string
    departure: string
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
  agencyCode: string
  adults: number
  childrens: number
  infant: number
  segments: SearchFlightSegment[]
}
