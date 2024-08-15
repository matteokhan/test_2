export type AirlineData = {
  code: string
  name: string
  logo_small_path: string | null
  logo_medium_path: string | null
}

export type Airlines = {
  [code: string]: AirlineData
}
