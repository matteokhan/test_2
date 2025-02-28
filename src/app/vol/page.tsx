import { FlightsLanding, Footer } from '@/components'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Réservation vol - billets d'avion Voyages E. Leclerc aux meilleurs prix",
}

export default function Home() {
  return (
    <>
      <FlightsLanding />
    </>
  )
}
