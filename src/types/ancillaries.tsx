import { CorrelationId, PNR } from '@/types'

export type AncillariesRequestDto = {
  correlationId: CorrelationId
  pnr: PNR
}

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
  selected: false
}

export type AncillaryServiceType = 'BAGGAGE'
