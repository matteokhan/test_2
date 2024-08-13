'use client'

import React from 'react'
import { Box, Paper, SxProps, Tab, Tabs } from '@mui/material'
import {
  SearchOneWayFlightsForm,
  SearchRoundTripFlightsForm,
  SearchMultiDestFlightsForm,
} from '@/components'
import { SearchFlightsParams } from '@/types'

type SearchFlightsModesProps = {
  onSearch: ({ searchParams }: { searchParams: SearchFlightsParams }) => void
  sx?: SxProps
}

export const SearchFlightsModes = ({ sx, onSearch }: SearchFlightsModesProps) => {
  const [activeTab, setActiveTab] = React.useState(0)

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }
  const handleSearch = (values: SearchFlightsParams) => {
    onSearch({ searchParams: values })
  }

  return (
    <Paper
      sx={{
        backgroundColor: 'common.white',
        paddingTop: 2,
        paddingBottom: 3,
        paddingX: 4,
        ...sx,
      }}>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Aller-retour" data-testid="searchMode-roundtripFlightButton" />
        <Tab label="Aller simple" data-testid="searchMode-singleFlightButton" />
        <Tab label="Multi-destinations" data-testid="searchMode-multidestinationFlightButton" />
      </Tabs>
      <Box sx={{ mt: 1, pt: 1, pb: 2 }}>
        {activeTab === 0 && <SearchRoundTripFlightsForm onSubmit={handleSearch} />}
        {activeTab === 1 && <SearchOneWayFlightsForm onSubmit={handleSearch} />}
        {activeTab === 2 && <SearchMultiDestFlightsForm onSubmit={handleSearch} />}
      </Box>
    </Paper>
  )
}
