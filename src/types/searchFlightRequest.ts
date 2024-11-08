import { Prettify } from '@/types'

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

export type DepartureData = {
  from: string
  fromLabel: string
  fromCountry: string
  fromType: SearchFlightSegmentType
  fromInputValue: string
}

export type DestinationData = {
  to: string
  toLabel: string
  toCountry: string
  toType: SearchFlightSegmentType
  toInputValue: string
}

export type OneWayFlightSearchParams = Prettify<
  DepartureData &
    DestinationData & {
      _type: 'oneWay'
      departure: string
      adults: number
      childrens: number
      infants: number
    }
>

export type RoundTripFlightSearchParams = Prettify<
  DepartureData &
    DestinationData & {
      _type: 'roundTrip'
      departure: string
      return: string
      adults: number
      childrens: number
      infants: number
    }
>

export type MultiDestinationsFlightSearchParams = {
  _type: 'multiDestinations'
  destinations: Prettify<
    DepartureData &
      DestinationData & {
        departure: string
      }
  >[]
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
