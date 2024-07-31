'use client'

import { SearchFlightParamsDto, SearchFlightSegmentDto } from '@/types'
import React, { createContext, useState, useContext } from 'react'

type FlightsContextType = {
  searchParams: SearchFlightParamsDto
  setSearchParams: (params: SearchFlightParamsDto) => void
  firstSegment: SearchFlightSegmentDto | undefined
  lastSegment: SearchFlightSegmentDto | undefined
  totalPassengers: number
}

const FlightsContext = createContext<FlightsContextType | undefined>(undefined)

export const FlightsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useState<SearchFlightParamsDto>({
    adults: 1,
    childrens: 0,
    infant: 0,
    segments: [],
  })
  const firstSegment = searchParams.segments[0]
  const lastSegment = searchParams.segments[searchParams.segments.length - 1]
  const totalPassengers = searchParams.adults + searchParams.childrens + searchParams.infant

  return (
    <FlightsContext.Provider
      value={{
        searchParams,
        setSearchParams,
        firstSegment,
        lastSegment,
        totalPassengers,
      }}>
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
