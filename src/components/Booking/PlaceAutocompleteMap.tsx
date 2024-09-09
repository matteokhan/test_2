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
  const places = useMapsLibrary('places')

  useEffect(() => {
    if (!places || !inputRef.current) return

    const options = {
      fields: ['geometry', 'name', 'formatted_address'],
    }
    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options))
  }, [places])

  useEffect(() => {
    if (!placeAutocomplete) return

    placeAutocomplete.addListener('place_changed', () => {
      console.log(placeAutocomplete.getPlace())
      onPlaceSelect(placeAutocomplete.getPlace())
    })
  }, [onPlaceSelect, placeAutocomplete])

  return (
    <div className="autocomplete-container">
      <CustomTextField
        data-testid="selectAgencyMap-searchField"
        fullWidth
        label={null}
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
    </div>
  )
}
