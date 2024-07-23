import { SearchFlightParamsDto } from '@/types'
import React, { createContext, useState, useContext } from 'react'

interface FlightsContextInterface {
  searchParams: SearchFlightParamsDto
  setSearchParams: (params: SearchFlightParamsDto) => void
}

type FlightsContextData = {
  searchParams: SearchFlightParamsDto
}

const BASE_STATE: FlightsContextData = {
  searchParams: {
    adults: 1,
    childrens: 0,
    infant: 0,
    segments: [],
  },
}

const FlightsContext = createContext<FlightsContextInterface>({} as FlightsContextInterface)

export const FlightsProvider = ({ children }: { children: React.ReactNode }) => {
  const flights = useFlightsProvider()
  return <FlightsContext.Provider value={flights}>{children}</FlightsContext.Provider>
}

export const useFlightsContext = () => {
  return useContext(FlightsContext)
}

const useFlightsProvider = (): FlightsContextInterface => {
  const [flightsState, setFlightsState] = useState<FlightsContextData>(BASE_STATE)

  const setSearchParams = (params: SearchFlightParamsDto) => {
    setFlightsState({ ...flightsState, searchParams: params })
  }

  return {
    searchParams: flightsState.searchParams,
    setSearchParams,
  } as FlightsContextInterface
}
