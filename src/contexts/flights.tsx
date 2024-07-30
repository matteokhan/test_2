'use client'

import { SearchFlightParamsDto } from '@/types'
import React, { createContext, useState, useContext } from 'react'

type FlightsContextType = {
  searchParams: SearchFlightParamsDto
  setSearchParams: (params: SearchFlightParamsDto) => void
}

const FlightsContext = createContext<FlightsContextType | undefined>(undefined)

export const FlightsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useState<SearchFlightParamsDto>({
    adults: 1,
    childrens: 0,
    infant: 0,
    segments: [],
  })

  return (
    <FlightsContext.Provider value={{ searchParams, setSearchParams }}>
      {children}
    </FlightsContext.Provider>
  )
}

export const useFlights = () => {
  const context = useContext(FlightsContext)
  if (context === undefined) {
    throw new Error('useFlights must be used within a FlightsProvider')
  }
  return context
}
