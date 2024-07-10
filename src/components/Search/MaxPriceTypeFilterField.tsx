import { MaxPriceTypeFilterOption } from '@/types'
import { MenuItem, Select, Slider } from '@mui/material'
import { Field } from 'formik'

type MaxPriceTypeFilterProps = {
  field: typeof Field
}

const options: { value: MaxPriceTypeFilterOption; label: string }[] = [
  { value: 'per-person', label: 'Par Personne' },
  { value: 'total', label: 'Prix total' },
]

export const MaxPriceTypeFilterField = ({ field, ...props }: MaxPriceTypeFilterProps) => {
  return (
    <Select {...field} {...props}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  )
}
