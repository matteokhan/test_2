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
  Ancillary,
} from '@/types'
import { useRouter } from 'next/navigation'
import { getInsurancePrice } from '@/utils'
import { CountryCallingCode } from 'libphonenumber-js'
import { useFlights } from '@/contexts'
import dayjs from 'dayjs'

type BookingContextType = {
  // Steps
  steps: React.MutableRefObject<BookingStepType[]>
  currentStep: React.MutableRefObject<number>
  goToFirstStep: () => void
  goNextStep: () => void
  goPreviousStep: () => void
  goToStep: (step: number | BookingStepCode) => void
  getStepIndexByPath: (pathname: string) => number
  getStepIndexByCode: (code: BookingStepCode) => number
  skipStep: (step: BookingStepCode) => void
  resetBooking: () => void

  // Select flight
  selectedFlight: Solution | null
  setSelectedFlight: (flight: Solution | null) => void
  preSelectedFlight: Solution | null
  setPreSelectedFlight: (flight: Solution | null) => void
  selectedFare: Solution | null
  setSelectedFare: React.Dispatch<React.SetStateAction<Solution | null>>
  departureDatetime: dayjs.Dayjs | null // This is the departure date of the first segment of the whole travel
  lastDepartureDatetime: dayjs.Dayjs | null // This is the departure date of the last segment of the whole travel

  // Passengers
  passengers: PassengerData[]
  setPassengers: React.Dispatch<React.SetStateAction<PassengerData[]>>
  payerIndex: number | null
  setPayerIndex: React.Dispatch<React.SetStateAction<number | null>>
  payer: PayerData | null
  setPayer: React.Dispatch<React.SetStateAction<PayerData | null>>

  // Options
  wereAncillariesSelected: boolean
  setWereAncillariesSelected: React.Dispatch<React.SetStateAction<boolean>>
  ancillaries: Ancillary[]
  setAncillaries: React.Dispatch<React.SetStateAction<Ancillary[]>>
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
  saveBookingState: () => void
  loadBookingState: () => void
  isBookingActive: boolean
  setIsBookingActive: React.Dispatch<React.SetStateAction<boolean>>
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
      name: 'Passagers',
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
  const { totalPassengers, searchParamsCache, setSearchParams } = useFlights()
  const currentStep = useRef(0)
  const [selectedFlight, setSelectedFlight] = useState<Solution | null>(null)
  const [preSelectedFlight, setPreSelectedFlight] = useState<Solution | null>(null)
  const [passengers, setPassengers] = useState<PassengerData[]>([])
  const [payerIndex, setPayerIndex] = useState<number | null>(null) // Index of the payer in the passengers array
  const [payer, setPayer] = useState<PayerData | null>(null)
  const [ancillaries, setAncillaries] = React.useState<Ancillary[]>([])
  const [wereAncillariesSelected, setWereAncillariesSelected] = React.useState(false)
  const [selectedFare, setSelectedFare] = React.useState<Solution | null>(null)
  const [selectedInsurance, setSelectedInsurance] = React.useState<InsuranceWithSteps | null>(null)
  const [pnr, setPnr] = useState<string | null>(null)
  const [order, setOrder] = useState<OrderDto | null>(null)
  const [isBookingActive, setIsBookingActive] = useState(false)
  const departureDatetime = selectedFare
    ? dayjs(selectedFare.routes[0].segments[0].departureDateTime)
    : null
  const lastDepartureDatetime = selectedFare
    ? dayjs(
        selectedFare.routes[selectedFare.routes.length - 1].segments[
          selectedFare.routes[selectedFare.routes.length - 1].segments.length - 1
        ].departureDateTime,
      )
    : null

  // Prices calculations
  const basePrice =
    (selectedFare ? selectedFare.priceInfo.total : selectedFlight?.priceInfo?.total || 0) +
    (ancillaries
      .flatMap((anc) => anc.segments)
      .flatMap((seg) => seg.ancillaries)
      .filter((anc) => anc.selected)
      .reduce((acc, curr) => acc + curr.price, 0) || 0) +
    (passengers.flatMap((p) => p.ancillaries).reduce((acc, curr) => acc + Number(curr.price), 0) ||
      0)
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
    setIsBookingActive(true)
    const firstStep = steps.current.filter((step) => !step.skip)[0]
    currentStep.current = getStepIndexByCode(firstStep.code)
    router.push(firstStep.url)
  }

  const goNextStep = () => {
    const nextStep = currentStep.current + 1
    if (nextStep === steps.current.length) {
      // TODO: log this somewhere
      return
    }
    if (steps.current[nextStep].skip) {
      currentStep.current = nextStep
      goNextStep()
      return
    }
    currentStep.current = nextStep
    router.push(steps.current[nextStep].url + `?order_id=${order?.id}`)
  }

  const goPreviousStep = () => {
    const previousStep = currentStep.current - 1
    if (previousStep < 0) {
      router.push('/search')
      return
    }
    if (steps.current[previousStep].skip) {
      currentStep.current = previousStep
      goPreviousStep()
      return
    }
    currentStep.current = previousStep
    router.push(steps.current[previousStep].url)
  }

  const goToStep = (step: number | BookingStepCode) => {
    let stepIndex = 0
    if (typeof step === 'number') {
      currentStep.current = step
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

  const resetBooking = () => {
    resetSteps()
    setWereAncillariesSelected(false)
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
          ancillaries: [],
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
          ancillaries: [],
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
          ancillaries: [],
        },
      ])
    }
    setPayerIndex(null)
    setPayer(null)
    setSelectedInsurance(null)
    setAncillaries([])
  }

  const saveBookingState = () => {
    localStorage.setItem(
      'booking',
      JSON.stringify({
        selectedFlight,
        passengers,
        payer,
        selectedFare,
        selectedInsurance,
        pnr,
        ancillaries,
        searchParamsCache,
        order,
      }),
    )
  }

  const loadBookingState = () => {
    const booking = localStorage.getItem('booking')
    if (booking) {
      let {
        selectedFlight,
        passengers,
        payer,
        selectedFare,
        selectedInsurance,
        pnr,
        ancillaries,
        searchParamsCache,
        order,
      } = JSON.parse(booking)
      let parsedPassengers: PassengerData[] = passengers.map((passenger: any) => ({
        ...passenger,
        dateOfBirth: dayjs(passenger.dateOfBirth),
      }))
      let parsedPayer: PayerData = { ...payer, dateOfBirth: dayjs(payer.dateOfBirth) }
      setSelectedFlight(selectedFlight)
      setPreSelectedFlight(selectedFlight)
      setPassengers(parsedPassengers)
      setPayer(parsedPayer)
      setSelectedFare(selectedFare)
      setSelectedInsurance(selectedInsurance)
      setPnr(pnr)
      setAncillaries(ancillaries)
      setSearchParams(searchParamsCache)
      setOrder(order)
    }
  }

  return (
    <BookingContext.Provider
      value={{
        selectedFlight,
        setSelectedFlight,
        preSelectedFlight,
        setPreSelectedFlight,
        departureDatetime,
        lastDepartureDatetime,
        steps,
        skipStep,
        resetBooking,
        goToFirstStep,
        passengers,
        setPassengers,
        payerIndex,
        setPayerIndex,
        currentStep,
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
        selectedFare,
        setSelectedFare,
        selectedInsurance,
        setSelectedInsurance,
        pnr,
        setPnr,
        order,
        setOrder,
        ancillaries,
        setAncillaries,
        wereAncillariesSelected,
        setWereAncillariesSelected,
        saveBookingState,
        loadBookingState,
        isBookingActive,
        setIsBookingActive,
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
