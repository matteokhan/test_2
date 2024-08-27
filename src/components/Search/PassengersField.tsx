'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Box, Popover, Typography, Button, Stack, SxProps } from '@mui/material'
import { CustomTextField } from '@/components'
import { useFormikContext } from 'formik'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

const PassengerControls = () => {
  const { values, setFieldValue } = useFormikContext<{
    adults: number
    childrens: number
    infant: number
  }>()

  const updatePassengers = (
    field: 'adults' | 'childrens' | 'infant',
    operation: 'add' | 'subtract',
  ) => {
    const currentValue = values[field]
    const newValue = operation === 'add' ? currentValue + 1 : Math.max(0, currentValue - 1)
    setFieldValue(field, newValue)
  }

  return (
    <Stack gap={1}>
      <Stack direction="row" justifyContent="space-between">
        <Box>
          <Typography variant="titleSm">Adultes</Typography>
          <Typography variant="bodyMd" color="grey.800">
            + 12 ans
          </Typography>
        </Box>
        <Stack direction="row" gap={1.7} alignItems="center">
          <Button
            variant="outlined"
            onClick={() => updatePassengers('adults', 'subtract')}
            disabled={values.adults <= 1}
            sx={{ width: 32, height: 32, padding: 0, minWidth: 32 }}>
            <RemoveIcon sx={{ width: 16, height: 16 }} />
          </Button>
          <Typography variant="bodyLg">{values.adults}</Typography>
          <Button
            variant="outlined"
            onClick={() => updatePassengers('adults', 'add')}
            sx={{ width: 32, height: 32, padding: 0, minWidth: 32 }}>
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
            variant="outlined"
            onClick={() => updatePassengers('childrens', 'subtract')}
            disabled={values.childrens <= 0}
            sx={{ width: 32, height: 32, padding: 0, minWidth: 32 }}>
            <RemoveIcon sx={{ width: 16, height: 16 }} />
          </Button>
          <Typography variant="bodyLg">{values.childrens}</Typography>
          <Button
            variant="outlined"
            onClick={() => updatePassengers('childrens', 'add')}
            sx={{ width: 32, height: 32, padding: 0, minWidth: 32 }}>
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
            variant="outlined"
            onClick={() => updatePassengers('infant', 'subtract')}
            disabled={values.infant <= 0}
            sx={{ width: 32, height: 32, padding: 0, minWidth: 32 }}>
            <RemoveIcon sx={{ width: 16, height: 16 }} />
          </Button>
          <Typography variant="bodyLg">{values.infant}</Typography>
          <Button
            variant="outlined"
            onClick={() => updatePassengers('infant', 'add')}
            sx={{ width: 32, height: 32, padding: 0, minWidth: 32 }}>
            <AddIcon sx={{ width: 16, height: 16 }} />
          </Button>
        </Stack>
      </Stack>
    </Stack>
  )
}

export const PassengersField = ({ label, sx }: { label?: string; sx?: SxProps }) => {
  const [isOpen, setIsOpen] = useState(false)
  const anchorRef = useRef<HTMLInputElement>(null)
  const { values } = useFormikContext<{
    adults: number
    childrens: number
    infant: number
  }>()

  const handleFocus = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const totalPassengers = values.adults + values.childrens + values.infant

  return (
    <>
      <CustomTextField
        sx={{ ...sx }}
        value={`${totalPassengers} Passenger${totalPassengers !== 1 ? 's' : ''}`}
        label={label ? label : 'Voyageurs'}
        onFocus={handleFocus}
        inputRef={anchorRef}
        InputProps={{
          readOnly: true,
        }}
      />
      <Popover
        sx={{ mt: 1.2 }}
        open={isOpen}
        anchorEl={anchorRef.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        disableRestoreFocus
        disableScrollLock>
        <Stack px={4} py={3} width={428}>
          <PassengerControls />
        </Stack>
      </Popover>
    </>
  )
}
