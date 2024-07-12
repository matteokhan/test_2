import { MaxPriceTypeFilterOption } from '@/types'
import { MenuItem, Select } from '@mui/material'
import { Field, FieldInputProps, useField } from 'formik'

const options: { value: MaxPriceTypeFilterOption; label: string }[] = [
  { value: 'per-person', label: 'Par Personne' },
  { value: 'total', label: 'Prix total' },
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
  return <Field name={name} as={MaxPriceTypeFilter} />
}
