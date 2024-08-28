export type AirportData = {
  code: string
  name: string
  extension: string
  country_name: string
  region_name: string
  area_name: string
  category: 'City' | 'Airport'
}

export type Airports = {
  [code: string]: AirportData
}
