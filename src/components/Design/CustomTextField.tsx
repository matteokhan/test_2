'use client'

import React from 'react'
import { TextField, TextFieldProps } from '@mui/material'
import { styled } from '@mui/material/styles'

type CustomTextFieldProps = TextFieldProps & {
  noBorder?: boolean
}

const CustomTextFieldRoot = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'noBorder',
})<CustomTextFieldProps>(({ theme, noBorder }) => ({
  '& .MuiFilledInput-root': {
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: 'transparent',
    border: '1px solid',
    borderColor: noBorder ? 'transparent' : theme.palette.grey[500],
    transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '&.Mui-focused': {
      backgroundColor: 'transparent',
    },
  },
}))

export const CustomTextField = React.forwardRef<HTMLDivElement, CustomTextFieldProps>(
  (props, ref) => {
    return (
      <CustomTextFieldRoot
        {...props}
        ref={ref}
        variant="filled"
        InputProps={{
          ...props.InputProps,
          disableUnderline: true,
        }}
      />
    )
  },
)

CustomTextField.displayName = 'CustomTextField'
