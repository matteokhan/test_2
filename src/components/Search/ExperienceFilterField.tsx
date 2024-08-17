'use client'

import { ExperienceFilterOption } from '@/types'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { FieldInputProps, Field } from 'formik'

const options: { value: ExperienceFilterOption; label: string; testId: string }[] = [
  {
    value: 'no-night-flight',
    label: 'Aucun vol de nuit',
    testId: 'experienceField-noNightFlight',
  },
  {
    value: 'short-scales',
    label: 'Escales courtes',
    testId: 'experienceField-shortScales',
  },
]

const ExperienceFilter = ({
  disabled,
  ...props
}: FieldInputProps<ExperienceFilterOption> & { disabled?: boolean }) => {
  return (
    <RadioGroup {...props}>
      {options.map((option) => (
        <FormControlLabel
          key={option.value}
          value={option.value}
          control={<Radio data-testid={option.testId} />}
          label={option.label}
          disabled={disabled}
        />
      ))}
    </RadioGroup>
  )
}

export const ExperienceFilterField = ({ name, disabled }: { name: string; disabled?: boolean }) => {
  return (
    <Field name={name} as={ExperienceFilter} data-testid="experienceField" disabled={disabled} />
  )
}
