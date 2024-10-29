export enum SearchFlightSegmentType {
  PLACE = 0, // Airports, train stations. Everything that's not a city
  CITY = 1,
}
export type SearchFlightSegment = {
  from: string
  to: string
  date: string
  fromType: SearchFlightSegmentType
  toType: SearchFlightSegmentType
}

export type OneWayFlightSearchParams = {
  _type: 'oneWay'
  from: string
  fromLabel: string
  fromCountry: string
  fromType: SearchFlightSegmentType
  to: string
  toLabel: string
  toCountry: string
  toType: SearchFlightSegmentType
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
  fromType: SearchFlightSegmentType
  to: string
  toLabel: string
  toCountry: string
  toType: SearchFlightSegmentType
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
    fromType: SearchFlightSegmentType
    to: string
    toLabel: string
    toCountry: string
    toType: SearchFlightSegmentType
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
  search_data: {
    adults: number
    childrens: number
    infant: number
    segments: SearchFlightSegment[]
  }
}
