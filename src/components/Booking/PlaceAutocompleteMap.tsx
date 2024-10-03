import React, { useRef, useEffect, useState } from 'react'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { CustomTextField } from '@/components'

interface Props {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void
}

export const PlaceAutocompleteMap = ({ onPlaceSelect }: Props) => {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  // const places = useMapsLibrary('places')
  // const placesService = new google.maps.places.AutocompleteService()

  // useEffect(() => {
  //   if (!places || !inputRef.current) return

  //   const options = {
  //     fields: ['geometry', 'name', 'formatted_address'],
  //   }
  //   setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options))
  // }, [places])

  // useEffect(() => {
  //   if (!places || !inputRef.current) return

  //   const options = {
  //     fields: ['geometry', 'name', 'formatted_address'],
  //   }
  //   const autocomplete = new places.Autocomplete(inputRef.current, options)
  //   setPlaceAutocomplete(autocomplete)

  //   return () => {
  //     // Clean up the autocomplete instance when the component unmounts
  //     if (autocomplete) {
  //       autocomplete.unbindAll()
  //     }
  //   }
  // }, [places])

  // useEffect(() => {
  //   if (!placeAutocomplete) return
  //   console.log('listener!!!')
  //   placeAutocomplete.addListener('place_changed', () => {
  //     console.log('place changed', placeAutocomplete.getPlace())
  //     onPlaceSelect(placeAutocomplete.getPlace())
  //   })
  // }, [onPlaceSelect, placeAutocomplete])
  // const handleChange = (value: string) => {
  //   placesService.getPlacePredictions({ input: value }, (predictions, status) => {
  //     console.log('Predictions:', predictions)
  //     console.log('Status:', status)
  //   })
  // }

  return (
    <div className="autocomplete-container">
      <CustomTextField
        data-testid="selectAgencyMap-searchField"
        fullWidth
        label={null}
        onChange={(e) => {
          // handleChange(e.target.value)
        }}
        InputProps={{
          inputRef: inputRef,
          placeholder: 'Rechercher',
          hiddenLabel: true,
          startAdornment: (
            <InputAdornment position="start" className="MuiInputAdornment-hiddenLabel">
              <SearchIcon data-testid={null} />
            </InputAdornment>
          ),
        }}
      />
      {/* <input ref={inputRef} /> */}
    </div>
  )
}
