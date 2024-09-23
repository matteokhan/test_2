'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Popover, Stack, SxProps } from '@mui/material'
import { CustomTextField, PassengersControls } from '@/components'
import { useFormikContext } from 'formik'

export const PassengersField = ({ label, sx }: { label?: string; sx?: SxProps }) => {
  const [isOpen, setIsOpen] = useState(false)
  const anchorRef = useRef<HTMLInputElement>(null)
  const { values } = useFormikContext<{
    adults: number
    childrens: number
    infants: number
  }>()

  const handleFocus = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const totalPassengers = values.adults + values.childrens + values.infants

  return (
    <>
      <CustomTextField
        sx={{ ...sx }}
        value={`${totalPassengers} Passager${totalPassengers !== 1 ? 's' : ''}`}
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
          <PassengersControls />
        </Stack>
      </Popover>
    </>
  )
}
