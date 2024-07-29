import React, { createContext, useContext, useState } from 'react'
import { PassengerData } from '@/types'

type PassengersContextType = {
  passengers: PassengerData[]
  setPassengers: React.Dispatch<React.SetStateAction<PassengerData[]>>
  payerIndex: number | null
  setPayerIndex: React.Dispatch<React.SetStateAction<number | null>>
}

const PassengersContext = createContext<PassengersContextType | undefined>(undefined)

export const PassengersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [passengers, setPassengers] = useState<PassengerData[]>([])
  const [payerIndex, setPayerIndex] = useState<number | null>(null)

  return (
    <PassengersContext.Provider value={{ passengers, setPassengers, payerIndex, setPayerIndex }}>
      {children}
    </PassengersContext.Provider>
  )
}

export const usePassengers = () => {
  const context = useContext(PassengersContext)
  if (context === undefined) {
    throw new Error('usePassengers must be used within a PassengersProvider')
  }
  return context
}
