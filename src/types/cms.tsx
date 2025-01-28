export type PagesTypes =
  | 'agency.AgencyPage'
  | 'insurance.InsurancePage'
  | 'frontend_scripts.ScriptTagPage'

export type PagesAPIBaseParams = {
  type?: PagesTypes
  fields?: string
  search?: string
  offset?: number
  limit?: number
}

export type WagtailImageMetadata = {
  type: 'wagtailimages.Image'
  detail_url: string
  download_url: string
}

export type WagtailPageMetadata = {
  type: PagesTypes
  detail_url: string
  html_url: string | null
  slug: string
  show_in_menus: boolean
  seo_title: string
  search_description: string
  first_published_at: string
  alias_of: string | null
  locale: string
}
