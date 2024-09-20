'use client'

import React, { useEffect } from 'react'
import { Box, Drawer, Paper, SxProps, Tab, Tabs, Typography } from '@mui/material'
import {
  SearchOneWayFlightsForm,
  SearchRoundTripFlightsForm,
  SearchMultiDestFlightsForm,
  SelectAgencyMap,
} from '@/components'
import { SearchFlightsParams } from '@/types'
import { useAgencySelector, useFlights } from '@/contexts'

type SearchFlightsModesProps = {
  onSearch: ({ searchParams }: { searchParams: SearchFlightsParams }) => void
  sx?: SxProps
  disabled?: boolean
}

export const SearchFlightsModes = ({ sx, onSearch, disabled }: SearchFlightsModesProps) => {
  const [activeTab, setActiveTab] = React.useState(0)
  const [mapIsOpen, setMapIsOpen] = React.useState(false)
  const { searchParamsCache } = useFlights()
  const { selectedAgencyCode, selectedAgencyName, saveSelectedAgency, setSelectedAgency } =
    useAgencySelector()

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }
  const handleSearch = (values: SearchFlightsParams) => {
    if (selectedAgencyCode) saveSelectedAgency()
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
      {!selectedAgencyCode && (
        <Typography variant="titleSm" color="grey.600">
          <a onClick={() => setMapIsOpen(true)} style={{ cursor: 'pointer' }}>
            Veuillez sélectionner votre agence en ligne
          </a>
        </Typography>
      )}
      {selectedAgencyCode && selectedAgencyName && (
        <Typography variant="titleSm" color="grey.600">
          Agence {selectedAgencyName} -{' '}
          <a onClick={() => setMapIsOpen(true)} style={{ cursor: 'pointer' }}>
            Changer d'agence
          </a>
        </Typography>
      )}
      <Drawer
        open={mapIsOpen}
        onClose={() => setMapIsOpen(false)}
        anchor="right"
        PaperProps={{
          sx: {
            borderRadius: 0,
          },
        }}>
        <SelectAgencyMap
          onClose={() => setMapIsOpen(false)}
          onSelectAgency={({ agency }) => {
            setSelectedAgency(agency.code, agency.name, true)
            setMapIsOpen(false)
          }}
        />
      </Drawer>
    </Paper>
  )
}
