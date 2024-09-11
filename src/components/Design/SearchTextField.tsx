'use client'

import React from 'react'
import { InputAdornment, TextFieldProps, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

type SearchTextFieldProps = TextFieldProps

export const SearchTextField: React.FC<SearchTextFieldProps> = ({
  fullWidth,
  placeholder,
  label,
  value,
  helperText,
  onClick,
  ...props
}) => {
  return (
    <TextField
      {...props}
      label={label}
      placeholder={placeholder}
      onClick={onClick}
      value={value}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  )
}
