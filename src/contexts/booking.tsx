'use client'

import React, { createContext, useContext, useState } from 'react'
import {
  PassengerData,
  BookingStep as BookingStepType,
  PayerData,
  Solution,
  Fare,
  Insurance,
} from '@/types'
import { useRouter } from 'next/navigation'
import { useFlights } from './flights'

type BookingContextType = {
  selectedFlight: Solution | null
  setSelectedFlight: (flight: Solution | null) => void
  preSelectedFlight: Solution | null
  setPreSelectedFlight: (flight: Solution | null) => void
  selectFlight: (flight: Solution | null) => void
  steps: BookingStepType[]
  passengers: PassengerData[]
  setPassengers: React.Dispatch<React.SetStateAction<PassengerData[]>>
  payerIndex: number | null
  setPayerIndex: React.Dispatch<React.SetStateAction<number | null>>
  currentStep: number
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
  goNextStep: () => void
  goPreviousStep: () => void
  goToStep: (step: number) => void
  payer: PayerData | null
  setPayer: React.Dispatch<React.SetStateAction<PayerData | null>>
  totalPrice: number
  getStepIndexByPath: (pathname: string) => number
  mapIsOpen: boolean
  setMapIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  currentStepTitle: string
  selectedFare: Fare | null
  setSelectedFare: React.Dispatch<React.SetStateAction<Fare | null>>
  selectedInsurance: Insurance | null
  setSelectedInsurance: React.Dispatch<React.SetStateAction<Insurance | null>>
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter()
  const { totalPassengers } = useFlights()
  const [selectedFlight, setSelectedFlight] = useState<Solution | null>(null)
  const [preSelectedFlight, setPreSelectedFlight] = useState<Solution | null>(null)
  const steps: BookingStepType[] = [
    { name: 'Terif billet', url: '/booking/fares', title: 'Selectionnez votre tarif' },
    { name: 'Passagers et bagages', url: '/booking/passengers', title: 'Qui sont les passagers ?' },
    {
      name: 'Coordonnées',
      url: '/booking/contact',
      title: 'Informations et création de votre dossier',
    },
    {
      name: 'Assurez votre voyage',
      url: '/booking/insurance',
      title: 'Assurez votre voyage',
    },
    {
      name: 'Récapitulatif et paiement',
      url: '/booking/summary',
      title: 'Récapitulatif et paiement',
    },
  ]
  const [currentStep, setCurrentStep] = useState(0)
  const currentStepTitle = steps[currentStep].title
  const [passengers, setPassengers] = useState<PassengerData[]>([])
  const [payerIndex, setPayerIndex] = useState<number | null>(null) // Index of the payer in the passengers array
  const [payer, setPayer] = useState<PayerData | null>(null)
  const totalPrice = selectedFlight?.priceInfo?.total || 0
  const [mapIsOpen, setMapIsOpen] = React.useState(false)
  const [selectedFare, setSelectedFare] = React.useState<Fare | null>(null)
  const [selectedInsurance, setSelectedInsurance] = React.useState<Insurance | null>(null)

  const goNextStep = () => {
    const nextStep = currentStep + 1
    if (nextStep === steps.length) {
      // TODO: log this somewhere
      return
    }
    setCurrentStep(nextStep)
    router.push(steps[nextStep].url)
  }

  const goPreviousStep = () => {
    const previousStep = currentStep - 1
    if (previousStep < 0) {
      router.push('/flights')
      return
    }
    setCurrentStep(previousStep)
    router.push(steps[previousStep].url)
  }

  const goToStep = (step: number) => {
    setCurrentStep(step)
    router.push(steps[step].url)
  }

  const selectFlight = (flight: Solution | null) => {
    setSelectedFlight(flight)
    setPassengers((prev) => [])
    // First passenger is the payer by default
    for (let i = 0; i < totalPassengers; i++) {
      setPassengers((prev) => [
        ...prev,
        {
          salutation: null,
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          phoneNumber: '',
          isPayer: i === 0,
        },
      ])
    }
    setPayerIndex(0)
  }

  const getStepIndexByPath = (pathname: string) => {
    return steps.findIndex((s) => s.url.includes(pathname))
  }

  return (
    <BookingContext.Provider
      value={{
        selectedFlight,
        setSelectedFlight,
        preSelectedFlight,
        setPreSelectedFlight,
        selectFlight,
        steps,
        passengers,
        setPassengers,
        payerIndex,
        setPayerIndex,
        currentStep,
        setCurrentStep,
        goNextStep,
        goPreviousStep,
        goToStep,
        payer,
        setPayer,
        totalPrice,
        getStepIndexByPath,
        mapIsOpen,
        setMapIsOpen,
        currentStepTitle,
        selectedFare,
        setSelectedFare,
        selectedInsurance,
        setSelectedInsurance,
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
