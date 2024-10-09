'use client'

import { useAirlinesData } from '@/services'
import { AirlineFilterData } from '@/types'
import { Checkbox, FormControlLabel, FormGroup, Stack, Typography } from '@mui/material'
import { FieldHookConfig, useField } from 'formik'

export const AirlinesFilterField = ({
  airlines,
  ...props
}: FieldHookConfig<string[]> & { airlines: AirlineFilterData[] | undefined }) => {
  const [_, { value }, { setValue }] = useField(props)
  const { data: airlinesData } = useAirlinesData()

  const handleChange = (carrier: string) => {
    if (value.includes(carrier)) {
      setValue(value.filter((v) => v !== carrier))
      return
    }
    setValue([...value, carrier])
  }

  return (
    <FormGroup data-testid="airlinesFilterField">
      {airlines?.map((airline) => {
        const airlineName = `${airlinesData ? airlinesData[airline.carrier]?.name : ''} (${airline.carrier})`
        return (
          <Stack
            key={airline.carrier}
            justifyContent="space-between"
            direction="row"
            alignItems="center">
            <FormControlLabel
              value={airline.carrier}
              control={<Checkbox checked={value.includes(airline.carrier)} />}
              name={props.name}
              label={airlineName}
              onChange={() => {
                handleChange(airline.carrier)
              }}
            />
            <Typography variant="bodyMd">
              {airline.price}
              {airline.currencySymbol}
            </Typography>
          </Stack>
        )
      })}
    </FormGroup>
  )
}
