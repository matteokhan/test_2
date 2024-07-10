import { ScalesFilterOption } from '@/types'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { Field } from 'formik'

type ScalesFilterProps = {
  field: typeof Field
}

const options: { value: ScalesFilterOption; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'direct', label: 'Direct' },
  { value: '1-scale', label: "Jusqu'à 1 escale" },
  { value: '2-scale', label: "Jusqu'à 2 escales" },
]

export const ScalesFilterField = ({ field, ...props }: ScalesFilterProps) => {
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
