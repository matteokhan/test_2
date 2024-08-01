import { Stack } from '@mui/material'
import { ItineraryRoute } from '@/components'
import { useBooking } from '@/contexts'

export const Itinerary = () => {
  const { selectedFlight } = useBooking()
  return (
    <Stack gap={1}>
      {selectedFlight?.routes.map((route) => <ItineraryRoute key={route.id} route={route} />)}
    </Stack>
  )
}
