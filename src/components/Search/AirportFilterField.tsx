'use client'

import { useLocationData } from '@/services'
import { AirportFilter, AirportFilterData } from '@/types'
import { locationExtensionOrName } from '@/utils'
import { Box, Checkbox, FormControlLabel, FormGroup, Stack, Typography } from '@mui/material'
import { FieldHookConfig, useField } from 'formik'

export const AirportFilterField = ({
  airportFilter,
  ...props
}: FieldHookConfig<AirportFilterData[]> & { airportFilter?: AirportFilter }) => {
  const [_, { value }, { setValue }] = useField(props)

  const handleChange = (type: string, airport: string) => {
    if (airportFilter) {
      if (!value.find((v) => v.routeIndex === airportFilter.routeIndex)) {
        value.push({ routeIndex: airportFilter.routeIndex, from: [], to: [] })
      }
      if (type === 'from') {
        const index = value.findIndex((v) => v.routeIndex === airportFilter.routeIndex)
        if (value[index].from.includes(airport)) {
          value[index].from = value[index].from.filter((v) => v !== airport)
        } else {
          value[index].from.push(airport)
        }
        setValue([...value])
      } else {
        const index = value.findIndex((v) => v.routeIndex === airportFilter.routeIndex)
        if (value[index].to.includes(airport)) {
          value[index].to = value[index].to.filter((v) => v !== airport)
        } else {
          value[index].to.push(airport)
        }
        setValue([...value])
      }
    }
  }

  return (
    <FormGroup data-testid="airportFilterField">
      {airportFilter && airportFilter.from.length > 1 && (
        <Box pb={1}>
          <Typography variant="titleMd" pb={1}>
            Décoller depuis
          </Typography>
          {airportFilter?.from?.map((airport) => {
            const { data: locationData } = useLocationData({ locationCode: airport })
            return (
              <Stack
                key={airport}
                justifyContent="space-between"
                direction="row"
                alignItems="center">
                <FormControlLabel
                  value={airport}
                  control={<Checkbox />}
                  name={props.name}
                  label={locationExtensionOrName(locationData) + ' (' + airport + ')'}
                  onChange={() => {
                    handleChange('from', airport)
                  }}
                />
              </Stack>
            )
          })}
        </Box>
      )}
      {airportFilter && airportFilter.to.length > 1 && (
        <Box>
          <Typography variant="titleMd" pb={1}>
            Attérir à
          </Typography>

          {airportFilter?.to?.map((airport) => {
            const { data: locationData } = useLocationData({ locationCode: airport })
            return (
              <Stack
                key={airport}
                justifyContent="space-between"
                direction="row"
                alignItems="center">
                <FormControlLabel
                  value={airport}
                  control={<Checkbox />}
                  name={props.name}
                  label={locationExtensionOrName(locationData) + ' (' + airport + ')'}
                  onChange={() => {
                    handleChange('to', airport)
                  }}
                />
              </Stack>
            )
          })}
        </Box>
      )}
    </FormGroup>
  )
}
