import { AirportData } from '@/types'

export const airportName = (airportData?: AirportData) => {
  if (!airportData) return ''
  return airportData.name
}

export const airportNameExtension = (airportData?: AirportData) => {
  if (!airportData) return ''
  if (!airportData.extension) return airportData.name
  return airportData.name + ' ' + airportData.extension
}
