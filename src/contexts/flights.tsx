'use client'

import {
  SearchFlightsParams,
  SearchFlightSegment,
  SearchFlightsParamsDto,
  LocationData,
} from '@/types'
import { searchParamsToDto } from '@/utils'
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'

type FlightsContextType = {
  setSearchParams: (params: SearchFlightsParams) => void
  searchParamsDto: SearchFlightsParamsDto | undefined
  setSearchParamsDto: (params: SearchFlightsParamsDto) => void
  searchParamsCache: SearchFlightsParams | undefined
  departureCache: LocationData | undefined
  destinationCache: LocationData | undefined
  firstSegment: SearchFlightSegment | undefined
  lastSegment: SearchFlightSegment | undefined
  totalPassengers: number
  flightDetailsOpen: boolean
  setFlightDetailsOpen: (open: boolean) => void
  isOneWay: boolean
}

const FlightsContext = createContext<FlightsContextType | undefined>(undefined)

export const FlightsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchParamsDto, setSearchParamsDto] = useState<SearchFlightsParamsDto | undefined>()
  const [searchParamsCache, setSearchParamsCache] = useState<SearchFlightsParams | undefined>()
  const [departureCache, setDepartureCache] = useState<LocationData | undefined>()
  const [destinationCache, setDestinationCache] = useState<LocationData | undefined>()
  const firstSegment = searchParamsDto?.search_data.segments[0]
  const lastSegment =
    searchParamsDto?.search_data.segments[searchParamsDto?.search_data.segments.length - 1]
  const isOneWay = searchParamsDto?.search_data.segments.length === 1
  const totalPassengers: number = +(
    (searchParamsDto?.search_data.adults || 0) +
    (searchParamsDto?.search_data.childrens || 0) +
    (searchParamsDto?.search_data.infants || 0)
  )
  const [flightDetailsOpen, setFlightDetailsOpen] = useState(false)

  const setSearchParams = (params: SearchFlightsParams) => {
    const searchParamsDto = searchParamsToDto(params)
    setSearchParamsDto(searchParamsDto)
    setSearchParamsCache(params)
  }

  const handleDestinationSelected = useCallback(
    (e: CustomEventInit<{ location: LocationData }>) => {
      e.detail?.location && setDestinationCache(e.detail.location)
    },
    [],
  )
  const handleDepartureSelected = useCallback((e: CustomEventInit<{ location: LocationData }>) => {
    e.detail?.location && setDepartureCache(e.detail.location)
  }, [])

  useEffect(() => {
    document.addEventListener('destinationSelected', handleDestinationSelected)
    document.addEventListener('departureSelected', handleDepartureSelected)
    return () => {
      document.removeEventListener('destinationSelected', handleDestinationSelected)
      document.removeEventListener('departureSelected', handleDepartureSelected)
    }
  }, [])

  return (
    <FlightsContext.Provider
      value={{
        setSearchParams,
        searchParamsDto,
        setSearchParamsDto,
        searchParamsCache,
        departureCache,
        destinationCache,
        firstSegment,
        lastSegment,
        totalPassengers,
        flightDetailsOpen,
        setFlightDetailsOpen,
        isOneWay,
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
