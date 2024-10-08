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

export type AncillaryServiceType = 'BAGGAGE'
