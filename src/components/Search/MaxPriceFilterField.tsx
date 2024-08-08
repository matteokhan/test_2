'use client'

import React from 'react'
import { Slider } from '@mui/material'
import { Field, FieldInputProps } from 'formik'

type MaxFilterProps = FieldInputProps<number | number[]> & {
  highestPrice: number
  lowestPrice: number
}

export const MaxPriceFilter = ({ highestPrice, lowestPrice, ...props }: MaxFilterProps) => {
  return (
    <Slider
      {...props}
      size="small"
      min={lowestPrice}
      max={highestPrice}
      step={100}
      data-testid="maxPriceSliderField"
    />
  )
}

export const MaxPriceFilterField = ({
  name,
  highestPrice,
  lowestPrice,
}: {
  name: string
  highestPrice: number
  lowestPrice: number
}) => {
  return (
    <Field name={name} as={MaxPriceFilter} highestPrice={highestPrice} lowestPrice={lowestPrice} />
  )
}
