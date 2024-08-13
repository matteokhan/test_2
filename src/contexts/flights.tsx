'use client'

import { SearchFlightsParams, SearchFlightSegment, SearchFlightsParamsDto } from '@/types'
import { searchParamsToDto } from '@/utils'
import React, { createContext, useState, useContext } from 'react'

type FlightsContextType = {
  searchParams: SearchFlightsParams | undefined
  setSearchParams: (params: SearchFlightsParams) => void
  searchParamsDto: SearchFlightsParamsDto | undefined
  firstSegment: SearchFlightSegment | undefined
  lastSegment: SearchFlightSegment | undefined
  totalPassengers: number
  flightDetailsOpen: boolean
  setFlightDetailsOpen: (open: boolean) => void
}

const FlightsContext = createContext<FlightsContextType | undefined>(undefined)

export const FlightsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useState<SearchFlightsParams | undefined>()
  const searchParamsDto = searchParamsToDto(searchParams)
  const firstSegment = searchParamsDto?.segments[0]
  const lastSegment = searchParamsDto?.segments[searchParamsDto.segments.length - 1]
  const totalPassengers =
    (searchParams?.adults || 0) + (searchParams?.childrens || 0) + (searchParams?.infant || 0)
  const [flightDetailsOpen, setFlightDetailsOpen] = useState(false)

  return (
    <FlightsContext.Provider
      value={{
        searchParams,
        setSearchParams,
        searchParamsDto,
        firstSegment,
        lastSegment,
        totalPassengers,
        flightDetailsOpen,
        setFlightDetailsOpen,
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
