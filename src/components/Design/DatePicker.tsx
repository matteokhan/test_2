// This component exist because seems there's no easy way to get rid of the
// calendar icon in the date picker input field. This component will remove the
// calendar icon and make the input field clickable to open the date picker.

'use client'

import React from 'react'
import {
  DatePickerProps as MuiDatePickerProps,
  DatePicker as MuiDatePicker,
} from '@mui/x-date-pickers-pro'
import { Dayjs } from 'dayjs'

export const DatePicker = ({ ...props }: MuiDatePickerProps<Dayjs>) => {
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <MuiDatePicker
      {...props}
      open={isOpen}
      onClose={() => setIsOpen(false)}
      slotProps={{
        ...props.slotProps,
        textField: {
          ...props.slotProps?.textField,
          onClick: () => setIsOpen(true),
          InputProps: {
            endAdornment: null,
          },
        },
      }}
    />
  )
}
