import { Currency } from '@/types'

export type Ancillary = {
  passenger: string
  segments: AncillarySegment[]
}

export type AncillarySegment = {
  segment: string
  ancillaries: AncillaryServiceInfo[]
}

export type AncillaryServiceInfo = {
  externalId: string
  code: string
  name: string
  type: AncillaryServiceType
  price: number
  currency: string
  selected: boolean
}

export type AncillaryServiceType = 'BAGGAGE' // TODO: add more types

export type LCCAncillaryCode = 'BaggageFee' // TODO: add more types

export type LCCAncillary = {
  code: LCCAncillaryCode
  baggagePieces: string
  baggageWeight: number
  price: string
  currency: Currency
  checkInType: number
  legIndex: number
}
