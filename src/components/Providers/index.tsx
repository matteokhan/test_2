'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/theme'
import {
  FlightsProvider,
  BookingProvider,
  UserLocationProvider,
  AgencySelectorProvider,
} from '@/contexts'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { APIProvider as GMapsProvider } from '@vis.gl/react-google-maps'
import { env } from 'next-runtime-env'
import 'dayjs/locale/fr'

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  const NEXT_PUBLIC_MAPS_API_KEY = env('NEXT_PUBLIC_MAPS_API_KEY') || ''
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" position="top" />
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
          <GMapsProvider apiKey={NEXT_PUBLIC_MAPS_API_KEY}>
            <UserLocationProvider>
              <AgencySelectorProvider>
                <FlightsProvider>
                  <BookingProvider>{children}</BookingProvider>
                </FlightsProvider>
              </AgencySelectorProvider>
            </UserLocationProvider>
          </GMapsProvider>
        </LocalizationProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
