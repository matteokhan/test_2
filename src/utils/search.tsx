import { SearchFlightsParams } from '@/types'

// TODO: Harcoded for now, we'll improve that later
const allowedAirport = ['BRU', 'LUX', 'GVA', 'ZRH', 'BCN', 'BIO']

// This is a function to block search if from or to is not in france or arround france
export const isFrenchFlight = (params: SearchFlightsParams) => {
  if (params._type === 'oneWay' || params._type === 'roundTrip') {
    if (params.fromCountry === 'France' || params.toCountry === 'France') {
      return true
    }
    if (allowedAirport.includes(params.from) || allowedAirport.includes(params.to)) {
      return true
    }
  }
  return false
}

// These are countries that user is required to have a return ticket to enter
const rountripRestrictedCountries = [
  'US',
  'CA',
  'MX',
  'BR',
  'TH',
  'ID',
  'CR',
  'PA',
  'PH',
  'JP',
  'AU',
  'NZ',
]

export const isRoundtripRestricted = (params: SearchFlightsParams) => {
  if (params._type === 'oneWay' && rountripRestrictedCountries.includes(params.toCountryCode)) {
    return true
  }
  return false
}
