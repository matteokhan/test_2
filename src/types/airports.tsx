export type LocationData = {
  code: string
  name: string
  extension: string
  country_name: string
  region_name: string
  area_name: string
  category: 'City' | 'Airport' | 'Rail station'
}

export type Locations = {
  [code: string]: LocationData
}
