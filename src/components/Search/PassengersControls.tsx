'use client'

import React, { useEffect, useState } from 'react'
import { Box, Typography, Button, Stack } from '@mui/material'
import { useFormikContext } from 'formik'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

export const PassengersControls = () => {
  const { values, setFieldValue } = useFormikContext<{
    adults: number
    childrens: number
    infants: number
  }>()

  const [maxPassengersReached, setMaxPassengersReached] = useState(false)
  const [maxInfantsReached, setMaxInfantsReached] = useState(false)
  const MAX_PASSENGERS = 9

  useEffect(() => {
    let totalPassengers = values.adults + values.childrens + values.infants

    setMaxPassengersReached(totalPassengers === MAX_PASSENGERS)
    setMaxInfantsReached(values.infants === values.adults)
  }, [values.adults, values.childrens, values.infants])

  const updatePassengers = (
    field: 'adults' | 'childrens' | 'infants',
    operation: 'add' | 'subtract',
  ) => {
    const currentValue = values[field]
    const newValue = operation === 'add' ? currentValue + 1 : Math.max(0, currentValue - 1)
    if (field === 'adults' && operation === 'subtract' && values.adults === values.infants) {
      setFieldValue('infants', newValue)
    }
    setFieldValue(field, newValue)
  }

  return (
    <Stack gap={1} data-testid="passengersControls">
      <Stack direction="row" justifyContent="space-between">
        <Box>
          <Typography variant="titleSm">Adultes</Typography>
          <Typography variant="bodyMd" color="grey.800">
            + 12 ans
          </Typography>
        </Box>
        <Stack direction="row" gap={1.7} alignItems="center">
          <Button
            data-testid="passengersControls-adults-subtract"
            variant="outlined"
            onClick={() => updatePassengers('adults', 'subtract')}
            disabled={values.adults <= 1}
            sx={{ width: 32, height: 32, padding: 0, minWidth: 32 }}>
            <RemoveIcon sx={{ width: 16, height: 16 }} />
          </Button>
          <Typography variant="bodyLg">{values.adults}</Typography>
          <Button
            data-testid="passengersControls-adults-add"
            variant="outlined"
            onClick={() => updatePassengers('adults', 'add')}
            sx={{ width: 32, height: 32, padding: 0, minWidth: 32 }}
            disabled={maxPassengersReached}>
            <AddIcon sx={{ width: 16, height: 16 }} />
          </Button>
        </Stack>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Box>
          <Typography variant="titleSm">Enfants</Typography>
          <Typography variant="bodyMd" color="grey.800">
            2 - 11 ans
          </Typography>
        </Box>
        <Stack direction="row" gap={1.7} alignItems="center">
          <Button
            data-testid="passengersControls-childrens-subtract"
            variant="outlined"
            onClick={() => updatePassengers('childrens', 'subtract')}
            disabled={values.childrens <= 0}
            sx={{ width: 32, height: 32, padding: 0, minWidth: 32 }}>
            <RemoveIcon sx={{ width: 16, height: 16 }} />
          </Button>
          <Typography variant="bodyLg">{values.childrens}</Typography>
          <Button
            data-testid="passengersControls-childrens-add"
            variant="outlined"
            onClick={() => updatePassengers('childrens', 'add')}
            sx={{ width: 32, height: 32, padding: 0, minWidth: 32 }}
            disabled={maxPassengersReached}>
            <AddIcon sx={{ width: 16, height: 16 }} />
          </Button>
        </Stack>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Box>
          <Typography variant="titleSm">Bébés</Typography>
          <Typography variant="bodyMd" color="grey.800">
            Moins de 2 ans
          </Typography>
        </Box>
        <Stack direction="row" gap={1.7} alignItems="center">
          <Button
            data-testid="passengersControls-infant-subtract"
            variant="outlined"
            onClick={() => updatePassengers('infants', 'subtract')}
            disabled={values.infants <= 0}
            sx={{ width: 32, height: 32, padding: 0, minWidth: 32 }}>
            <RemoveIcon sx={{ width: 16, height: 16 }} />
          </Button>
          <Typography variant="bodyLg">{values.infants}</Typography>
          <Button
            data-testid="passengersControls-infants-add"
            variant="outlined"
            onClick={() => updatePassengers('infants', 'add')}
            sx={{ width: 32, height: 32, padding: 0, minWidth: 32 }}
            disabled={maxPassengersReached || maxInfantsReached}>
            <AddIcon sx={{ width: 16, height: 16 }} />
          </Button>
        </Stack>
      </Stack>
    </Stack>
  )
}
