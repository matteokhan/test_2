'use client'

import { Checkbox, FormControlLabel } from '@mui/material'
import { Field, FieldInputProps } from 'formik'

const OneNightScaleFilter = ({
  disabled,
  ...props
}: FieldInputProps<boolean> & { disabled?: boolean }) => {
  return (
    <FormControlLabel
      {...props}
      control={<Checkbox data-testid="allowNightScalesField" />}
      label="Autoriser les escales d'une nuit"
      disabled={disabled}
    />
  )
}

export const OneNightScaleFilterField = ({
  name,
  disabled,
}: {
  name: string
  disabled?: boolean
}) => {
  return <Field name={name} as={OneNightScaleFilter} disabled={disabled} />
}
