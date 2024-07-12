import { ScalesFilterOption } from '@/types'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { Field, FieldInputProps } from 'formik'

const options: { value: ScalesFilterOption; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'direct', label: 'Direct' },
  { value: '1-scale', label: "Jusqu'à 1 escale" },
  { value: '2-scale', label: "Jusqu'à 2 escales" },
]

const ScalesFilter = ({ ...props }: FieldInputProps<ScalesFilterOption>) => {
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

export const ScalesFilterField = ({ name }: { name: string }) => {
  return <Field name={name} as={ScalesFilter} />
}
