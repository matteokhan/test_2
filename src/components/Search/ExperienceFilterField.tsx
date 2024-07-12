import { ExperienceFilterOption } from '@/types'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { FieldInputProps, Field } from 'formik'

const options: { value: ExperienceFilterOption; label: string }[] = [
  { value: 'no-night-flight', label: 'Aucun vol de nuit' },
  { value: 'short-scales', label: 'Escales courtes' },
]

const ExperienceFilter = ({ ...props }: FieldInputProps<ExperienceFilterOption>) => {
  return (
    <RadioGroup {...props}>
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

export const ExperienceFilterField = ({ name }: { name: string }) => {
  return <Field name={name} as={ExperienceFilter} />
}
