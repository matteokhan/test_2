'use client'

import React, { useEffect, useState } from 'react'
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

export const CountryPhoneField = React.forwardRef<CountryPhoneFieldProps, CountryPhoneFieldProps>(
  (props, ref) => {
    const { values, onChange } = props
    const [selectedCountry, setSelectedCountry] = useState<CountryCode>('FR')
    const [phoneNumber, setPhoneNumber] = useState<string>('')
    const parsedPhone = new AsYouType(selectedCountry).input(phoneNumber)

    useEffect(() => {
      if (values[1]) {
        setPhoneNumber(values[1])
      }
      if (values[0]) {
        setSelectedCountry(phoneCodeMap[values[0]])
      }
    }, [])

    useEffect(() => {
      onChange([getPhoneCode(selectedCountry), phoneNumber])
    }, [selectedCountry, phoneNumber])

    return (
      <FormControl fullWidth>
        <Stack direction="row">
          <FormControl variant="filled" sx={{ width: 160 }}>
            <InputLabel>Pais</InputLabel>
            <Select
              sx={{
                borderTopRightRadius: 0,
              }}
              value={selectedCountry ? selectedCountry : 'FR'}
              onChange={(ev) => setSelectedCountry(ev.target.value as CountryCode)}>
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
            fullWidth
            sx={{ '& .MuiInputBase-root': { borderTopLeftRadius: 0 } }}
            {...props}
            value={parsedPhone}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </Stack>
      </FormControl>
    )
  },
)
