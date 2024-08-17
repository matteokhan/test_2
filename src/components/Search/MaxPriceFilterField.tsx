'use client'

import React from 'react'
import { Slider } from '@mui/material'
import { Field, FieldInputProps } from 'formik'

type MaxFilterProps = FieldInputProps<number | number[]> & {
  highestPrice: number
  lowestPrice: number
  disabled?: boolean
}

export const MaxPriceFilter = ({
  highestPrice,
  lowestPrice,
  disabled,
  ...props
}: MaxFilterProps) => {
  return (
    <Slider
      {...props}
      size="small"
      min={lowestPrice}
      max={highestPrice}
      step={100}
      data-testid="maxPriceSliderField"
      disabled={disabled}
    />
  )
}

export const MaxPriceFilterField = ({
  name,
  highestPrice,
  lowestPrice,
  disabled,
}: {
  name: string
  highestPrice?: number
  lowestPrice?: number
  disabled?: boolean
}) => {
  return (
    <Field
      name={name}
      as={MaxPriceFilter}
      highestPrice={highestPrice}
      lowestPrice={lowestPrice}
      disabled={disabled}
    />
  )
}
