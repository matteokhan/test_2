'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Box, Popover, Typography, Button, Stack, SxProps } from '@mui/material'
import { AirplaneIcon, CustomTextField } from '@/components'
import { Field, useFormikContext } from 'formik'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined'
import { useSearchAirportsByName } from '@/services'
import { useDebounce } from '@uidotdev/usehooks'
import { AirportData } from '@/types'

export const DepartureAndDestinationField = ({
  labels,
  sx,
}: {
  labels?: [string, string]
  sx?: SxProps
}) => {
  const anchorRef = useRef<HTMLInputElement>(null)
  const { errors, touched, setFieldValue } = useFormikContext<{
    from: string
    to: string
  }>()

  // Departure
  const [departureIsOpen, setDepartureIsOpen] = useState(false)
  const [departureSearchTerm, setDepartureSearchTerm] = useState('')
  const [selectedDepartureAirport, setSelectedDepartureAirport] = useState<AirportData | null>(null)
  const debouncedFromSearchTerm = useDebounce(departureSearchTerm, 300)
  const { data: departureAirports, isSuccess: departureIsSuccess } = useSearchAirportsByName({
    searchTerm: debouncedFromSearchTerm,
  })
  const departureAirportsCodes = Object.keys(departureAirports || {})
  const handleDepartureFocus = () => {
    setDepartureIsOpen(true)
    if (selectedDepartureAirport) {
      setDepartureSearchTerm(selectedDepartureAirport.name)
    }
  }
  const handleDepartureClose = useCallback(() => {
    setDepartureIsOpen(false)
  }, [])
  const handleDepartureClick = (airport: AirportData) => {
    setDepartureIsOpen(false)
    setSelectedDepartureAirport(airport)
    setFieldValue('from', airport.code)
    setDepartureSearchTerm(airport.name + ' (' + airport.code + ')')
  }
  const handleDepartureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDepartureAirport(null)
    setFieldValue('from', null)
    setDepartureSearchTerm(e.target.value)
  }
  const handleDepartureBlur = () => {
    if (selectedDepartureAirport) {
      setDepartureSearchTerm(selectedDepartureAirport.name)
    } else {
      setDepartureSearchTerm('')
    }
  }

  // Destination
  const [destinationIsOpen, setDestinationIsOpen] = useState(false)
  const [destinationSearchTerm, setDestinationSearchTerm] = useState('')
  const [selectedDestinationAirport, setSelectedDestinationAirport] = useState<AirportData | null>(
    null,
  )
  const debouncedToSearchTerm = useDebounce(destinationSearchTerm, 300)
  const { data: destinationAirports, isSuccess: destinationIsSuccess } = useSearchAirportsByName({
    searchTerm: debouncedToSearchTerm,
  })
  const destinationAirportsCodes = Object.keys(destinationAirports || {})
  const handleDestinationFocus = () => {
    setDestinationIsOpen(true)
    if (selectedDestinationAirport) {
      setDestinationSearchTerm(selectedDestinationAirport.name)
    }
  }
  const handleDestinationClose = useCallback(() => {
    setDestinationIsOpen(false)
  }, [])
  const handleDestinationClick = (airport: AirportData) => {
    setDestinationIsOpen(false)
    setSelectedDestinationAirport(airport)
    setFieldValue('to', airport.code)
    setDestinationSearchTerm(airport.name + ' (' + airport.code + ')')
  }
  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDestinationAirport(null)
    setFieldValue('to', null)
    setDestinationSearchTerm(e.target.value)
  }
  const handleDestinationBlur = () => {
    if (selectedDestinationAirport) {
      setDestinationSearchTerm(selectedDestinationAirport.name)
    } else {
      setDestinationSearchTerm('')
    }
  }

  return (
    <>
      <Stack
        border="1px solid"
        borderColor="grey.500"
        borderRadius="4px"
        direction="row"
        alignItems="flex-start"
        height={58}
        ref={anchorRef}
        sx={{ ...sx }}>
        <Field
          onClick={handleDepartureFocus}
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
        <Button
          variant="outlined"
          sx={{ width: 32, height: 32, padding: 0, minWidth: 32, alignSelf: 'center' }}>
          <SwapHorizIcon sx={{ width: 24, height: 24, color: 'black' }} />
        </Button>
        <Field
          onClick={handleDestinationFocus}
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
      </Stack>
      <Popover
        sx={{ mt: 1.2 }}
        open={departureIsSuccess && departureIsOpen && departureAirportsCodes.length > 0}
        anchorEl={anchorRef.current}
        onClose={handleDepartureClose}
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
                <Stack
                  key={airportCode}
                  py={1.5}
                  borderBottom="1px solid"
                  borderColor={array.length - 1 === index ? 'transparent' : 'grey.200'}
                  direction="row"
                  gap={2}
                  alignItems="center"
                  boxSizing="border-box"
                  sx={{ '&:hover': { cursor: 'pointer' } }}
                  onClick={() => handleDepartureClick(airport)}>
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
            })}
        </Stack>
      </Popover>
      <Popover
        sx={{ mt: 1.2 }}
        open={destinationIsSuccess && destinationIsOpen && destinationAirportsCodes.length > 0}
        anchorEl={anchorRef.current}
        onClose={handleDestinationClose}
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
                <Stack
                  key={airportCode}
                  py={1.5}
                  borderBottom="1px solid"
                  borderColor={array.length - 1 === index ? 'transparent' : 'grey.200'}
                  direction="row"
                  gap={2}
                  alignItems="center"
                  boxSizing="border-box"
                  sx={{ '&:hover': { cursor: 'pointer' } }}
                  onClick={() => handleDestinationClick(airport)}>
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
            })}
        </Stack>
      </Popover>
    </>
  )
}
