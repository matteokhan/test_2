'use client'

import React from 'react'
import { InputAdornment, TextFieldProps, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

type SearchTextFieldProps = TextFieldProps

export const SearchTextField: React.FC<SearchTextFieldProps> = ({ ...props }) => {
  return (
    <TextField
      {...props}
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
