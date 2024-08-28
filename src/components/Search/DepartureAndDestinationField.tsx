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
  fieldNames,
  sx,
}: {
  labels?: [string, string]
  fieldNames?: [string, string]
  sx?: SxProps
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const anchorRef = useRef<HTMLInputElement>(null)
  const { values, errors, touched, setFieldValue } = useFormikContext<{
    from: string
    to: string
  }>()
  const debouncedFromSearchTerm = useDebounce(values.from, 300)
  const { data: departureAirports, isSuccess } = useSearchAirportsByName({
    searchTerm: debouncedFromSearchTerm,
  })
  const departureAirportsCodes = Object.keys(departureAirports || {})

  const handleFocus = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleClick = (airport: AirportData) => {
    setIsOpen(false)
    setFieldValue('from', airport.code)
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
        sx={{ ...sx }}>
        <Field
          onClick={handleFocus}
          as={CustomTextField}
          inputRef={anchorRef}
          noBorder={true}
          name={fieldNames ? fieldNames[0] : 'from'}
          label={labels ? labels[0] : 'Vol au départ de'}
          sx={{ flexGrow: 1 }}
          error={touched.from && errors.from}
          helperText={touched.from && errors.from}
          inputProps={{
            'data-testid': 'fromField',
          }}
        />
        <Button
          variant="outlined"
          sx={{ width: 32, height: 32, padding: 0, minWidth: 32, alignSelf: 'center' }}>
          <SwapHorizIcon sx={{ width: 24, height: 24, color: 'black' }} />
        </Button>
        <Field
          as={CustomTextField}
          noBorder={true}
          name={fieldNames ? fieldNames[1] : 'to'}
          label={labels ? labels[1] : 'Vol à destination de'}
          sx={{ flexGrow: 1 }}
          error={touched.to && errors.to}
          helperText={touched.to && errors.to}
          inputProps={{
            'data-testid': 'toField',
          }}
        />
      </Stack>
      <Popover
        sx={{ mt: 1.2 }}
        open={isSuccess && isOpen && departureAirportsCodes.length > 0}
        anchorEl={anchorRef.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        disableRestoreFocus
        disableScrollLock
        disableAutoFocus>
        <Stack px={4} py={1} width={484}>
          {isSuccess &&
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
                  onClick={() => handleClick(airport)}>
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
