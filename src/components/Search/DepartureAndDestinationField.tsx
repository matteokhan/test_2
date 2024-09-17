'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Box, Popover, Typography, Button, Stack, SxProps } from '@mui/material'
import { AirplaneIcon, CustomTextField } from '@/components'
import { Field, useFormikContext } from 'formik'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined'
import { useSearchAirportsByName } from '@/services'
import { useDebounce } from '@uidotdev/usehooks'
import { AirportData } from '@/types'

const Location = ({
  airport,
  noBorder,
  onClick,
}: {
  airport: AirportData
  noBorder: boolean
  onClick: (airport: AirportData) => void
}) => {
  return (
    <Stack
      py={1.5}
      borderBottom="1px solid"
      borderColor={noBorder ? 'transparent' : 'grey.200'}
      direction="row"
      gap={2}
      alignItems="center"
      boxSizing="border-box"
      sx={{ '&:hover': { cursor: 'pointer' } }}
      onClick={() => onClick(airport)}>
      <>
        {airport.category == 'City' && <PinDropOutlinedIcon />}
        {airport.category == 'Airport' && (
          <Stack ml={2} sx={{ rotate: '180deg' }} justifyContent="center">
            <AirplaneIcon />
          </Stack>
        )}
        <Box>
          {airport.category == 'City' && (
            <Typography variant="titleSm">
              {airport.name} ({airport.code} - Tous les aéroports)
            </Typography>
          )}
          {airport.category == 'Airport' && (
            <Typography variant="titleSm">
              {airport.name} ({airport.code}) {airport.extension}
            </Typography>
          )}
          <Typography variant="bodyMd" color="#49454F">
            {airport.name}, {airport.country_name}
          </Typography>
        </Box>
      </>
    </Stack>
  )
}

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
    to: string
    toLabel: string
  }>()

  // Departure
  const [departureIsOpen, setDepartureIsOpen] = useState(false)
  const [departureSearchTerm, setDepartureSearchTerm] = useState(values.fromLabel) // TODO: Fix initial values, should be only the departure name, not the entire label
  const [selectedDepartureAirport, setSelectedDepartureAirport] = useState<AirportData | null>(null)
  const debouncedFromSearchTerm = useDebounce(departureSearchTerm, 300)
  const { data: departureAirports, isSuccess: departureIsSuccess } = useSearchAirportsByName({
    searchTerm: debouncedFromSearchTerm,
  })
  const departureAirportsCodes = Object.keys(departureAirports || {})
  const openDepartureSuggestions = useCallback(() => {
    setDepartureIsOpen(true)
  }, [])
  const closeDepartureSuggestions = useCallback(() => {
    setDepartureIsOpen(false)
  }, [])
  const selectDeparture = (airport: AirportData) => {
    setDepartureIsOpen(false)
    setSelectedDepartureAirport(airport)
    setFieldValue('from', airport.code)
    setFieldValue('fromLabel', airport.name + ' (' + airport.code + ')')
  }
  const handleDepartureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDepartureAirport(null)
    setFieldValue('from', null)
    setFieldValue('fromLabel', null)
    setDepartureSearchTerm(e.target.value)
  }
  const handleDepartureBlur = () => {
    setDepartureIsOpen(false)
    if (selectedDepartureAirport) {
      setDepartureSearchTerm(selectedDepartureAirport.name)
    }
  }

  // Destination
  const [destinationIsOpen, setDestinationIsOpen] = useState(false)
  const [destinationSearchTerm, setDestinationSearchTerm] = useState(values.toLabel) // TODO: Fix initial values, should be only the destination name, not the entire label
  const [selectedDestinationAirport, setSelectedDestinationAirport] = useState<AirportData | null>(
    null,
  )
  const debouncedToSearchTerm = useDebounce(destinationSearchTerm, 300)
  const { data: destinationAirports, isSuccess: destinationIsSuccess } = useSearchAirportsByName({
    searchTerm: debouncedToSearchTerm,
  })
  const destinationAirportsCodes = Object.keys(destinationAirports || {})
  const openDestinationSuggestions = useCallback(() => {
    setDestinationIsOpen(true)
  }, [])
  const closeDestinationSuggestions = useCallback(() => {
    setDestinationIsOpen(false)
  }, [])
  const selectDestination = (airport: AirportData) => {
    setDestinationIsOpen(false)
    setSelectedDestinationAirport(airport)
    setFieldValue('to', airport.code)
    setFieldValue('toLabel', airport.name + ' (' + airport.code + ')')
  }
  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDestinationAirport(null)
    setFieldValue('to', null)
    setFieldValue('toLabel', null)
    setDestinationSearchTerm(e.target.value)
  }
  const handleDestinationBlur = () => {
    setDestinationIsOpen(false)
    if (selectedDestinationAirport) {
      setDestinationSearchTerm(selectedDestinationAirport.name)
    }
  }

  // TODO: Swap doesn't work after navigation between pages. Need to store the selected airports in the context to make it work
  const swapAirports = () => {
    if (!selectedDepartureAirport || !selectedDestinationAirport) {
      return
    }
    const from = selectedDepartureAirport
    const to = selectedDestinationAirport
    setSelectedDepartureAirport(to)
    setSelectedDestinationAirport(from)
    setFieldValue('from', to.code)
    setFieldValue('to', from.code)
    setFieldValue('fromLabel', to.name + ' (' + to.code + ')')
    setFieldValue('toLabel', from.name + ' (' + from.code + ')')
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
              bgcolor="white">
              {values.fromLabel}
            </Typography>
          )}
        </Box>
        <Button
          disabled={!selectedDepartureAirport || !selectedDestinationAirport}
          onClick={swapAirports}
          variant="outlined"
          sx={{ width: 32, height: 32, padding: 0, minWidth: 32, alignSelf: 'center' }}>
          <SwapHorizIcon
            sx={{
              width: 24,
              height: 24,
              color: !selectedDepartureAirport || !selectedDestinationAirport ? 'grey' : 'black',
            }}
          />
        </Button>
        <Box position="relative" flexGrow={1}>
          <Field
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
              bgcolor="white">
              {values.toLabel}
            </Typography>
          )}
        </Box>
      </Stack>
      <Popover
        sx={{ mt: 1.2 }}
        open={departureIsSuccess && departureIsOpen && departureAirportsCodes.length > 0}
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
          {departureIsSuccess &&
            departureAirportsCodes.map((airportCode, index, array) => {
              const airport = departureAirports[airportCode]
              return (
                <Location
                  key={airportCode}
                  airport={airport}
                  noBorder={array.length - 1 === index}
                  onClick={selectDeparture}
                />
              )
            })}
        </Stack>
      </Popover>
      <Popover
        sx={{ mt: 1.2 }}
        open={destinationIsSuccess && destinationIsOpen && destinationAirportsCodes.length > 0}
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
          {destinationIsSuccess &&
            destinationAirportsCodes.map((airportCode, index, array) => {
              const airport = destinationAirports[airportCode]
              return (
                <Location
                  key={airportCode}
                  airport={airport}
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
