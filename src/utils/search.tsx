// This is a function to block search if from or to is not in france or arround france

import { useAirportData } from '@/services'
import { SearchFlightsParams } from '@/types'

// Harcoded for now, we'll improve that later
const allowedAirport = ['BRU', 'LUX', 'GVA', 'ZRH', 'BCN', 'BIO']
export const isValidSearch = (params: SearchFlightsParams) => {
  console.log('oh')
  console.log(params)
  if (params._type === 'oneWay' || params._type === 'roundTrip') {
    console.log('hey')
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
