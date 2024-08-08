'use client'

import { MaxPriceTypeFilterOption } from '@/types'
import { MenuItem, Select } from '@mui/material'
import { Field, FieldInputProps } from 'formik'

const options: { value: MaxPriceTypeFilterOption; label: string; testId: string }[] = [
  {
    value: 'per-person',
    label: 'Par Personne',
    testId: 'maxPriceTypeField-perPerson',
  },
  { value: 'total', label: 'Prix total', testId: 'maxPriceTypeField-total' },
]

const MaxPriceTypeFilter = ({ ...props }: FieldInputProps<MaxPriceTypeFilterOption>) => {
  return (
    <Select {...props}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  )
}

export const MaxPriceTypeFilterField = ({ name }: { name: string }) => {
  return <Field name={name} as={MaxPriceTypeFilter} data-testid="maxPriceTypeField" />
}
