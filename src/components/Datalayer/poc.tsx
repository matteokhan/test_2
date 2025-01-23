import Script from 'next/script'
import { env } from 'next-runtime-env'
import { Suspense } from 'react'

const CMS_API_URL = env('NEXT_PUBLIC_CMS_API_URL') || ''

const parseScriptTags = (content: string): { src?: string; content?: string }[] => {
  const result = []
  const scriptRegex = /<script[^>]*>[\s\S]*?<\/script>/g
  const scriptTags = content.match(scriptRegex) || []

  for (const scriptTag of scriptTags) {
    const srcMatch = scriptTag.match(/src=['"](.*?)['"]/)
    if (srcMatch) {
      result.push({ src: srcMatch[1] })
    } else {
      const content = scriptTag
        .replace(/<script[^>]*>/, '')
        .replace(/<\/script>/, '')
        .trim()
      result.push({ content })
    }
  }

  return result
}

const ScriptContent = ({ content }: { content: string }) => (
  <Script id="cms-script" strategy="afterInteractive">
    {content}
  </Script>
)

export const Datalayer = async () => {
  try {
    // const response = await fetch(`${CMS_API_URL}/api/v2/pages/9379/`, {
    const response = await fetch(`${CMS_API_URL}/api/v2/pages/9382/`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) return null

    const data = await response.json()

    if (!data.description) return null

    const scripts = parseScriptTags(data.description)

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
    console.error('Error in Datalayer:', error)
    return null
  }
}
