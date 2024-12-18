import { WagtailPageMetadata } from '@/types'

export type AgencyOpeningMetaData = {
  type: 'agency.AgencyOpeningPage'
}

export type AgencyOpening = {
  id: number
  meta: AgencyOpeningMetaData
  day: string
  morning_open_time: string
  morning_close_time: string
  afternoon_open_time: string
  afternoon_close_time: string
}

export type AgencyMetaData = WagtailPageMetadata & {
  type: 'agency.AgencyPage'
}

export type AgencyContractCode = '3DS' | 'CB' | 'ANCV' | 'MULTI_CB'

export type AgencyId = number
export type Agency = {
  id: AgencyId
  meta: AgencyMetaData
  title: string
  code: string
  center_code: string
  id_base_adherent: string // TODO: What is this?
  name: string
  address: string
  address2: string
  postal_code: string
  city: string
  country: string
  phone: string
  email: string
  url: string
  corporate_name: string
  corporate_type: string
  corporate_capital_amount: string
  corporate_email: string
  corporate_registration_number: string
  iata: string
  iata_start_date: string
  iata_end_date: string
  legal_city: string
  legal_rcs_number: string
  legal_siret: number
  legal_vat: string
  financial_guarantee_name: string
  financial_guarantee_address: string
  financial_guarantee_address2: string
  financial_guarantee_postal_code: string
  financial_guarantee_city: string
  financial_guarantee_amount: string
  professional_civil_liability_name: string
  professional_civil_liability_address: string
  professional_civil_liability_address2: string
  professional_civil_liability_postal_code: string
  professional_civil_liability_city: string
  professional_civil_liability_amount: string
  gps_latitude: number
  gps_longitude: number
  agency_openings: AgencyOpening[]
  available_contracts: AgencyContractCode[] | string
  status: 'open' | 'closed'
}
