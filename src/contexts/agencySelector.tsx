'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getAgency } from '@/services'
import { Agency, AgencyId } from '@/types'

import { useQueryClient } from '@tanstack/react-query'

type AgencySelectorContextType = {
  selectedAgencyId: AgencyId | undefined
  selectedAgency: Agency | undefined
  selectAgency: (agency: Agency) => void
}

const AgencySelectorContext = createContext<AgencySelectorContextType | undefined>(undefined)

export const AgencySelectorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedAgencyId, setSelectedAgencyId] = useState<AgencyId | undefined>()
  const [selectedAgency, setSelectedAgency] = useState<Agency | undefined>()
  const queryClient = useQueryClient()

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
      selectAgency(agency)
    } catch (error) {
      // TODO: log this somewhere
      throw error
    }
  }

  useEffect(() => {
    const agencyIdStored = localStorage.getItem('agencyId')
    if (agencyIdStored) {
      fetchAgency(+agencyIdStored)
      setSelectedAgencyId(+agencyIdStored)
    }
  }, [])

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
