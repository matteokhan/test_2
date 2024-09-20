'use client'

import { getCookiesAgencyCode, getCookiesAgencyName, setCookiesAgency } from '@/utils'
import { createContext, useContext, useEffect, useState } from 'react'
import { useUserLocation } from '@/contexts'
import { useNearAgencies } from '@/services'

type AgencySelectorContextType = {
  selectedAgencyCode: string | undefined
  selectedAgencyName: string | undefined
  setSelectedAgency: (agencyCode: string, agencyName: string, save: boolean) => void
  saveSelectedAgency: () => void
}

const AgencySelectorContext = createContext<AgencySelectorContextType | undefined>(undefined)

export const AgencySelectorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedAgencyCode, setSelectedAgencyCode] = useState<string | undefined>(undefined)
  const [selectedAgencyName, setSelectedAgencyName] = useState<string | undefined>(undefined)
  const [askUserLocation, setAskUserLocation] = useState<boolean>(false)

  const { position: userLocation, askUserForPermission } = useUserLocation()

  const { data: arroundAgencies } = useNearAgencies({
    lat: userLocation?.lat,
    lng: userLocation?.lng,
    distance: 200000,
  })

  const setSelectedAgency = (agencyCode: string, agencyName: string, save: boolean = false) => {
    setSelectedAgencyCode(agencyCode)
    setSelectedAgencyName(agencyName)
    if (save) {
      setCookiesAgency({ code: agencyCode, name: agencyName })
    }
  }

  const saveSelectedAgency = () => {
    if (selectedAgencyCode && selectedAgencyName) {
      setCookiesAgency({ code: selectedAgencyCode, name: selectedAgencyName })
    }
  }

  useEffect(() => {
    const agencySelected = getCookiesAgencyCode()
    if (agencySelected && !selectedAgencyCode) {
      setSelectedAgencyCode(agencySelected)
      setSelectedAgencyName(getCookiesAgencyName())
    } else if (userLocation && !selectedAgencyCode) {
      if (arroundAgencies && arroundAgencies.length > 0) {
        setSelectedAgency(arroundAgencies[0].code, arroundAgencies[0].name)
      }
    } else {
      if (!askUserLocation) {
        setAskUserLocation(true)
        askUserForPermission()
      }
    }
  })

  return (
    <AgencySelectorContext.Provider
      value={{
        selectedAgencyCode,
        selectedAgencyName,
        setSelectedAgency,
        saveSelectedAgency,
      }}>
      {children}
    </AgencySelectorContext.Provider>
  )
}

export const useAgencySelector = () => {
  const context = useContext(AgencySelectorContext)
  if (context === undefined) {
    throw new Error('useAgencySelector must be used within a AgencySelectorProvider')
  }
  return context
}
