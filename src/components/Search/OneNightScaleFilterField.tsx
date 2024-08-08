'use client'

import { Checkbox, FormControlLabel } from '@mui/material'
import { Field, FieldInputProps } from 'formik'

const OneNightScaleFilter = ({ ...props }: FieldInputProps<boolean>) => {
  return (
    <FormControlLabel
      {...props}
      control={<Checkbox data-testid="allowNightScalesField" />}
      label="Autoriser les escales d'une nuit"
    />
  )
}

export const OneNightScaleFilterField = ({ name }: { name: string }) => {
  return <Field name={name} as={OneNightScaleFilter} />
}
