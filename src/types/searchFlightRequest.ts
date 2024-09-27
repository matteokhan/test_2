export type SearchFlightSegment = {
  from: string
  to: string
  date: string
}

export type OneWayFlightSearchParams = {
  _type: 'oneWay'
  from: string
  fromLabel: string
  fromCountry: string
  to: string
  toLabel: string
  toCountry: string
  departure: string
  adults: number
  childrens: number
  infants: number
}

export type RoundTripFlightSearchParams = {
  _type: 'roundTrip'
  from: string
  fromLabel: string
  fromCountry: string
  to: string
  toLabel: string
  toCountry: string
  departure: string
  return: string
  adults: number
  childrens: number
  infants: number
}

export type MultiDestinationsFlightSearchParams = {
  _type: 'multiDestinations'
  destinations: {
    from: string
    fromLabel: string
    fromCountry: string
    to: string
    toLabel: string
    toCountry: string
    departure: string
  }[]
  adults: number
  childrens: number
  infants: number
}

export type SearchFlightsParams =
  | OneWayFlightSearchParams
  | RoundTripFlightSearchParams
  | MultiDestinationsFlightSearchParams

export type SearchFlightsParamsDto = {
  agencyCode: string
  adults: number
  childrens: number
  infants: number
  segments: SearchFlightSegment[]
}
