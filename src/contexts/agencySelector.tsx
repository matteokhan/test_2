'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useUserLocation } from '@/contexts'
import { getAgency, useNearAgencies } from '@/services'
import { Agency, AgencyId } from '@/types'

import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

type AgencySelectorContextType = {
  selectedAgencyId: AgencyId | undefined
  selectedAgency: Agency | undefined
  selectAgency: (agency: Agency) => void
}

const AgencySelectorContext = createContext<AgencySelectorContextType | undefined>(undefined)

export const AgencySelectorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedAgencyId, setSelectedAgencyId] = useState<AgencyId | undefined>()
  const [selectedAgency, setSelectedAgency] = useState<Agency | undefined>()
  const { position: userLocation, askUserForPermission, canAccessPosition } = useUserLocation()

  const { data: arroundAgencies } = useNearAgencies({
    lat: userLocation?.lat,
    lng: userLocation?.lng,
    distance: 200000,
  })

  const selectAgency = (agency: Agency) => {
    setSelectedAgencyId(agency.id)
    setSelectedAgency(agency)
    localStorage.setItem('agencyId', agency.id.toString())
  }

  const fetchAgency = async (agencyId: AgencyId) => {
    try {
      const agency = await queryClient.fetchQuery<Agency>({
        queryKey: ['agency', agencyId],
        queryFn: () => getAgency({ agencyId }),
        staleTime: 0,
        gcTime: 0,
      })
      console.log('agency:', agency)
      selectAgency(agency)
    } catch (error) {
      console.error('Error fetching user data:', error)
      throw error
    }
  }

  useEffect(() => {
    console.log('Agency fetch at start')
    // if (!canAccessPosition) {
    //   askUserForPermission()
    // }
    const agencyCodeStored = localStorage.getItem('agencyId')
    if (agencyCodeStored) {
      // fetchAgency(+agencyCodeStored)
      setSelectedAgencyId(+agencyCodeStored)
    }
  }, [])

  useEffect(() => {
    console.log('Near agencies ready:', arroundAgencies)
    if (!selectAgency && arroundAgencies && arroundAgencies.length > 0) {
      setSelectedAgency(arroundAgencies[0])
    }
  }, [arroundAgencies])

  // useEffect(() => {
  //   const agencySelected = getCookiesAgencyCode()
  //   if (agencySelected && !selectedAgencyCode) {
  //     setSelectedAgencyCode(agencySelected)
  //     setSelectedAgencyName(getCookiesAgencyName())
  //   } else if (userLocation && !selectedAgencyCode) {
  //     if (arroundAgencies && arroundAgencies.length > 0) {
  //       setSelectedAgency(arroundAgencies[0].code, arroundAgencies[0].name)
  //     }
  //   } else {
  //     if (!askUserLocation) {
  //       setAskUserLocation(true)
  //       askUserForPermission()
  //     }
  //   }
  // })

  return (
    <AgencySelectorContext.Provider
      value={{
        selectedAgencyId,
        selectedAgency,
        selectAgency,
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
