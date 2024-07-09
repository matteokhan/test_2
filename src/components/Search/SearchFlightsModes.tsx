'use client'

import React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Box, Paper, SxProps, Tab, Tabs } from '@mui/material'
import { SearchFlightsForm } from '@/components'

type SearchFlightsModesProps = {
  sx?: SxProps
}

export const SearchFlightsModes = ({ sx }: SearchFlightsModesProps) => {
  const [activeTab, setActiveTab] = React.useState(0)
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper
        sx={{
          backgroundColor: 'common.white',
          paddingTop: 2,
          paddingBottom: 3,
          paddingX: 4,
          ...sx,
        }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Aller-retour" />
          <Tab label="Aller simple" />
          <Tab label="Multi-destinations" />
        </Tabs>
        {activeTab === 0 && (
          <Box sx={{ mt: 1, pt: 1, pb: 2 }}>
            <SearchFlightsForm onSubmit={(data) => console.log(data)} />
          </Box>
        )}
        {activeTab === 1 && (
          <Box sx={{ mt: 1, pt: 1, pb: 2 }}>
            <SearchFlightsForm onSubmit={(data) => console.log(data)} />
          </Box>
        )}
        {activeTab === 2 && (
          <Box sx={{ mt: 1, pt: 1, pb: 2 }}>
            <SearchFlightsForm onSubmit={(data) => console.log(data)} multiDestinations={true} />
          </Box>
        )}
      </Paper>
    </LocalizationProvider>
  )
}
