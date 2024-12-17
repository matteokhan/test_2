import { SearchFlightsParams } from '@/types'

// TODO: Harcoded for now, we'll improve that later
const allowedAirport = ['BRU', 'LUX', 'GVA', 'ZRH', 'BCN', 'BIO']

// This is a function to block search if from or to is not in france or arround france
export const isValidSearch = (params: SearchFlightsParams) => {
  if (params._type === 'oneWay' || params._type === 'roundTrip') {
    if (params.fromCountry && params.toCountry) {
      if (params.fromCountry === 'France' || params.toCountry === 'France') {
        return true
      }
      if (allowedAirport.includes(params.from) || allowedAirport.includes(params.to)) {
        return true
      }
    }
  }
  return false
}
