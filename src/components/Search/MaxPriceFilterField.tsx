import { Slider } from '@mui/material'
import { Field } from 'formik'

type MaxPriceFilterProps = {
  field: typeof Field
}

export const MaxPriceFilterField = ({ field, ...props }: MaxPriceFilterProps) => {
  return <Slider {...field} {...props} size="small" min={50} max={1000} step={10} />
}
