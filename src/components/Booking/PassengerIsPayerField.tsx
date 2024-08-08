'use client'

import { Checkbox, FormControlLabel } from '@mui/material'
import { Field, FieldInputProps } from 'formik'

const PassengerIsPayer = ({ checked, ...props }: FieldInputProps<boolean>) => {
  return (
    <FormControlLabel
      {...props}
      checked={checked}
      control={<Checkbox data-testid="passengerIsPayerField" />}
      label="Ce passager règle la commande"
    />
  )
}

export const PassengerIsPayerField = ({
  name,
  checked,
  onChange,
}: {
  name: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  return <Field name={name} as={PassengerIsPayer} checked={checked} onChange={onChange} />
}
