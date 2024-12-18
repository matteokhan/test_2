'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getAgency, getNearAgencies } from '@/services'
import { Agency, AgencyId } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import { useUserLocation } from './userLocation'

type AgencySelectorContextType = {
  selectedAgencyId: AgencyId | undefined
  selectedAgency: Agency | undefined
  selectAgency: (agency: Agency) => void
  isFetchingAgency: boolean
  isAgencySelectorOpen: boolean
  setIsAgencySelectorOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AgencySelectorContext = createContext<AgencySelectorContextType | undefined>(undefined)

export const AgencySelectorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedAgencyId, setSelectedAgencyId] = useState<AgencyId | undefined>()
  const [selectedAgency, setSelectedAgency] = useState<Agency | undefined>()
  const queryClient = useQueryClient()
  const { canAccessPosition, position, askUserForPermission } = useUserLocation()
  const [isFetchingAgency, setIsFetchingAgency] = useState(false)
  const [isAgencySelectorOpen, setIsAgencySelectorOpen] = useState(false)

  const selectAgency = (agency: Agency) => {
    setSelectedAgencyId(agency.id)
    setSelectedAgency(agency)
    localStorage.setItem('agencyId', agency.id.toString())
  }

  const fetchAgency = async (agencyId: AgencyId) => {
    try {
      setIsFetchingAgency(true)
      const agency = await queryClient.fetchQuery<Agency>({
        queryKey: ['agency', agencyId],
        queryFn: () => getAgency({ agencyId }),
        staleTime: 0,
        gcTime: 0,
      })
      selectAgency(agency)
    } catch (error) {
      // TODO: log this somewhere
    } finally {
      setIsFetchingAgency(false)
    }
  }

  const fetchNearAgency = async (position: { lat: number; lng: number }, distance: number) => {
    try {
      setIsFetchingAgency(true)
      const nearAgencies = await queryClient.fetchQuery<Agency[]>({
        queryKey: ['nearAgencies', position.lat, position.lng, distance],
        queryFn: async () => getNearAgencies({ lat: position.lat, lng: position.lng, distance }),
        staleTime: 0,
        gcTime: 0,
      })
      return nearAgencies ? nearAgencies[0] : null
    } catch (error) {
      // TODO: log this somewhere
    } finally {
      setIsFetchingAgency(false)
    }
  }

  useEffect(() => {
    let agencyIdStored = localStorage.getItem('agencyId')
    if (agencyIdStored) {
      fetchAgency(+agencyIdStored)
    } else {
      askUserForPermission()
    }
  }, [])

  useEffect(() => {
    let agencyIdStored = localStorage.getItem('agencyId')
    if (canAccessPosition && position && !agencyIdStored) {
      fetchNearAgency(position, 40000).then((nearAgency) => {
        if (nearAgency) {
          setSelectedAgencyId(nearAgency.id)
          selectAgency(nearAgency)
        }
      })
    }
  }, [canAccessPosition, position])

  return (
    <AgencySelectorContext.Provider
      value={{
        selectedAgencyId,
        selectedAgency,
        selectAgency,
        isFetchingAgency,
        isAgencySelectorOpen,
        setIsAgencySelectorOpen,
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
