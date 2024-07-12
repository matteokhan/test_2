import { Slider } from '@mui/material'
import { Field, FieldHookConfig, FieldInputProps } from 'formik'

export const MaxPriceFilter = ({ ...props }: FieldInputProps<number | number[]>) => {
  return <Slider {...props} size="small" min={50} max={1000} step={10} />
}

export const MaxPriceFilterField = ({ name }: { name: string }) => {
  return <Field name={name} as={MaxPriceFilter} />
}
