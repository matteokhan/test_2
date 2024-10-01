'use client'

import { useLocationData } from '@/services'
import { LocationCode } from '@/types'
import { locationExtensionOrName } from '@/utils'
import { Box, Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material'
import { FieldHookConfig, useField } from 'formik'

export const AirportFilterField = ({
  airports,
  ...props
}: FieldHookConfig<LocationCode[]> & { airports: LocationCode[] }) => {
  const [_, { value }, { setValue }] = useField(props)
  return (
    <FormGroup data-testid="airportFilterField">
      <Box pb={1}>
        {airports.map((airport) => {
          const { data: locationData } = useLocationData({ locationCode: airport })
          return (
            <Stack key={airport} justifyContent="space-between" direction="row" alignItems="center">
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
      </Box>
    </FormGroup>
  )
}
