'use client'

import { SalutationOption } from '@/types'
import { FormControlLabel, Radio, RadioGroup, Stack } from '@mui/material'
import { FieldInputProps, Field } from 'formik'

const options: { value: SalutationOption; label: string }[] = [
  { value: 'Mr', label: 'Mr' },
  { value: 'Mme', label: 'Mme' },
]

const Salutation = ({ ...props }: FieldInputProps<SalutationOption>) => {
  return (
    <RadioGroup {...props}>
      <Stack direction="row" gap={0.5} height="48px">
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </Stack>
    </RadioGroup>
  )
}

export const SalutationField = ({ name }: { name: string }) => {
  return <Field name={name} as={Salutation} />
}
