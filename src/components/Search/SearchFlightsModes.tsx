'use client'

import React from 'react'
import { Box, Paper, SxProps, Tab, Tabs } from '@mui/material'
import { SearchFlightsForm } from '@/components'
import { useFlights } from '@/contexts'
import { SearchFlightParams } from '@/types'

type SearchFlightsModesProps = {
  sx?: SxProps
}

export const SearchFlightsModes = ({ sx }: SearchFlightsModesProps) => {
  const [activeTab, setActiveTab] = React.useState(0)
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }
  const { setSearchParams } = useFlights()
  const handleSearch = (values: SearchFlightParams) => {
    setSearchParams({
      adults: +values.adults,
      childrens: +values.childrens,
      infant: +values.infant,
      segments: values.segments.map((segment) => ({
        from: segment.from,
        to: segment.to,
        date: segment.date.toISOString().split('T')[0],
        dateReturn: segment.dateReturn ? segment.dateReturn.toISOString().split('T')[0] : undefined,
      })),
    })
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
        <Tab label="Aller-retour" />
        <Tab label="Aller simple" />
        {/* Uncomment this to enable multidestinations */}
        {/* <Tab label="Multi-destinations" /> */}
      </Tabs>
      {activeTab === 0 && (
        <Box sx={{ mt: 1, pt: 1, pb: 2 }}>
          <SearchFlightsForm onSubmit={handleSearch} isRoundtrip={true} />
        </Box>
      )}
      {activeTab === 1 && (
        <Box sx={{ mt: 1, pt: 1, pb: 2 }}>
          <SearchFlightsForm onSubmit={handleSearch} />
        </Box>
      )}
      {/* Uncomment this to enable multidestinations */}
      {/* {activeTab === 2 && (
          <Box sx={{ mt: 1, pt: 1, pb: 2 }}>
            <SearchFlightsForm onSubmit={handleSearch} multiDestinations={true} />
          </Box>
        )} */}
    </Paper>
  )
}
