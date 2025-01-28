import Script from 'next/script'
import { Suspense } from 'react'
import { PagesAPIBaseParams } from '@/types'
import { getEnvVar } from '@/utils'

type ScriptDto = {
  script_tag: string
  is_on_header: boolean
  priority: number
}

type ScriptTag = {
  src?: string
  content?: string
  onHeader: boolean
}

const parseScriptTags = (scriptDto: ScriptDto): ScriptTag[] => {
  const result = []
  const scriptRegex = /<script[^>]*>[\s\S]*?<\/script>/g
  const scriptTags = scriptDto.script_tag.match(scriptRegex) || []

  for (const scriptTag of scriptTags) {
    const srcMatch = scriptTag.match(/src=['"](.*?)['"]/)
    let r: ScriptTag = { onHeader: true }
    if (srcMatch) {
      r = { ...r, src: srcMatch[1] }
    } else {
      const content = scriptTag
        .replace(/<script[^>]*>/, '')
        .replace(/<\/script>/, '')
        .trim()
      r = { ...r, content }
    }
    result.push(r)
  }
  return result
}

const ScriptContent = ({ content }: { content: string }) => (
  <Script id="cms-script" strategy="afterInteractive">
    {content}
  </Script>
)

export const HeadScripts = async () => {
  const CMS_API_URL = getEnvVar({ name: 'NEXT_PUBLIC_CMS_API_URL' })
  try {
    const params: PagesAPIBaseParams = {
      type: 'frontend_scripts.ScriptTagPage',
      fields: '*',
    }
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, value as string)
    })
    const response = await fetch(`${CMS_API_URL}/api/v2/pages/?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) return null

    const data = await response.json()

    if (!data.items) return null

    const scripts: ScriptTag[] = []
    for (const script of data.items.filter((i: { is_on_header: boolean }) => i.is_on_header)) {
      const parsedScript = parseScriptTags(script)
      scripts.push(...parsedScript)
    }

    return (
      <Suspense fallback={null}>
        {scripts.map((script, index) => {
          if (script.src) {
            return <Script key={index} src={script.src} strategy="afterInteractive" />
          }

          return script.content ? <ScriptContent key={index} content={script.content} /> : null
        })}
      </Suspense>
    )
  } catch (error) {
    // TODO: log this somewhere
    console.error('Error in HeadScripts:', error)
    return null
  }
}

export const BodyScripts = async () => {
  const CMS_API_URL = getEnvVar({ name: 'NEXT_PUBLIC_CMS_API_URL' })
  try {
    const params: PagesAPIBaseParams = {
      type: 'frontend_scripts.ScriptTagPage',
      fields: '*',
    }
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, value as string)
    })
    const response = await fetch(`${CMS_API_URL}/api/v2/pages/?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) return null

    const data = await response.json()

    if (!data.items) return null

    const scripts: ScriptTag[] = []
    for (const script of data.items.filter((i: { is_on_header: boolean }) => !i.is_on_header)) {
      const parsedScript = parseScriptTags(script)
      scripts.push(...parsedScript)
    }

    return (
      <Suspense fallback={null}>
        {scripts.map((script, index) => {
          if (script.src) {
            return <Script key={index} src={script.src} strategy="afterInteractive" />
          }

          return script.content ? <ScriptContent key={index} content={script.content} /> : null
        })}
      </Suspense>
    )
  } catch (error) {
    // TODO: log this somewhere
    console.error('Error in BodyScripts:', error)
    return null
  }
}
