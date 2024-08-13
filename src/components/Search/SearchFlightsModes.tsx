'use client'

import React, { useEffect } from 'react'
import { Box, Paper, SxProps, Tab, Tabs } from '@mui/material'
import {
  SearchOneWayFlightsForm,
  SearchRoundTripFlightsForm,
  SearchMultiDestFlightsForm,
} from '@/components'
import {
  MultiDestinationsFlightSearchParams,
  OneWayFlightSearchParams,
  RoundTripFlightSearchParams,
  SearchFlightsParams,
} from '@/types'
import { useFlights } from '@/contexts'

type SearchFlightsModesProps = {
  onSearch: ({ searchParams }: { searchParams: SearchFlightsParams }) => void
  sx?: SxProps
}

export const SearchFlightsModes = ({ sx, onSearch }: SearchFlightsModesProps) => {
  const [activeTab, setActiveTab] = React.useState(0)
  const [oneWayInitialValues, setOneWayInitialValues] = React.useState<
    OneWayFlightSearchParams | undefined
  >()
  const [roundTripInitialValues, setRoundTripInitialValues] = React.useState<
    RoundTripFlightSearchParams | undefined
  >()
  const [multiDestInitialValues, setmultiDestInitialValues] = React.useState<
    MultiDestinationsFlightSearchParams | undefined
  >()
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
        setOneWayInitialValues(searchParamsCache)
        setActiveTab(1)
      }
      if (searchParamsCache._type === 'roundTrip') {
        setRoundTripInitialValues(searchParamsCache)
        setActiveTab(0)
      }
      if (searchParamsCache._type === 'multiDestinations') {
        setmultiDestInitialValues(searchParamsCache)
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
        <Tab label="Multi-destinations" data-testid="searchMode-multidestinationFlightButton" />
      </Tabs>
      <Box sx={{ mt: 1, pt: 1, pb: 2 }}>
        {activeTab === 0 && (
          <SearchRoundTripFlightsForm
            onSubmit={handleSearch}
            initialValues={roundTripInitialValues}
          />
        )}
        {activeTab === 1 && (
          <SearchOneWayFlightsForm onSubmit={handleSearch} initialValues={oneWayInitialValues} />
        )}
        {activeTab === 2 && (
          <SearchMultiDestFlightsForm
            onSubmit={handleSearch}
            initialValues={multiDestInitialValues}
          />
        )}
      </Box>
    </Paper>
  )
}
