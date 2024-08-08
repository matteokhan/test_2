'use client'

import { ScalesFilterOption } from '@/types'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { Field, FieldInputProps } from 'formik'

const options: { value: ScalesFilterOption; label: string; testId: string }[] = [
  { value: 'all', label: 'Tous', testId: 'scalesField-all' },
  { value: 'direct', label: 'Direct', testId: 'scalesField-direct' },
  {
    value: '1-scale',
    label: "Jusqu'à 1 escale",
    testId: 'scalesField-1Scale',
  },
  {
    value: '2-scale',
    label: "Jusqu'à 2 escales",
    testId: 'scalesField-2Scale',
  },
]

const ScalesFilter = ({ ...props }: FieldInputProps<ScalesFilterOption>) => {
  return (
    <RadioGroup {...props}>
      {options.map((option) => (
        <FormControlLabel
          key={option.value}
          value={option.value}
          control={<Radio data-testid={option.testId} />}
          label={option.label}
        />
      ))}
    </RadioGroup>
  )
}

export const ScalesFilterField = ({ name }: { name: string }) => {
  return <Field name={name} as={ScalesFilter} data-testid="scalesField" />
}
