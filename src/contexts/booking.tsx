'use client'

import React, { createContext, useContext, useState } from 'react'
import { PassengerData, BookingStep as BookingStepType, PayerData, Solution } from '@/types'
import { useRouter } from 'next/navigation'

type BookingContextType = {
  selectedFlight: Solution | null
  setSelectedFlight: (flight: Solution | null) => void
  preSelectedFlight: Solution | null
  setPreSelectedFlight: (flight: Solution | null) => void
  steps: BookingStepType[]
  passengers: PassengerData[]
  setPassengers: React.Dispatch<React.SetStateAction<PassengerData[]>>
  payerIndex: number | null
  setPayerIndex: React.Dispatch<React.SetStateAction<number | null>>
  currentStep: number
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
  goNextStep: () => void
  payer: PayerData | null
  setPayer: React.Dispatch<React.SetStateAction<PayerData | null>>
  totalPrice: number
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter()
  const [selectedFlight, setSelectedFlight] = useState<Solution | null>(null)
  const [preSelectedFlight, setPreSelectedFlight] = useState<Solution | null>(null)
  const steps: BookingStepType[] = [
    { name: 'Passagers et bagages', url: '/booking/passengers' },
    { name: 'Coordonnées', url: '/booking/contact' },
    { name: 'Récapitulatif et paiement', url: '/booking/summary' },
    // { name: 'Choix des options', url: '/booking/options' },
    // { name: 'Choix des sièges', url: '/booking/seats' },
  ]
  const [currentStep, setCurrentStep] = useState(0)
  const [passengers, setPassengers] = useState<PassengerData[]>([])
  const [payerIndex, setPayerIndex] = useState<number | null>(null) // Index of the payer in the passengers array
  const [payer, setPayer] = useState<PayerData | null>(null)
  const totalPrice = selectedFlight?.priceInfo?.total || 0

  const goNextStep = () => {
    // TODO: validate there is a next step
    const nextStep = currentStep + 1
    setCurrentStep(nextStep)
    router.push(steps[nextStep].url)
  }

  return (
    <BookingContext.Provider
      value={{
        selectedFlight,
        setSelectedFlight,
        preSelectedFlight,
        setPreSelectedFlight,
        steps,
        passengers,
        setPassengers,
        payerIndex,
        setPayerIndex,
        currentStep,
        setCurrentStep,
        goNextStep,
        payer,
        setPayer,
        totalPrice,
      }}>
      {children}
    </BookingContext.Provider>
  )
}

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}
