import { WagtailPageMetadata } from '@/types'

export type FormalityMetaData = WagtailPageMetadata & {
  type: 'airport.FormalityPage'
}

export type Formality = {
  id: number
  meta: FormalityMetaData
  title: string
  country_code: string
  area_code: string
  description: string
}
