'use client'

import React, { useEffect } from 'react'
import { Box, Drawer, Modal, Paper, SxProps, Tab, Tabs, Typography } from '@mui/material'
import {
  SearchOneWayFlightsForm,
  SearchRoundTripFlightsForm,
  SearchMultiDestFlightsForm,
  SelectAgencyMap,
  AlertDestinationModal,
} from '@/components'
import { SearchFlightsParams } from '@/types'
import { useAgencySelector, useFlights } from '@/contexts'
import { isValidSearch } from '@/utils'

type SearchFlightsModesProps = {
  onSearch: ({ searchParams }: { searchParams: SearchFlightsParams }) => void
  sx?: SxProps
  disabled?: boolean
}

export const SearchFlightsModes = ({ sx, onSearch, disabled }: SearchFlightsModesProps) => {
  const [activeTab, setActiveTab] = React.useState(0)
  const [mapIsOpen, setMapIsOpen] = React.useState(false)
  const [modalIsOpen, setModalIsOpen] = React.useState(false)
  const { searchParamsCache } = useFlights()
  const { selectedAgency, selectAgency } = useAgencySelector()

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }
  const handleSearch = (values: SearchFlightsParams) => {
    if (isValidSearch(values)) onSearch({ searchParams: values })
    else setModalIsOpen(true)
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
      {!selectedAgency && (
        <Typography variant="titleSm" color="grey.600">
          <a onClick={() => setMapIsOpen(true)} style={{ cursor: 'pointer' }}>
            Veuillez sélectionner votre agence en ligne
          </a>
        </Typography>
      )}
      {selectedAgency && (
        <Typography variant="titleSm" color="grey.600">
          Agence {selectedAgency.name} -{' '}
          <a onClick={() => setMapIsOpen(true)} style={{ cursor: 'pointer' }}>
            Changer d'agence
          </a>
        </Typography>
      )}
      <Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
        <AlertDestinationModal
          onShowAgency={() => {
            setMapIsOpen(true)
            setModalIsOpen(false)
          }}
          onClose={() => {
            setModalIsOpen(false)
          }}
        />
      </Modal>
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
            selectAgency(agency)
            setMapIsOpen(false)
          }}
        />
      </Drawer>
    </Paper>
  )
}
