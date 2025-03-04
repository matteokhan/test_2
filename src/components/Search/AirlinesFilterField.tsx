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

  // Assurez-vous que value est toujours un tableau
  const safeValue = Array.isArray(value) ? value : [];

  const handleChange = (carrier: string) => {
    // Utiliser safeValue au lieu de value directement
    if (safeValue.includes(carrier)) {
      setValue(safeValue.filter((v) => v !== carrier))
      return
    }
    setValue([...safeValue, carrier])
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
              control={<Checkbox checked={safeValue.includes(airline.carrier)} />}
              name={props.name}
              label={airlineName}
              onChange={() => {
                handleChange(airline.carrier)
              }}
            />
            <Typography variant="bodyMd">
              {airline.price.toFixed(2)}
              {airline.currencySymbol}
            </Typography>
          </Stack>
        )
      })}
    </FormGroup>
  )
}