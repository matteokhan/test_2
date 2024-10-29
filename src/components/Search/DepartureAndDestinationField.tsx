'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Box, Popover, Typography, Button, Stack, SxProps } from '@mui/material'
import { Location, CustomTextField } from '@/components'
import { Field, useFormikContext } from 'formik'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { useLocationsByName } from '@/services'
import { useDebounce } from '@uidotdev/usehooks'
import { LocationData, SearchFlightSegmentType } from '@/types'

export const DepartureAndDestinationField = ({
  labels,
  sx,
}: {
  labels?: [string, string]
  sx?: SxProps
}) => {
  const anchorRef = useRef<HTMLInputElement>(null)
  const { errors, touched, setFieldValue, values } = useFormikContext<{
    from: string
    fromLabel: string
    fromCountry: string
    fromType: SearchFlightSegmentType
    to: string
    toLabel: string
    toCountry: string
    toType: SearchFlightSegmentType
  }>()
  const inputRefDeparture = useRef<HTMLInputElement>(null)
  const inputRefDestination = useRef<HTMLInputElement>(null)

  // Departure
  const [departureIsOpen, setDepartureIsOpen] = useState(false)
  const [departureSearchTerm, setDepartureSearchTerm] = useState(values.fromLabel) // TODO: Fix initial values, should be only the departure name, not the entire label
  const [selectedDeparture, setSelectedDeparture] = useState<LocationData | null>(null)
  const debouncedFromSearchTerm = useDebounce(departureSearchTerm, 300)
  const { data: departures, isSuccess: departuresIsSuccess } = useLocationsByName({
    searchTerm: debouncedFromSearchTerm,
  })
  const departuresCodes = Object.keys(departures || {})
  const openDepartureSuggestions = useCallback(() => {
    setDepartureIsOpen(true)
    if (inputRefDeparture.current) inputRefDeparture.current.focus()
  }, [])
  const closeDepartureSuggestions = useCallback(() => {
    setDepartureIsOpen(false)
  }, [])
  const selectDeparture = (location: LocationData) => {
    setDepartureIsOpen(false)
    setSelectedDeparture(location)
    setFieldValue('from', location.code)
    setFieldValue('fromLabel', location.name + ' (' + location.code + ')')
    setFieldValue('fromCountry', location.country_name)
    setFieldValue(
      'fromType',
      location.category === 'City' ? SearchFlightSegmentType.CITY : SearchFlightSegmentType.PLACE,
    )
  }
  const handleDepartureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDeparture(null)
    setFieldValue('from', null)
    setFieldValue('fromLabel', null)
    setFieldValue('fromCountry', null)
    setFieldValue('fromType', null)
    setDepartureSearchTerm(e.target.value)
  }
  const handleDepartureBlur = () => {
    setDepartureIsOpen(false)
    if (selectedDeparture) {
      setDepartureSearchTerm(selectedDeparture.name)
    }
  }

  // Destination
  const [destinationIsOpen, setDestinationIsOpen] = useState(false)
  const [destinationSearchTerm, setDestinationSearchTerm] = useState(values.toLabel) // TODO: Fix initial values, should be only the destination name, not the entire label
  const [selectedDestination, setSelectedDestination] = useState<LocationData | null>(null)
  const debouncedToSearchTerm = useDebounce(destinationSearchTerm, 300)
  const { data: destinations, isSuccess: destinationsIsSuccess } = useLocationsByName({
    searchTerm: debouncedToSearchTerm,
  })
  const destinationsCodes = Object.keys(destinations || {})
  const openDestinationSuggestions = useCallback(() => {
    setDestinationIsOpen(true)
    if (inputRefDestination.current) inputRefDestination.current.focus()
  }, [])
  const closeDestinationSuggestions = useCallback(() => {
    setDestinationIsOpen(false)
  }, [])
  const selectDestination = (location: LocationData) => {
    setDestinationIsOpen(false)
    setSelectedDestination(location)
    setFieldValue('to', location.code)
    setFieldValue('toLabel', location.name + ' (' + location.code + ')')
    setFieldValue('toCountry', location.country_name)
    setFieldValue(
      'toType',
      location.category === 'City' ? SearchFlightSegmentType.CITY : SearchFlightSegmentType.PLACE,
    )
  }
  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDestination(null)
    setFieldValue('to', null)
    setFieldValue('toLabel', null)
    setDestinationSearchTerm(e.target.value)
  }
  const handleDestinationBlur = () => {
    setDestinationIsOpen(false)
    if (selectedDestination) {
      setDestinationSearchTerm(selectedDestination.name)
    }
  }

  // TODO: Swap doesn't work after navigation between pages. Need to store the selected locations in the context to make it work
  const swapLocations = () => {
    if (!selectedDeparture || !selectedDestination) {
      return
    }
    const from = selectedDeparture
    const to = selectedDestination
    setSelectedDeparture(to)
    setSelectedDestination(from)
    setFieldValue('from', to.code)
    setFieldValue('to', from.code)
    setFieldValue('fromLabel', to.name + ' (' + to.code + ')')
    setFieldValue('toLabel', from.name + ' (' + from.code + ')')
    setFieldValue('fromCountry', to.country_name)
    setFieldValue('toCountry', from.country_name)
    setFieldValue(
      'fromType',
      to.category === 'City' ? SearchFlightSegmentType.CITY : SearchFlightSegmentType.PLACE,
    )
    setFieldValue(
      'toType',
      from.category === 'City' ? SearchFlightSegmentType.CITY : SearchFlightSegmentType.PLACE,
    )
    setDepartureSearchTerm(to.name + ' (' + to.code + ')')
    setDestinationSearchTerm(from.name + ' (' + from.code + ')')
  }

  useEffect(() => {
    if (values.fromLabel) {
      setDepartureSearchTerm(values.fromLabel)
    }
    if (values.toLabel) {
      setDestinationSearchTerm(values.toLabel)
    }
  }, [])

  return (
    <>
      <Stack
        border={departureIsOpen || destinationIsOpen ? '2px solid' : '1px solid'}
        borderColor={departureIsOpen || destinationIsOpen ? 'primary.main' : 'grey.500'}
        borderRadius="4px"
        direction="row"
        alignItems="flex-start"
        height={58}
        ref={anchorRef}
        sx={{ ...sx }}>
        <Box position="relative" flexGrow={1}>
          <Field
            inputRef={inputRefDeparture}
            onClick={openDepartureSuggestions}
            as={CustomTextField}
            noBorder
            label={labels ? labels[0] : 'Vol au départ de'}
            sx={{ flexGrow: 1 }}
            error={touched.from && errors.from}
            helperText={touched.from && errors.from}
            inputProps={{
              'data-testid': 'fromField',
            }}
            onChange={handleDepartureChange}
            onBlur={handleDepartureBlur}
            value={departureSearchTerm}
          />
          {!departureIsOpen && (
            <Typography
              onClick={openDepartureSuggestions}
              variant="bodyLg"
              position="absolute"
              top="27px"
              left="13px"
              textOverflow="ellipsis"
              noWrap
              maxWidth="90%"
              bgcolor="white">
              {values.fromLabel}
            </Typography>
          )}
        </Box>
        <Button
          disabled={!selectedDeparture || !selectedDestination}
          onClick={swapLocations}
          variant="outlined"
          sx={{ width: 32, height: 32, padding: 0, minWidth: 32, alignSelf: 'center' }}>
          <SwapHorizIcon
            sx={{
              width: 24,
              height: 24,
              color: !selectedDeparture || !selectedDestination ? 'grey' : 'black',
            }}
          />
        </Button>
        <Box position="relative" flexGrow={1}>
          <Field
            inputRef={inputRefDestination}
            onClick={openDestinationSuggestions}
            as={CustomTextField}
            noBorder
            label={labels ? labels[1] : 'Vol à destination de'}
            sx={{ flexGrow: 1 }}
            error={touched.to && errors.to}
            helperText={touched.to && errors.to}
            inputProps={{
              'data-testid': 'toField',
            }}
            onChange={handleDestinationChange}
            onBlur={handleDestinationBlur}
            value={destinationSearchTerm}
          />
          {!destinationIsOpen && (
            <Typography
              onClick={openDestinationSuggestions}
              variant="bodyLg"
              position="absolute"
              top="27px"
              left="13px"
              textOverflow="ellipsis"
              noWrap
              maxWidth="90%"
              bgcolor="white">
              {values.toLabel}
            </Typography>
          )}
        </Box>
      </Stack>
      <Popover
        sx={{ mt: 1.2 }}
        open={departuresIsSuccess && departureIsOpen && departuresCodes.length > 0}
        anchorEl={anchorRef.current}
        onClose={closeDepartureSuggestions}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        disableRestoreFocus
        disableScrollLock
        disableAutoFocus>
        <Stack px={4} py={1} width={484}>
          {departuresIsSuccess &&
            departuresCodes.map((code, index, array) => {
              const location = departures[code]
              return (
                <Location
                  key={code}
                  location={location}
                  noBorder={array.length - 1 === index}
                  onClick={selectDeparture}
                />
              )
            })}
        </Stack>
      </Popover>
      <Popover
        sx={{ mt: 1.2 }}
        open={destinationsIsSuccess && destinationIsOpen && destinationsCodes.length > 0}
        anchorEl={anchorRef.current}
        onClose={closeDestinationSuggestions}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        disableRestoreFocus
        disableScrollLock
        disableAutoFocus>
        <Stack px={4} py={1} width={484}>
          {destinationsIsSuccess &&
            destinationsCodes.map((code, index, array) => {
              const location = destinations[code]
              return (
                <Location
                  key={code}
                  location={location}
                  noBorder={array.length - 1 === index}
                  onClick={selectDestination}
                />
              )
            })}
        </Stack>
      </Popover>
    </>
  )
}
