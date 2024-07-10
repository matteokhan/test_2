import { Checkbox, FormControlLabel } from '@mui/material'
import { Field } from 'formik'

type OneNightScaleFilterProps = {
  field: typeof Field
}

export const OneNightScaleFilterField = ({ field, ...props }: OneNightScaleFilterProps) => {
  return (
    <FormControlLabel
      {...field}
      {...props}
      control={<Checkbox />}
      label="Autoriser les escales d'une nuit"
    />
  )
}
