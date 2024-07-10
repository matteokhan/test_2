import { ExperienceFilterOption } from '@/types'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { Field } from 'formik'

type ExperienceFilterProps = {
  field: typeof Field
}

const options: { value: ExperienceFilterOption; label: string }[] = [
  { value: 'no-night-flight', label: 'Aucun vol de nuit' },
  { value: 'short-scales', label: 'Escales courtes' },
]

export const ExperienceFilterField = ({ field, ...props }: ExperienceFilterProps) => {
  return (
    <RadioGroup {...field} {...props}>
      {options.map((option) => (
        <FormControlLabel
          key={option.value}
          value={option.value}
          control={<Radio />}
          label={option.label}
        />
      ))}
    </RadioGroup>
  )
}
