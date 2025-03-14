'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Popover, Stack } from '@mui/material'
import { SearchTextField, Location } from '@/components'
import { Field, useFormikContext } from 'formik'
import { useLocationsByName } from '@/services'
import { useDebounce } from '@uidotdev/usehooks'
import { LocationData, SearchFlightSegmentType } from '@/types'

export const DepartureField = ({ onChange }: { onChange?: (location: LocationData) => void }) => {
  const anchorRef = useRef<HTMLInputElement>(null)
  const { errors, touched, setFieldValue } = useFormikContext<{
    from: string
    fromLabel: string
    fromCountry: string
    fromCountryCode: string
    fromType: SearchFlightSegmentType
  }>()

  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const { data: locations, isSuccess: isSuccess } = useLocationsByName({
    searchTerm: debouncedSearchTerm,
  })
  const locationsCodes = Object.keys(locations || {})
  const handleFocus = () => {
    setIsOpen(true)
    if (selectedLocation) {
      setSearchTerm(selectedLocation.name)
    }
  }
  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])
  const handleSelectLocation = useCallback((location: LocationData) => {
    document.dispatchEvent(new CustomEvent('departureSelected', { detail: { location } }))
    selectLocation(location)
  }, [])
  const selectLocation = (location: LocationData) => {
    setIsOpen(false)
    setSelectedLocation(location)
    setFieldValue('from', location.code)
    setFieldValue('fromLabel', location.name + ' (' + location.code + ')')
    setFieldValue('fromCountry', location.country_name)
    setFieldValue('fromCountryCode', location.country_code)
    setFieldValue(
      'fromType',
      location.category === 'City' ? SearchFlightSegmentType.CITY : SearchFlightSegmentType.PLACE,
    )
    setSearchTerm(location.name + ' (' + location.code + ')')
    if (onChange) onChange(location)
  }
  const resetLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedLocation(null)
    setFieldValue('from', '')
    setFieldValue('fromLabel', '')
    setFieldValue('fromCountry', '')
    setFieldValue('fromCountryCode', '')
    setFieldValue('fromType', '')
    setSearchTerm(e.target.value)
  }
  const handleBlur = () => {
    setIsOpen(false)
    if (selectedLocation) {
      setSearchTerm(selectedLocation.name)
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
          onChange={resetLocation}
          onBlur={handleBlur}
          value={searchTerm}
        />
      </Stack>
      <Popover
        elevation={0}
        sx={{ mt: 1.2 }}
        open={isSuccess && isOpen && locationsCodes.length > 0}
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
            locationsCodes.map((code, index, array) => {
              const location = locations[code]
              return (
                <Location
                  key={code}
                  location={location}
                  noBorder={array.length - 1 === index}
                  onClick={handleSelectLocation}
                />
              )
            })}
        </Stack>
      </Popover>
    </>
  )
}
