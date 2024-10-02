'use client'

import { useLocationData } from '@/services'
import { LocationCode } from '@/types'
import { locationExtensionOrName } from '@/utils'
import { Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material'
import { FieldHookConfig, useField } from 'formik'

export const AirportFilterField = ({
  airports,
  ...props
}: FieldHookConfig<LocationCode[]> & { airports: LocationCode[] }) => {
  const [_, { value }, { setValue }] = useField(props)
  return (
    <FormGroup data-testid="airportFilterField">
      {airports.map((airport) => {
        const { data: locationData } = useLocationData({ locationCode: airport })
        return (
          <Stack key={airport}>
            <FormControlLabel
              value={airport}
              control={<Checkbox />}
              name={props.name}
              label={locationExtensionOrName(locationData) + ' (' + airport + ')'}
              onChange={() => {
                if (!value.includes(airport)) setValue([...value, airport])
                else setValue(value.filter((v) => v !== airport))
              }}
            />
          </Stack>
        )
      })}
    </FormGroup>
  )
}
