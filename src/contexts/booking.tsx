'use client'

import React, { createContext, useContext, useRef, useState } from 'react'
import {
  PassengerData,
  BookingStep as BookingStepType,
  PayerData,
  Solution,
  BookingStepCode,
  OrderDto,
  InsuranceWithSteps,
} from '@/types'
import { useRouter } from 'next/navigation'
import { getInsurancePrice } from '@/utils'
import { CountryCallingCode } from 'libphonenumber-js'
import { useFlights } from '@/contexts'

type BookingContextType = {
  // Steps
  steps: React.MutableRefObject<BookingStepType[]>
  currentStep: number
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
  goToFirstStep: () => void
  goNextStep: () => void
  goPreviousStep: () => void
  goToStep: (step: number | BookingStepCode) => void
  getStepIndexByPath: (pathname: string) => number
  getStepIndexByCode: (code: BookingStepCode) => number
  skipStep: (step: BookingStepCode) => void
  resetSteps: () => void

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
  selectedFare: Solution | null
  setSelectedFare: React.Dispatch<React.SetStateAction<Solution | null>>
  selectedInsurance: InsuranceWithSteps | null
  setSelectedInsurance: React.Dispatch<React.SetStateAction<InsuranceWithSteps | null>>

  // Order & Reservation
  basePrice: number // Price with no insurance
  totalInsurancePrice: number // Insurance price for all passengers
  totalPrice: number
  pnr: string | null
  setPnr: React.Dispatch<React.SetStateAction<string | null>>
  order: OrderDto | null
  setOrder: React.Dispatch<React.SetStateAction<OrderDto | null>>
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const steps = useRef<BookingStepType[]>([
    {
      code: 'fares',
      name: 'Tarif billet',
      url: '/booking/fares',
      title: 'Selectionnez votre tarif',
      skip: false,
    },
    {
      code: 'passengers',
      name: 'Passagers et bagages',
      url: '/booking/passengers',
      title: 'Qui sont les passagers ?',
      skip: false,
    },
    {
      code: 'contact',
      name: 'Coordonnées',
      url: '/booking/contact',
      title: 'Informations et création de votre dossier',
      skip: false,
    },
    {
      code: 'ancillaries',
      name: 'Bagages et options',
      url: '/booking/ancillaries',
      title: 'Bagages et options',
      skip: false,
    },
    {
      code: 'insurances',
      name: 'Assurez votre voyage',
      url: '/booking/insurance',
      title: 'Assurez votre voyage',
      skip: false,
    },
    {
      code: 'summary',
      name: 'Récapitulatif et paiement',
      url: '/booking/summary',
      title: 'Récapitulatif et paiement',
      skip: false,
    },
  ])

  const router = useRouter()
  const { totalPassengers, searchParamsCache } = useFlights()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedFlight, setSelectedFlight] = useState<Solution | null>(null)
  const [preSelectedFlight, setPreSelectedFlight] = useState<Solution | null>(null)
  const [passengers, setPassengers] = useState<PassengerData[]>([])
  const [payerIndex, setPayerIndex] = useState<number | null>(null) // Index of the payer in the passengers array
  const [payer, setPayer] = useState<PayerData | null>(null)
  const [mapIsOpen, setMapIsOpen] = React.useState(false)
  const [selectedFare, setSelectedFare] = React.useState<Solution | null>(null)
  const [selectedInsurance, setSelectedInsurance] = React.useState<InsuranceWithSteps | null>(null)
  const [pnr, setPnr] = useState<string | null>(null)
  const [order, setOrder] = useState<OrderDto | null>(null)

  // Prices calculations
  const basePrice = selectedFare
    ? selectedFare.priceInfo.total
    : selectedFlight?.priceInfo?.total || 0
  const selectedInsurancePrice: number = selectedInsurance
    ? getInsurancePrice(basePrice, selectedInsurance, totalPassengers)
    : 0
  const totalInsurancePrice = selectedInsurancePrice * totalPassengers
  const totalPrice = basePrice + totalInsurancePrice

  const getStepIndexByPath = (pathname: string) => {
    return steps.current.findIndex((s) => s.url.includes(pathname))
  }

  const getStepIndexByCode = (code: BookingStepCode) => {
    return steps.current.findIndex((s) => s.code === code)
  }

  const goToFirstStep = () => {
    const firstStep = steps.current.filter((step) => !step.skip)[0]
    setCurrentStep(getStepIndexByCode(firstStep.code))
    router.push(firstStep.url)
  }

  const goNextStep = () => {
    const nextStep = currentStep + 1
    if (nextStep === steps.current.length) {
      // TODO: log this somewhere
      return
    }
    setCurrentStep(nextStep)
    router.push(steps.current[nextStep].url)
  }

  const goPreviousStep = () => {
    // TODO: bug here bc previous can be skipped
    const previousStep = currentStep - 1
    if (previousStep < 0) {
      router.push('/flights')
      return
    }
    setCurrentStep(previousStep)
    router.push(steps.current[previousStep].url)
  }

  const goToStep = (step: number | BookingStepCode) => {
    let stepIndex = 0
    if (typeof step === 'number') {
      setCurrentStep(step)
      stepIndex = step
    } else {
      stepIndex = getStepIndexByCode(step)
    }
    router.push(steps.current[stepIndex].url)
  }

  const skipStep = (step: BookingStepCode) => {
    const stepIndex = getStepIndexByCode(step)
    const newStep = { ...steps.current[stepIndex], skip: true }
    steps.current[stepIndex] = newStep
  }

  const resetSteps = () => {
    steps.current = steps.current.map((step) => ({ ...step, skip: false }))
  }

  const selectFlight = (flight: Solution | null) => {
    setSelectedFlight(flight)
    setPassengers((prev) => [])
    for (let i = 0; i < (searchParamsCache?.adults || 0); i++) {
      setPassengers((prev) => [
        ...prev,
        {
          salutation: null,
          firstName: '',
          lastName: '',
          dateOfBirth: null,
          phoneNumber: '',
          phoneCode: '33' as CountryCallingCode,
          email: '',
          type: 'ADT',
          isPayer: false,
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
          dateOfBirth: null,
          phoneNumber: '',
          phoneCode: '33' as CountryCallingCode,
          email: '',
          type: 'CHD',
          isPayer: false,
        },
      ])
    }
    for (let i = 0; i < (searchParamsCache?.infants || 0); i++) {
      setPassengers((prev) => [
        ...prev,
        {
          salutation: null,
          firstName: '',
          lastName: '',
          dateOfBirth: null,
          phoneNumber: '',
          phoneCode: '33' as CountryCallingCode,
          email: '',
          type: 'INF',
          isPayer: false,
        },
      ])
    }
    setPayerIndex(null)
    setPayer(null)
    setSelectedFare(flight)
    setSelectedInsurance(null)
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
        skipStep,
        resetSteps,
        goToFirstStep,
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
        basePrice,
        totalInsurancePrice,
        totalPrice,
        getStepIndexByPath,
        getStepIndexByCode,
        mapIsOpen,
        setMapIsOpen,
        selectedFare,
        setSelectedFare,
        selectedInsurance,
        setSelectedInsurance,
        pnr,
        setPnr,
        order,
        setOrder,
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
