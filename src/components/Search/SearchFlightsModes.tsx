'use client'

import React, { useEffect } from 'react'
import { Box, Paper, SxProps, Tab, Tabs } from '@mui/material'
import {
  SearchOneWayFlightsForm,
  SearchRoundTripFlightsForm,
  SearchMultiDestFlightsForm,
} from '@/components'
import { SearchFlightsParams } from '@/types'
import { useFlights } from '@/contexts'

type SearchFlightsModesProps = {
  onSearch: ({ searchParams }: { searchParams: SearchFlightsParams }) => void
  sx?: SxProps
  disabled?: boolean
}

export const SearchFlightsModes = ({ sx, onSearch, disabled }: SearchFlightsModesProps) => {
  const [activeTab, setActiveTab] = React.useState(0)
  const { searchParamsCache } = useFlights()

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }
  const handleSearch = (values: SearchFlightsParams) => {
    onSearch({ searchParams: values })
  }

  useEffect(() => {
    if (searchParamsCache) {
      if (searchParamsCache._type === 'oneWay') {
        setActiveTab(1)
      }
      if (searchParamsCache._type === 'roundTrip') {
        setActiveTab(0)
      }
      if (searchParamsCache._type === 'multiDestinations') {
        setActiveTab(2)
      }
    }
  }, [searchParamsCache])

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
        {/* TODO: enable multidestinations */}
        {/* <Tab label="Multi-destinations" data-testid="searchMode-multidestinationFlightButton" /> */}
      </Tabs>
      <Box sx={{ mt: 1, pt: 1, pb: 2 }}>
        {activeTab === 0 && (
          <SearchRoundTripFlightsForm
            disabled={disabled}
            onSubmit={handleSearch}
            initialValues={searchParamsCache?._type === 'roundTrip' ? searchParamsCache : undefined}
          />
        )}
        {activeTab === 1 && (
          <SearchOneWayFlightsForm
            disabled={disabled}
            onSubmit={handleSearch}
            initialValues={searchParamsCache?._type === 'oneWay' ? searchParamsCache : undefined}
          />
        )}
        {/* TODO: enable multidestinations */}
        {/* {activeTab === 2 && (
          <SearchMultiDestFlightsForm
            onSubmit={handleSearch}
            initialValues={multiDestInitialValues}
          />
        )} */}
      </Box>
    </Paper>
  )
}
