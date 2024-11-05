'use client'

import React, { useEffect, useState, useCallback } from 'react'
import {
  TextField,
  TextFieldProps,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  AsYouType,
  CountryCallingCode,
  CountryCode,
  getCountries,
  getPhoneCode,
} from 'libphonenumber-js'
import ReactCountryFlag from 'react-country-flag'
import countries from 'i18n-iso-countries'

countries.registerLocale(require('i18n-iso-countries/langs/fr.json'))

type CountryData = {
  code: CountryCode
  name: string
  phoneCode: CountryCallingCode
}

const countryList: CountryData[] = getCountries().map((country) => ({
  code: country as CountryCode,
  name: countries.getName(country, 'fr') || country,
  phoneCode: getPhoneCode(country),
}))

const phoneCodeMap = countryList.reduce(
  (acc, country) => {
    acc[country.phoneCode] = country.code
    return acc
  },
  {} as Record<CountryCallingCode, CountryCode>,
)

type CountryPhoneFieldProps = Omit<TextFieldProps, 'onChange'> & {
  values: [CountryCallingCode, string]
  onChange: (values: [CountryCallingCode, string]) => void
}

export const CountryPhoneField = React.forwardRef<HTMLDivElement, CountryPhoneFieldProps>(
  (props) => {
    const { values, onChange, ...textFieldProps } = props
    const [localState, setLocalState] = useState({
      country: 'FR' as CountryCode,
      phone: '',
      initialized: false,
    })

    // Initialize values only once
    useEffect(() => {
      if (!localState.initialized && values[1]) {
        setLocalState({
          country: phoneCodeMap[values[0]] || 'FR',
          phone: values[1],
          initialized: true,
        })
      }
    }, [values, localState.initialized])

    // Format phone number
    const formatter = new AsYouType(localState.country)
    const formattedPhone = formatter.input(localState.phone)

    const handlePhoneChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPhone = e.target.value
        setLocalState((prev) => ({ ...prev, phone: newPhone }))
        onChange([getPhoneCode(localState.country), newPhone])
      },
      [localState.country, onChange],
    )

    const handleCountryChange = useCallback(
      (e: React.ChangeEvent<{ value: unknown }>) => {
        const newCountry = e.target.value as CountryCode
        setLocalState((prev) => ({ ...prev, country: newCountry }))
        onChange([getPhoneCode(newCountry), localState.phone])
      },
      [localState.phone, onChange],
    )

    return (
      <FormControl fullWidth>
        <Stack direction="row">
          <FormControl variant="filled" sx={{ width: 160 }}>
            <InputLabel>Pays</InputLabel>
            <Select
              sx={{
                borderTopRightRadius: 0,
              }}
              value={localState.country}
              onChange={handleCountryChange}>
              {countryList.map((country) => (
                <MenuItem value={country.code} key={country.code}>
                  <Stack direction="row" gap={1} alignItems="center">
                    <ReactCountryFlag countryCode={country.code} svg />
                    <p>(+{country.phoneCode})</p>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            {...textFieldProps}
            fullWidth
            sx={{ '& .MuiInputBase-root': { borderTopLeftRadius: 0 } }}
            value={formattedPhone}
            onChange={handlePhoneChange}
          />
        </Stack>
      </FormControl>
    )
  },
)

CountryPhoneField.displayName = 'CountryPhoneField'
