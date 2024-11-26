export type LocationCode = string
export type LocationData = {
  code: LocationCode
  name: string
  extension: string
  country_name: string
  country_code: string
  region_name: string
  area_name: string
  category: 'City' | 'Airport' | 'Rail station' | 'International airport' | 'Airport international'
}

export type Locations = {
  [code: LocationCode]: LocationData
}
