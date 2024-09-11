'use client'

import { Box, Drawer, Typography } from '@mui/material'
import { SearchFlightsModes, SectionContainer, SelectAgencyMap } from '@/components'
import { SearchFlightsParams } from '@/types'
import { useFlights, useUserLocation } from '@/contexts'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useNearAgencies } from '@/services'
import { getCookiesAgencyCode, getCookiesAgencyName, setCookiesAgency } from '@/utils/cookies'

export const SearchFlightsBanner = () => {
  const router = useRouter()
  const { setSearchParams } = useFlights()
  const [mapIsOpen, setMapIsOpen] = useState(false)
  const [selectedAgency, setSelectedAgency] = useState<any>(null)
  const [permissionAsked, setPermissionAsked] = useState(false)
  const { position: userLocation, canAccessPosition, askUserForPermission } = useUserLocation()

  const onSearch = ({ searchParams }: { searchParams: SearchFlightsParams }) => {
    if (selectedAgency) setCookiesAgency(selectedAgency)
    setSearchParams(searchParams)
    router.push('/flights')
  }

  const selectAgency = (agency: any) => {
    setSelectedAgency({
      code: agency.code,
      name: agency.name,
    })
    setCookiesAgency(agency)
    setMapIsOpen(false)
  }

  const { data: arroundAgencies } = useNearAgencies({
    lat: userLocation?.lat,
    lng: userLocation?.lng,
    distance: 200000,
  })

  useEffect(() => {
    if (getCookiesAgencyCode() && !selectedAgency) {
      setSelectedAgency({
        code: getCookiesAgencyCode(),
        name: getCookiesAgencyName(),
      })
    } else if (!canAccessPosition && !permissionAsked) {
      setPermissionAsked(true)
      askUserForPermission()
    } else if (!selectedAgency && arroundAgencies && arroundAgencies.length > 0) {
      const agency = arroundAgencies[0]
      setSelectedAgency({
        code: agency.code,
        name: agency.name,
      })
    }
  })

  return (
    <Box
      sx={{
        backgroundColor: 'primary.main',
      }}>
      <SectionContainer
        sx={{ justifyContent: 'space-between', paddingY: 6, flexDirection: 'column' }}>
        <Typography color="common.white" variant="titleLg" sx={{ marginBottom: '5px' }}>
          Votre agence Voyages E.Leclerc en ligne
        </Typography>
        {!selectedAgency && (
          <Typography color="common.white" variant="titleSm" sx={{ display: 'none' }}>
            Veuillez sélectionner votre agence en ligne
          </Typography>
        )}
        {selectedAgency && (
          <Typography color="common.white" variant="titleSm" sx={{ display: 'none' }}>
            Agence {selectedAgency.name} -{' '}
            <a onClick={() => setMapIsOpen(true)}>Changer d'agence</a>
          </Typography>
        )}
        <SearchFlightsModes sx={{ mt: 4 }} onSearch={onSearch} />
      </SectionContainer>
      <Drawer
        open={mapIsOpen}
        onClose={() => setMapIsOpen(false)}
        anchor="right"
        PaperProps={{
          sx: {
            borderRadius: 0,
          },
        }}>
        <SelectAgencyMap
          onClose={() => setMapIsOpen(false)}
          onSelectAgency={({ agency }) => {
            selectAgency(agency)
          }}
        />
      </Drawer>
    </Box>
  )
}
