'use client'

import React, { createContext, useContext, useState } from 'react'
import {
  PassengerData,
  BookingStep as BookingStepType,
  PayerData,
  Solution,
  Fare,
  Insurance,
  Agency,
  CorrelationId,
  ReservationId,
} from '@/types'
import { useRouter } from 'next/navigation'
import { useFlights } from './flights'
import dayjs from 'dayjs'

type BookingContextType = {
  // Steps
  steps: BookingStepType[]
  currentStep: number
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
  currentStepTitle: string
  goNextStep: () => void
  goPreviousStep: () => void
  goToStep: (step: number) => void
  getStepIndexByPath: (pathname: string) => number

  // Select flight
  selectedFlight: Solution | null
  setSelectedFlight: (flight: Solution | null) => void
  preSelectedFlight: Solution | null
  setPreSelectedFlight: (flight: Solution | null) => void
  selectFlight: (flight: Solution | null) => void

  // Passengers
  passengers: PassengerData[]
  setPassengers: React.Dispatch<React.SetStateAction<PassengerData[]>>
  payerIndex: number | null
  setPayerIndex: React.Dispatch<React.SetStateAction<number | null>>
  payer: PayerData | null
  setPayer: React.Dispatch<React.SetStateAction<PayerData | null>>

  // Options
  mapIsOpen: boolean
  setMapIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedFare: Fare | null
  setSelectedFare: React.Dispatch<React.SetStateAction<Fare | null>>
  selectedInsurance: Insurance | null
  setSelectedInsurance: React.Dispatch<React.SetStateAction<Insurance | null>>
  selectedAgency: Agency | null
  setSelectedAgency: React.Dispatch<React.SetStateAction<Agency | null>>

  // Reservation
  totalPrice: number
  correlationId: CorrelationId | null
  setCorrelationId: React.Dispatch<React.SetStateAction<CorrelationId | null>>
  reservationId: ReservationId | null
  setReservationId: React.Dispatch<React.SetStateAction<ReservationId | null>>
  pnr: string | null
  setPnr: React.Dispatch<React.SetStateAction<string | null>>
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter()
  const { totalPassengers, searchParamsCache } = useFlights()
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
  const [selectedFlight, setSelectedFlight] = useState<Solution | null>(null)
  const [preSelectedFlight, setPreSelectedFlight] = useState<Solution | null>(null)
  const [passengers, setPassengers] = useState<PassengerData[]>([])
  const [payerIndex, setPayerIndex] = useState<number | null>(null) // Index of the payer in the passengers array
  const [payer, setPayer] = useState<PayerData | null>(null)
  const [mapIsOpen, setMapIsOpen] = React.useState(false)
  const [selectedFare, setSelectedFare] = React.useState<Fare | null>(null)
  const [selectedInsurance, setSelectedInsurance] = React.useState<Insurance | null>(null)
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null)
  const [correlationId, setCorrelationId] = useState<string | null>(null)
  const [reservationId, setReservationId] = useState<string | null>(null)
  const [pnr, setPnr] = useState<string | null>(null)
  const totalPrice =
    (selectedFlight?.priceInfo?.total || 0) + (selectedInsurance?.amount || 0) * totalPassengers

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
    for (let i = 0; i < (searchParamsCache?.adults || 0); i++) {
      setPassengers((prev) => [
        ...prev,
        {
          salutation: null,
          firstName: '',
          lastName: '',
          dateOfBirth: dayjs().subtract(18, 'years'),
          phoneNumber: '',
          type: 'ADT',
          isPayer: i === 0,
        },
      ])
    }
    for (let i = 0; i < (searchParamsCache?.childrens || 0); i++) {
      setPassengers((prev) => [
        ...prev,
        {
          salutation: null,
          firstName: '',
          lastName: '',
          dateOfBirth: dayjs(),
          phoneNumber: '',
          type: 'CHD',
          isPayer: false,
        },
      ])
    }
    for (let i = 0; i < (searchParamsCache?.infant || 0); i++) {
      setPassengers((prev) => [
        ...prev,
        {
          salutation: null,
          firstName: '',
          lastName: '',
          dateOfBirth: dayjs(),
          phoneNumber: '',
          type: 'INF',
          isPayer: false,
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
        correlationId,
        setCorrelationId,
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
        reservationId,
        setReservationId,
        pnr,
        setPnr,
        selectedAgency,
        setSelectedAgency,
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
