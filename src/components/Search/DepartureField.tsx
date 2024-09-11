'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Box, Popover, Typography, Stack, SxProps } from '@mui/material'
import { AirplaneIcon, SearchTextField } from '@/components'
import { Field, useFormikContext } from 'formik'
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

export const DepartureField = ({
  onSearchTermChange,
  onChange,
}: {
  onSearchTermChange: (term: string) => void
  onChange?: (airport: AirportData) => void
}) => {
  const anchorRef = useRef<HTMLInputElement>(null)
  const { errors, touched, setFieldValue } = useFormikContext<{
    from: string
  }>()

  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAirport, setSelectedAirport] = useState<AirportData | null>(null)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const { data: airports, isSuccess: isSuccess } = useSearchAirportsByName({
    searchTerm: debouncedSearchTerm,
  })
  const airportsCodes = Object.keys(airports || {})
  const handleFocus = () => {
    setIsOpen(true)
    if (selectedAirport) {
      setSearchTerm(selectedAirport.name)
    }
  }
  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])
  const handleClick = (airport: AirportData) => {
    setIsOpen(false)
    setSelectedAirport(airport)
    setFieldValue('from', airport.code)
    setSearchTerm(airport.name + ' (' + airport.code + ')')
    onSearchTermChange(airport.name + ' (' + airport.code + ')')
    if (onChange) onChange(airport)
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAirport(null)
    setFieldValue('from', null)
    setSearchTerm(e.target.value)
  }
  const handleBlur = () => {
    setIsOpen(false)
    if (selectedAirport) {
      setSearchTerm(selectedAirport.name)
    } else {
      setSearchTerm('')
    }
  }

  return (
    <>
      <Stack ref={anchorRef}>
        <Field
          onClick={handleFocus}
          as={SearchTextField}
          sx={{ flexGrow: 1 }}
          error={touched.from && errors.from}
          helperText={touched.from && errors.from}
          inputProps={{
            'data-testid': 'departureField',
          }}
          label="Ville ou aéroport"
          onChange={handleChange}
          onBlur={handleBlur}
          value={searchTerm}
        />
      </Stack>
      <Popover
        elevation={0}
        sx={{ mt: 1.2 }}
        open={isSuccess && isOpen && airportsCodes.length > 0}
        anchorEl={anchorRef.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        disableRestoreFocus
        disableScrollLock
        disableAutoFocus>
        <Stack py={1} px={2} minWidth={360}>
          {isSuccess &&
            airportsCodes.map((airportCode, index, array) => {
              const airport = airports[airportCode]
              return (
                <Location
                  key={airportCode}
                  airport={airport}
                  noBorder={array.length - 1 === index}
                  onClick={handleClick}
                />
              )
            })}
        </Stack>
      </Popover>
    </>
  )
}
