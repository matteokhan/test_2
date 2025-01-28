import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import CssBaseline from '@mui/material/CssBaseline'
import { Providers, MuiXLicense, SelectAgencyDrawer } from '@/components'
import { PublicEnvScript } from 'next-runtime-env'
import './globals.css'
import 'dayjs/locale/fr'
import dayjs from 'dayjs'
import { HeadScripts } from '@/components'

dayjs.locale('fr')

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Voyages E. Leclerc',
  description:
    "Réservation vols lowcost ou vols réguliers. Trouvez vos billets d'avion Voyages E. Leclerc aux meilleurs prix",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <head>
        {/* Look at this to see why this is needed: https://github.com/vercel/next.js/discussions/44628 */}
        <PublicEnvScript />
        {/* <HeadScripts /> */}
      </head>
      {/* Overflow X visible is mandatory to make sticky components work */}
      <body className={inter.className} style={{ background: '#E6E6E6', overflowX: 'visible' }}>
        <CssBaseline />
        <MuiXLicense />
        <AppRouterCacheProvider>
          <Providers>
            <SelectAgencyDrawer />
            {children}
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
