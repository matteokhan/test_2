'use client'

import { Checkbox, FormControlLabel } from '@mui/material'
import { Field, FieldInputProps, useFormikContext } from 'formik'

const OneNightScaleFilter = ({
  disabled,
  ...props
}: FieldInputProps<boolean> & { disabled?: boolean }) => {
  const { values } = useFormikContext<{ oneNightScale: boolean }>()
  return (
    <FormControlLabel
      {...props}
      control={<Checkbox checked={values.oneNightScale} data-testid="allowNightScalesField" />}
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
