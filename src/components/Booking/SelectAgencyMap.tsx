'use client'

import React, { useEffect } from 'react'
import {
  Box,
  IconButton,
  Stack,
  Typography,
  Paper,
  Button,
  InputAdornment,
  Fab,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import GpsOff from '@mui/icons-material/GpsOff'
import { useSearchAgencies } from '@/services'
import { Agency } from '@/types'
import { useDebounce } from '@uidotdev/usehooks'
import { CustomTextField } from '@/components'
import LocationSearchingIcon from '@mui/icons-material/LocationSearching'
import { Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps'
import { env } from 'next-runtime-env'

type SelectAgencyMapProps = {
  onSelectAgency: ({ agency }: { agency: Agency }) => void
  onClose: () => void
}

export const SelectAgencyMap = ({ onClose, onSelectAgency }: SelectAgencyMapProps) => {
  const NEXT_PUBLIC_MAPS_MAP_ID = env('NEXT_PUBLIC_MAPS_MAP_ID') || ''
  const [searchTerm, setSearchTerm] = React.useState<string>('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const { data: agencies, isSuccess } = useSearchAgencies({ searchTerm: debouncedSearchTerm })
  const geolocatedAgencies = React.useMemo(
    () => agencies?.filter((ag) => ag.gps_latitude && ag.gps_longitude) || [],
    [agencies],
  )
  // TODO: enable geolocation
  const canAccessPosition = 'geolocation' in navigator
  const map = useMap()

  const getAgencyPosition = (agency: Agency) => ({
    lat: agency.gps_latitude,
    lng: agency.gps_longitude,
  })

  useEffect(() => {
    if (geolocatedAgencies?.length) {
      // setSelectedAgency(null)
      map?.fitBounds({
        east: Math.max(...geolocatedAgencies.map((agency) => agency.gps_longitude)),
        north: Math.max(...geolocatedAgencies.map((agency) => agency.gps_latitude)),
        south: Math.min(...geolocatedAgencies.map((agency) => agency.gps_latitude)),
        west: Math.min(...geolocatedAgencies.map((agency) => agency.gps_longitude)),
      })
    }
  }, [map, geolocatedAgencies])

  return (
    <Stack width="100vw" height="100vh" zIndex={10}>
      <Paper elevation={2} sx={{ borderRadius: 0, py: 1.5, px: 2, zIndex: 20 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="titleMd">Sélectionner votre agence</Typography>
          <Stack sx={{ width: '48px', height: '48px' }} justifyContent="center" alignItems="center">
            <IconButton aria-label="close" onClick={onClose} data-testid="selectAgencyMap-close">
              <CloseIcon data-testid={null} />
            </IconButton>
          </Stack>
        </Stack>
      </Paper>

      <Stack direction="row" flexGrow={1} overflow="hidden">
        <Box flexGrow={1} data-testid="selectAgencyMap-map">
          <Map
            defaultZoom={8}
            maxZoom={16}
            disableDefaultUI={true}
            mapId={NEXT_PUBLIC_MAPS_MAP_ID}
            defaultBounds={{
              east: Math.max(...geolocatedAgencies.map((agency) => agency.gps_longitude)),
              north: Math.max(...geolocatedAgencies.map((agency) => agency.gps_latitude)),
              south: Math.min(...geolocatedAgencies.map((agency) => agency.gps_latitude)),
              west: Math.min(...geolocatedAgencies.map((agency) => agency.gps_longitude)),
            }}>
            {isSuccess &&
              geolocatedAgencies?.map((agency: Agency) => {
                const leclercLogo = document.createElement('img')
                leclercLogo.src = '/leclerc_imagetype.svg'
                return (
                  <React.Fragment key={agency.id}>
                    <AdvancedMarker
                      position={getAgencyPosition(agency)}
                      data-testid="selectAgencyMap-map-locationMarker">
                      <Pin glyph={leclercLogo} background={'#0066CC'} borderColor={'#0066CC'} />
                    </AdvancedMarker>
                  </React.Fragment>
                )
              })}
          </Map>
        </Box>
        <Stack width="420px" overflow="hidden" borderLeft="1px solid" borderColor="grey.400">
          <Stack
            direction="row"
            p={2}
            justifyContent="space-between"
            gap={2}
            borderBottom="1px solid"
            borderColor="grey.400">
            {/* I had to force the className="MuiInputAdornment-hiddenLabel", seems like a bug in MUI */}
            <CustomTextField
              data-testid="selectAgencyMap-searchField"
              fullWidth
              label={null}
              value={searchTerm}
              onChange={(ev) => setSearchTerm(ev.target.value)}
              InputProps={{
                placeholder: 'Rechercher',
                hiddenLabel: true,
                startAdornment: (
                  <InputAdornment position="start" className="MuiInputAdornment-hiddenLabel">
                    <SearchIcon data-testid={null} />
                  </InputAdornment>
                ),
              }}
            />
            <Stack justifyContent="center">
              <Fab
                data-testid="selectAgencyMap-locationButton"
                size="medium"
                color="primary"
                aria-label="Géolocalisation"
                sx={{ boxShadow: 'none' }}>
                {canAccessPosition ? (
                  <LocationSearchingIcon data-testid={null} />
                ) : (
                  <GpsOff data-testid={null} />
                )}
              </Fab>
            </Stack>
          </Stack>
          <Stack overflow="scroll" data-testid="selectAgencyMap-agenciesList">
            {agencies?.map((agency) => (
              <Box
                p={2}
                borderBottom="1px solid"
                borderColor="grey.200"
                key={agency.id}
                data-testid="selectAgencyMap-agenciesList-agency">
                <Typography
                  variant="titleMd"
                  data-testid="selectAgencyMap-agenciesList-agency-name">
                  {agency.name}
                </Typography>
                <Typography
                  variant="bodySm"
                  color="grey.700"
                  data-testid="selectAgencyMap-agenciesList-agency-address">
                  {agency.address}
                </Typography>
                <Typography
                  variant="bodySm"
                  color="grey.700"
                  data-testid="selectAgencyMap-agenciesList-agency-address2">
                  {agency.address2}
                </Typography>
                <Typography
                  variant="bodySm"
                  color="grey.700"
                  data-testid="selectAgencyMap-agenciesList-agency-phone">
                  Tel {agency.phone}
                </Typography>
                <Stack direction="row" pt={2} justifyContent="flex-end" gap={1}>
                  <Button
                    variant="text"
                    sx={{ px: 3 }}
                    data-testid="selectAgencyMap-agenciesList-agency-seeDetails">
                    Voir les infos
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ px: 3 }}
                    onClick={() => onSelectAgency({ agency })}
                    data-testid="selectAgencyMap-agenciesList-agency-selectAgencyButton">
                    Sélectionner
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}
