'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  IconButton,
  Stack,
  Typography,
  Paper,
  Button,
  InputAdornment,
  Fab,
  Modal,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import GpsOff from '@mui/icons-material/GpsOff'
import SearchIcon from '@mui/icons-material/Search'
import LocationSearchingIcon from '@mui/icons-material/LocationSearching'
import { useListAllAgencies, useNearAgencies, useSearchAgencies } from '@/services'
import { Agency } from '@/types'
import { Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps'
import { useUserLocation } from '@/contexts'
import { AgencyInfoModal, AgencySkeleton, CustomTextField } from '@/components'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { useDebounce } from '@uidotdev/usehooks'
import { getEnvVar } from '@/utils'

const DEBOUNCE_TIME = 300 // 300 ms
const DEFAULT_BOUNDS = {
  gps_latitude: 48.866667,
  gps_longitude: 2.333333,
}
const SEARCH_DISTANCE = 60_000
const MAX_SEARCH_DISTANCE = 1_000_000

const mergeAgencies = (a: Agency[] | undefined, b: Agency[] | undefined) => {
  let agencies: Agency[] = []
  const uniqueSet = new Set()
  if (a) agencies = [...agencies, ...a]
  if (b) agencies = [...agencies, ...b]
  agencies = agencies.filter((ag) => {
    const duplicate = uniqueSet.has(ag.id)
    uniqueSet.add(ag.id)
    return !duplicate
  })
  return agencies
}

const getAgencyPosition = (agency: Agency) => ({
  lat: agency.gps_latitude,
  lng: agency.gps_longitude,
})

type Position = {
  lat: number | undefined
  lng: number | undefined
}

type SelectAgencyMapProps = {
  onSelectAgency: ({ agency }: { agency: Agency }) => void
  onClose: () => void
}

export const SelectAgencyMap = ({ onClose, onSelectAgency }: SelectAgencyMapProps) => {
  const MAPS_MAP_ID = getEnvVar({ name: 'NEXT_PUBLIC_MAPS_MAP_ID' })
  const [matchedLocation, setMatchedLocation] = useState<Position | null>(null)
  const [searchTerm, setSearchTerm] = React.useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_TIME)
  const [modalIsOpen, setModalIsOpen] = React.useState(false)
  const [agencyToShow, setAgencyToShow] = React.useState<Agency | undefined>(undefined)
  const [searchNearUser, setSearchNearUser] = React.useState(false)
  const [userSearchDistance, setUserSearchDistance] = React.useState(SEARCH_DISTANCE)
  const [placeSearchDistance, setPlaceSearchDistance] = React.useState(SEARCH_DISTANCE)
  const [isIncreasingDistance, setIsIncreasingDistance] = React.useState(false)
  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null)
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null)
  const places = useMapsLibrary('places')
  const map = useMap()

  const { position: userLocation, canAccessPosition, askUserForPermission } = useUserLocation()
  const { data: agenciesByTerm, isFetching: isFetchingByTerm } = useSearchAgencies({
    searchTerm: debouncedSearchTerm,
  })
  const { data: allAgencies, isFetching: isFetchingAllAgencies } = useListAllAgencies()
  const {
    data: nearUserAgencies,
    isFetching: isFetchingNearUser,
    isSuccess: nearUserAgenciesSuccess,
  } = useNearAgencies({
    lat: userLocation?.lat,
    lng: userLocation?.lng,
    distance: userSearchDistance,
  })
  const {
    data: nearPlaceAgencies,
    isFetching: isFetchingNearPlace,
    isSuccess: nearPlaceAgenciesSuccess,
  } = useNearAgencies({
    lat: matchedLocation?.lat,
    lng: matchedLocation?.lng,
    distance: placeSearchDistance,
  })
  let agencies: Agency[] = []
  if (searchNearUser) {
    agencies = mergeAgencies(agencies, nearUserAgencies)
  }
  if (searchTerm) {
    agencies = mergeAgencies(agencies, agenciesByTerm)
    agencies = mergeAgencies(agencies, nearPlaceAgencies)
  }
  const visibleAgencies = searchNearUser || searchTerm ? agencies : allAgencies
  const isLoading =
    isFetchingByTerm ||
    isFetchingNearPlace ||
    isFetchingNearUser ||
    isFetchingAllAgencies ||
    isIncreasingDistance

  // This is needed to initialize the autocomplete and places services.
  useEffect(() => {
    if (!places || !map) return
    setAutocompleteService(new places.AutocompleteService())
    setPlacesService(new places.PlacesService(map))
  }, [places, map])

  // Search places that matches the search term
  useEffect(() => {
    // Reset place search distance
    setPlaceSearchDistance(SEARCH_DISTANCE)

    if (!autocompleteService || !placesService || debouncedSearchTerm.length < 3) {
      clearMatchedLocation()
      return
    }
    autocompleteService.getPlacePredictions(
      { input: debouncedSearchTerm },
      (predictions, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          predictions &&
          predictions.length > 0
        ) {
          placesService.getDetails(
            { placeId: predictions[0].place_id, fields: ['geometry'] },
            (result, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && result) {
                setMatchedLocation({
                  lat: result.geometry?.location?.lat(),
                  lng: result.geometry?.location?.lng(),
                })
              } else {
                clearMatchedLocation()
              }
            },
          )
        } else {
          clearMatchedLocation()
        }
      },
    )
  }, [debouncedSearchTerm])

  // Fit all the points in the map bounds
  useEffect(() => {
    let ag = visibleAgencies?.filter((ag) => ag.gps_latitude && ag.gps_longitude)
    if (ag?.length) {
      map?.fitBounds({
        east: Math.max(...ag.map((agency) => agency.gps_longitude)),
        north: Math.max(...ag.map((agency) => agency.gps_latitude)),
        south: Math.min(...ag.map((agency) => agency.gps_latitude)),
        west: Math.min(...ag.map((agency) => agency.gps_longitude)),
      })
    }
  }, [map, visibleAgencies])

  useEffect(() => {
    if (
      nearUserAgenciesSuccess &&
      nearUserAgencies.length == 0 &&
      userSearchDistance < MAX_SEARCH_DISTANCE
    ) {
      setUserSearchDistance((prev) => prev * 2)
    }
  }, [nearUserAgenciesSuccess])

  useEffect(() => {
    if (
      nearPlaceAgenciesSuccess &&
      nearPlaceAgencies.length == 0 &&
      placeSearchDistance < MAX_SEARCH_DISTANCE
    ) {
      setIsIncreasingDistance(true)
      setPlaceSearchDistance((prev) => prev * 2)
    } else {
      setIsIncreasingDistance(false)
    }
  }, [nearPlaceAgenciesSuccess, placeSearchDistance, nearPlaceAgencies])

  useEffect(() => {
    if (!canAccessPosition && searchNearUser) {
      askUserForPermission()
    }
  }, [searchNearUser, canAccessPosition])

  const clearMatchedLocation = () => {
    setMatchedLocation(null)
  }

  const onShowAgency = (agency: Agency) => {
    setAgencyToShow(agency)
    setModalIsOpen(true)
  }

  const handleLocationButtonClick = () => {
    if (!canAccessPosition) {
      askUserForPermission()
      return
    }
    setSearchNearUser(!searchNearUser)
  }

  const getMarkers = () => {
    return visibleAgencies
      ?.filter((ag) => ag.gps_latitude && ag.gps_longitude)
      ?.map((agency) => {
        const leclercLogo = document.createElement('img')
        leclercLogo.src = '/leclerc_imagetype.svg'
        return (
          <React.Fragment key={agency.id}>
            <AdvancedMarker
              position={getAgencyPosition(agency)}
              data-testid="selectAgencyMap-map-locationMarker"
              onClick={() => onShowAgency(agency)}>
              <Pin glyph={leclercLogo} background={'#0066CC'} borderColor={'#0066CC'} />
            </AdvancedMarker>
          </React.Fragment>
        )
      })
  }

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

      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        position={{ xs: 'relative', lg: 'unset' }}
        flexGrow={{ xs: 'unset', lg: 1 }}
        overflow={{ xs: 'visible', lg: 'hidden' }}>
        <Box flexGrow={1} data-testid="selectAgencyMap-map" height={{ xs: '430px', lg: 'unset' }}>
          <Map
            defaultZoom={8}
            maxZoom={16}
            defaultCenter={{
              lat: DEFAULT_BOUNDS.gps_latitude,
              lng: DEFAULT_BOUNDS.gps_longitude,
            }}
            disableDefaultUI={true}
            mapId={MAPS_MAP_ID}>
            {getMarkers()}
            {canAccessPosition && userLocation && (
              <AdvancedMarker
                position={userLocation}
                data-testid="selectAgencyMap-map-locationMarker">
                <Pin background={'red'} borderColor={'white'} />
              </AdvancedMarker>
            )}
          </Map>
        </Box>
        <Stack
          width={{ xs: '100%', lg: '420px' }}
          overflow="hidden"
          borderLeft={{ xs: 'unset', lg: '1px solid' }}
          borderColor={{ xs: 'unset', lg: 'grey.400' }}>
          <Stack
            direction="row"
            p={2}
            justifyContent="space-between"
            gap={2}
            borderBottom={{ xs: 'unset', lg: '1px solid' }}
            borderColor={{ xs: 'unset', lg: 'grey.400' }}
            position={{ xs: 'absolute', lg: 'unset' }}
            top={{ xs: 0, lg: 'unset' }}
            width={{ xs: '100%', lg: 'unset' }}>
            <CustomTextField
              data-testid="selectAgencyMap-searchField"
              fullWidth
              label={null}
              onChange={(e) => {
                setSearchTerm(e.target.value)
              }}
              sx={{ bgcolor: { xs: 'common.white', lg: 'unset' } }}
              value={searchTerm}
              InputProps={{
                placeholder: 'Rechercher',
                hiddenLabel: true,
                startAdornment: (
                  <InputAdornment position="start" className="MuiInputAdornment-hiddenLabel">
                    {/* I had to force the className="MuiInputAdornment-hiddenLabel", seems like a bug in MUI */}
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
                onClick={() => handleLocationButtonClick()}
                sx={{
                  boxShadow: 'none',
                  bgcolor: canAccessPosition ? 'primary.main' : 'grey.200',
                }}>
                {canAccessPosition ? (
                  searchNearUser ? (
                    <LocationSearchingIcon data-testid={null} />
                  ) : (
                    <GpsOff data-testid={null} />
                  )
                ) : (
                  <GpsOff data-testid={null} />
                )}
              </Fab>
            </Stack>
          </Stack>
          <Stack overflow="scroll" data-testid="selectAgencyMap-agenciesList">
            {isLoading && (
              <>
                <AgencySkeleton />
                <AgencySkeleton />
                <AgencySkeleton />
              </>
            )}
            {!isLoading && visibleAgencies?.length === 0 && (
              <Typography p={2} variant="headlineXs">
                Aucune agence à afficher
              </Typography>
            )}
            {(searchTerm || searchNearUser) &&
              agencies &&
              !isLoading &&
              agencies.map((agency) => (
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
                    data-testid="selectAgencyMap-agenciesList-agency-city">
                    {agency.city}
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
                      data-testid="selectAgencyMap-agenciesList-agency-seeDetails"
                      onClick={() => onShowAgency(agency)}>
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
      {agencyToShow !== undefined && (
        <Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
          <AgencyInfoModal
            agency={agencyToShow}
            onSelectAgency={(agency) => {
              onSelectAgency({ agency })
              setModalIsOpen(false)
            }}
            onClose={() => {
              setModalIsOpen(false)
            }}
          />
        </Modal>
      )}
    </Stack>
  )
}
