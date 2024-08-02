'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/theme'
import { FlightsProvider, BookingProvider } from '@/contexts'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <FlightsProvider>
            <BookingProvider>{children}</BookingProvider>
          </FlightsProvider>
        </LocalizationProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
