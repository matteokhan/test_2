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
import GpsOff from '@mui/icons-material/GpsOff'
import { useNearAgencies, useSearchAgencies } from '@/services'
import { Agency } from '@/types'
import LocationSearchingIcon from '@mui/icons-material/LocationSearching'
import { Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps'
import { env } from 'next-runtime-env'
import { setDefaults, fromLatLng, OutputFormat } from 'react-geocode'
import { PlaceAutocompleteMap } from './PlaceAutocompleteMap'
import { useUserLocation } from '@/contexts'

type SelectAgencyMapProps = {
  onSelectAgency: ({ agency }: { agency: Agency }) => void
  onClose: () => void
}

export const SelectAgencyMap = ({ onClose, onSelectAgency }: SelectAgencyMapProps) => {
  const NEXT_PUBLIC_MAPS_MAP_ID = env('NEXT_PUBLIC_MAPS_MAP_ID') || ''
  const [place, setPlace] = React.useState<any>(null)
  const [currentLocation, setCurrentLocation] = React.useState<any>(null)
  const { position: userLocation } = useUserLocation()

  const defaultBounds = {
    gps_latitude: userLocation?.lat || 48.866667,
    gps_longitude: userLocation?.lng || 2.333333,
  }

  // TODO: enable geolocation
  const canAccessPosition = 'geolocation' in navigator
  const map = useMap()

  const toRadians = (degrees: number) => {
    return degrees * (Math.PI / 180)
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371e3 // Rayon de la Terre en mètres

    const φ1 = toRadians(lat1)
    const φ2 = toRadians(lat2)
    const Δφ = toRadians(lat2 - lat1)
    const Δλ = toRadians(lng2 - lng1)

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    const distance = R * c // Distance en mètres

    return distance
  }

  const getDistance = () => {
    const center = map?.getCenter()
    const bounds = map?.getBounds()

    if (!center || !bounds) return 40000

    const centerLat = center.lat()
    const centerLng = center.lng()

    const leftLng = bounds.getSouthWest().lng()

    const distance = calculateDistance(centerLat, centerLng, centerLat, leftLng)

    return distance + 10000
  }

  const { data: nearAgencies } = useNearAgencies({
    lat: currentLocation?.lat,
    lng: currentLocation?.lng,
    distance: getDistance(),
  })

  const getAgencies = () => {
    if (!nearAgencies || nearAgencies.length == 0) return []
    return nearAgencies
  }

  const geolocatedAgencies = React.useMemo(() => {
    if (nearAgencies && nearAgencies?.length > 0)
      return nearAgencies?.filter((ag) => ag.gps_latitude && ag.gps_longitude)
    return []
  }, [nearAgencies])

  setDefaults({
    key: env('NEXT_PUBLIC_MAPS_API_KEY'),
    language: 'fr',
    region: 'fr',
    outputFormat: OutputFormat.JSON,
  })

  const getAgencyPosition = (agency: Agency) => ({
    lat: agency.gps_latitude,
    lng: agency.gps_longitude,
  })

  const setLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        fromLatLng(position.coords.latitude, position.coords.longitude)
          .then(({ results }) => {
            const locality = results[0].address_components.find((component: any) =>
              component.types.includes('locality'),
            )
            setPlace(results[0])
          })
          .catch(console.error)

        map?.setCenter({ lat: position.coords.latitude, lng: position.coords.longitude })
        map?.setZoom(11)
        setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
      })
    }
  }

  const setPlaceAndFetchAgencies = (place: any) => {
    setPlace(place)
    map?.setCenter({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() })
    map?.setZoom(11)
    setCurrentLocation({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() })
  }

  const getMarkers = () => {
    const agenciesToShow = getAgencies()
    return agenciesToShow
      ?.filter((ag) => ag.gps_latitude && ag.gps_longitude)
      ?.map((agency: Agency) => {
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
      })
  }

  map?.addListener('dragend', () => {
    const center = map.getCenter()
    if (!center) return
    setCurrentLocation({ lat: center.lat(), lng: center.lng() })
  })

  useEffect(() => {
    if (!currentLocation) {
      const center = map?.getCenter()
      if (center) {
        setCurrentLocation({ lat: center.lat(), lng: center.lng() })
      }
    }
  }, [map])

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
            defaultCenter={{
              lat: defaultBounds.gps_latitude,
              lng: defaultBounds.gps_longitude,
            }}
            disableDefaultUI={true}
            mapId={NEXT_PUBLIC_MAPS_MAP_ID}>
            {getMarkers()}
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
            <PlaceAutocompleteMap
              onPlaceSelect={(place) => {
                setPlaceAndFetchAgencies(place)
              }}
            />
            <Stack justifyContent="center">
              <Fab
                data-testid="selectAgencyMap-locationButton"
                size="medium"
                color="primary"
                aria-label="Géolocalisation"
                onClick={setLocation}
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
            {getAgencies()?.map((agency) => (
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
