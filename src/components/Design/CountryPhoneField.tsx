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
import { useField, useFormikContext } from 'formik'

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

type CountryPhoneFieldProps = Omit<TextFieldProps, 'onChange' | 'value' | 'name'> & {
  name: string
  countryCodeName: string
  onPhoneChange?: (values: [CountryCallingCode, string]) => void
}

export const CountryPhoneField = React.forwardRef<HTMLDivElement, CountryPhoneFieldProps>(
  ({ name, countryCodeName, onPhoneChange, ...props }, ref) => {
    const { setFieldValue, setFieldTouched, validateForm } = useFormikContext()
    const [phoneField, phoneMeta, _phoneHelpers] = useField(name)
    const [countryField, countryMeta, _countryHelpers] = useField(countryCodeName)

    const [selectedCountry, setSelectedCountry] = useState<CountryCode>('FR')
    const [phoneNumber, setPhoneNumber] = useState<string>('')
    const parsedPhone = new AsYouType(selectedCountry).input(phoneNumber)

    useEffect(() => {
      if (phoneField.value) {
        setPhoneNumber(phoneField.value)
      }
      if (countryField.value) {
        setSelectedCountry(phoneCodeMap[countryField.value])
      }
    }, [])

    const handleCountryChange = async (newCountry: CountryCode) => {
      setSelectedCountry(newCountry)
      const phoneCode = getPhoneCode(newCountry)
      await setFieldValue(countryCodeName, phoneCode)
      await setFieldTouched(countryCodeName, true, true)
      onPhoneChange && onPhoneChange([phoneCode, phoneNumber])
      await validateForm()
    }

    const handlePhoneChange = async (newPhone: string) => {
      setPhoneNumber(newPhone)
      await setFieldValue(name, newPhone)
      await setFieldTouched(name, true, true)
      onPhoneChange && onPhoneChange([getPhoneCode(selectedCountry), newPhone])
      await validateForm()
    }

    return (
      <FormControl fullWidth>
        <Stack direction="row">
          <FormControl variant="filled" sx={{ width: 160 }}>
            <InputLabel>Pays</InputLabel>
            <Select
              sx={{
                borderTopRightRadius: 0,
              }}
              value={selectedCountry}
              onChange={(ev) => handleCountryChange(ev.target.value as CountryCode)}
              error={countryMeta.touched && Boolean(countryMeta.error)}>
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
            {...phoneField}
            value={parsedPhone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            error={phoneMeta.touched && Boolean(phoneMeta.error)}
            helperText={phoneMeta.touched && phoneMeta.error}
          />
        </Stack>
      </FormControl>
    )
  },
)

CountryPhoneField.displayName = 'CountryPhoneField'
