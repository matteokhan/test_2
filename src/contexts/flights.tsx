'use client'

import { SearchFlightsParams, SearchFlightSegment, SearchFlightsParamsDto } from '@/types'
import { searchParamsToDto } from '@/utils'
import React, { createContext, useState, useContext } from 'react'

type FlightsContextType = {
  setSearchParams: (params: SearchFlightsParams) => void
  searchParamsDto: SearchFlightsParamsDto | undefined
  setSearchParamsDto: (params: SearchFlightsParamsDto) => void
  searchParamsCache: SearchFlightsParams | undefined
  firstSegment: SearchFlightSegment | undefined
  lastSegment: SearchFlightSegment | undefined
  totalPassengers: number
  flightDetailsOpen: boolean
  setFlightDetailsOpen: (open: boolean) => void
}

const FlightsContext = createContext<FlightsContextType | undefined>(undefined)

export const FlightsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchParamsDto, setSearchParamsDto] = useState<SearchFlightsParamsDto | undefined>()
  const [searchParamsCache, setSearchParamsCache] = useState<SearchFlightsParams | undefined>()
  const firstSegment = searchParamsDto?.segments[0]
  const lastSegment = searchParamsDto?.segments[searchParamsDto.segments.length - 1]
  const totalPassengers =
    (searchParamsDto?.adults || 0) +
    (searchParamsDto?.childrens || 0) +
    (searchParamsDto?.infant || 0)
  const [flightDetailsOpen, setFlightDetailsOpen] = useState(false)

  const setSearchParams = (params: SearchFlightsParams) => {
    const searchParamsDto = searchParamsToDto(params)
    setSearchParamsDto(searchParamsDto)
    setSearchParamsCache(params)
  }

  return (
    <FlightsContext.Provider
      value={{
        setSearchParams,
        searchParamsDto,
        setSearchParamsDto,
        searchParamsCache,
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
