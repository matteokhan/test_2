import { CustomerSupport, SectionContainer, NewsletterForm } from '@/components'
import './Footer.css'
import { Box, Stack, Typography } from '@mui/material'

const SOCIAL_MEDIA_ICONS = {
  facebook:
    'https://wizard.leclercvoyages.com/admin/TS/fckUserFiles/Content_Image/Technique/styles/social-icons/facebook.svg',
  instagram:
    'https://wizard.leclercvoyages.com/admin/TS/fckUserFiles/Content_Image/Technique/styles/social-icons/instagram.svg',
  tiktok:
    'https://wizard.leclercvoyages.com/admin/TS/fckUserFiles/Content_Image/Technique/styles/social-icons/tiktok.svg',
  linkedin:
    'https://wizard.leclercvoyages.com/admin/TS/fckUserFiles/Content_Image/Technique/styles/social-icons/linkedin.svg',
}

type LinkItem = {
  label: string
  url: string
}

type SocialLinkItem = {
  platform: keyof typeof SOCIAL_MEDIA_ICONS
  url: string
}

type FooterColumnContentItem =
  | { type: 'footer_column_title'; value: string; id: string }
  | { type: 'footer_links'; value: LinkItem[]; id: string }
  | { type: 'footer_social_links'; value: SocialLinkItem[]; id: string }

type FooterColumn = {
  type: 'column'
  value: {
    footer_content: FooterColumnContentItem[]
  }
  id: string
}

type FooterData = {
  id: number
  title: string
  footer_columns: FooterColumn[]
  footer_paragraph: string
  meta: {
    type: string
    locale: string
    detail_url: string
    html_url: string | null
    slug: string
    show_in_menus: boolean
    seo_title: string
    search_description: string
    first_published_at: string
    alias_of: string | null
    parent: {
      id: number
      meta: {
        type: string
        detail_url: string
        html_url: string | null
      }
      title: string
    }
  }
}

const renderSocialLinks = (links: SocialLinkItem[]) => {
  return links.map((link, index) => (
    <a key={link.platform} href={link.url} style={{ marginLeft: index > 0 ? '5px' : '0' }}>
      <img
        style={{ width: '30px', height: '30px' }}
        alt={link.platform}
        src={SOCIAL_MEDIA_ICONS[link.platform]}
      />
    </a>
  ))
}

const renderLinksColumn = (column: FooterColumn) => {
  return column.value.footer_content.map((item) => {
    if (item.type === 'footer_column_title') {
      return (
        <Typography key={item.id} variant="titleMd" color="primary.light" mb={1.5} fontWeight={700}>
          {item.value}
        </Typography>
      )
    } else if (item.type === 'footer_links') {
      return (
        <Box mb={2}>
          {item.value.map((link) => (
            <Typography key={link.url} variant="bodyMd" sx={{ mb: 1 }}>
              <a target="_blank" rel="noopener" href={link.url}>
                {link.label}
              </a>
            </Typography>
          ))}
        </Box>
      )
    } else if (item.type === 'footer_social_links') {
      return <Box key={item.id}>{renderSocialLinks(item.value)}</Box>
    }
    return null
  })
}

async function getFooterData(): Promise<FooterData> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CMS_API_URL}/api/v2/pages/${process.env.FOOTER_CMS_PAGE_ID}/`,
    {
      next: { revalidate: 3600 }, // Cache for 1 hour
    },
  )
  return res.json()
}

export async function Footer() {
  const footerData = await getFooterData()

  const renderAllMobileLinks = () => {
    const allLinks: LinkItem[] = []

    footerData.footer_columns.forEach((column) => {
      column.value.footer_content.forEach((item) => {
        if (item.type === 'footer_links') {
          allLinks.push(...item.value)
        }
      })
    })

    return allLinks.map((link, index) => (
      <>
        <a key={link.url} target="_blank" rel="noopener" href={link.url}>
          {link.label}
        </a>
        {index < allLinks.length - 1 ? ' | ' : ''}
      </>
    ))
  }

  // Find social links for the mobile view
  const socialLinks = footerData.footer_columns
    .flatMap((column) => column.value.footer_content)
    .find((item) => item.type === 'footer_social_links') as
    | { type: 'footer_social_links'; value: SocialLinkItem[]; id: string }
    | undefined

  return (
    <SectionContainer>
      {/* Desktop View */}
      <Box sx={{ display: { xs: 'none', lg: 'block' }, my: 4 }}>
        <Stack direction="row" gap={2} mb={4}>
          {footerData.footer_columns.map((column) => (
            <Box key={column.id} flexGrow={1} width="25%">
              {renderLinksColumn(column)}
            </Box>
          ))}
          <Box flexGrow={1}>
            <Stack direction="row" gap={1}>
              <img
                alt=""
                src="https://wizard.leclercvoyages.com/admin/TS/fckUserFiles/Content_Image/footer/picto-mail-contact.png"
              />
              <Typography color="primary.light" variant="titleLg">
                Inscription newsletter
              </Typography>
            </Stack>
            <Typography variant="bodyMd" my={1.5}>
              J'accepte de recevoir les offres commerciales et newsletters de Voyages E.Leclerc
            </Typography>
            <Box sx={{ mb: 1 }}>
              <NewsletterForm />
            </Box>
            <CustomerSupport />
          </Box>
        </Stack>
        <Typography variant="bodySm">{footerData.footer_paragraph}</Typography>
      </Box>

      {/* Mobile View */}
      <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
        <Stack py="20px" gap={1}>
          <Stack alignItems="center">
            <Box bgcolor="white" py={1} px={2}>
              <CustomerSupport />
            </Box>
          </Stack>

          <Stack bgcolor="primary" gap={1} py={2}>
            <Stack direction="row" alignItems="center" gap={1}>
              <img
                alt=""
                src="https://wizard.leclercvoyages.com/admin/TS/fckUserFiles/Content_Image/footer/picto-mail-contact.png"
              />
              <label style={{ fontSize: '20px' }} className="primary">
                Inscription newsletter
              </label>
            </Stack>
            <p style={{ fontSize: '12px', color: 'grey.900' }}>
              J'accepte de recevoir les offres commerciales et newsletters de Voyages E.Leclerc
            </p>
            <NewsletterForm />
          </Stack>

          <Box fontSize="12px" color="grey.600" textAlign="center">
            {renderAllMobileLinks()}
          </Box>

          <p style={{ textAlign: 'center', fontSize: '12px', color: 'grey.600' }}>
            {footerData.footer_paragraph}
          </p>

          <Stack alignItems="center" gap={2}>
            <h4 className="primary">Suivez-nous sur</h4>
            <Stack direction="row" gap={1}>
              {socialLinks && renderSocialLinks(socialLinks.value)}
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </SectionContainer>
  )
}
