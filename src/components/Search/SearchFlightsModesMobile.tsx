'use client'

import React, { useRef, useEffect } from 'react'
import { Box, Tab, Tabs, Stack, Button } from '@mui/material'
import { OneWayFlightSearchParams, RoundTripFlightSearchParams, SearchFlightsParams } from '@/types'
import { useFlights } from '@/contexts'
import {
  SearchRoundTripFlightsFormMobile,
  SearchOneWayFlightsFormMobile,
  ROUND_TRIP_DEFAULT_VALUES,
  ONE_WAY_DEFAULT_VALUES,
} from '@/components'
import { FormikProps } from 'formik'

type SearchFlightsModesMobileProps = {
  onSearch: ({ searchParams }: { searchParams: SearchFlightsParams }) => void
}

export const SearchFlightsModesMobile = ({ onSearch }: SearchFlightsModesMobileProps) => {
  const [activeTab, setActiveTab] = React.useState(0)
  const formRefOneWay = useRef<FormikProps<OneWayFlightSearchParams> | null>(null)
  const formRefRoundTrip = useRef<FormikProps<RoundTripFlightSearchParams> | null>(null)
  const { searchParamsCache } = useFlights()

  useEffect(() => {
    if (searchParamsCache) {
      if (searchParamsCache._type === 'oneWay') {
        setActiveTab(1)
      }
      if (searchParamsCache._type === 'roundTrip') {
        setActiveTab(0)
      }
    }
  }, [searchParamsCache])

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const handleSubmit = async () => {
    if (formRefRoundTrip.current) {
      const errors = await formRefRoundTrip.current.validateForm()
      if (Object.keys(errors).length !== 0) {
        formRefRoundTrip.current.setTouched(
          Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
        )
        return
      }
      onSearch({ searchParams: formRefRoundTrip.current.values })
    } else if (formRefOneWay.current) {
      const errors = await formRefOneWay.current.validateForm()
      if (Object.keys(errors).length !== 0) {
        formRefOneWay.current.setTouched(
          Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
        )
        return
      }
      onSearch({ searchParams: formRefOneWay.current.values })
    } else {
      // TODO: log this somewhere
      return
    }
  }

  return (
    <Stack>
      <Stack bgcolor="grey.100">
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ height: '48px', mx: 4 }}>
          <Tab label="Aller-retour" data-testid="searchFlightsModesMobile-roundtripFlightTab" />
          <Tab label="Aller simple" data-testid="searchFlightsModesMobile-singleFlightTab" />
        </Tabs>
      </Stack>
      <Box sx={{ p: 3 }}>
        {activeTab === 0 && (
          <SearchRoundTripFlightsFormMobile
            formRef={formRefRoundTrip}
            initialValues={searchParamsCache?._type === 'roundTrip' ? searchParamsCache : undefined}
          />
        )}
        {activeTab === 1 && (
          <SearchOneWayFlightsFormMobile
            formRef={formRefOneWay}
            initialValues={searchParamsCache?._type === 'oneWay' ? searchParamsCache : undefined}
          />
        )}
      </Box>
      <Stack
        sx={{
          flexDirection: 'row',
          gap: 1,
          justifyContent: 'flex-end',
          borderTop: 1,
          borderColor: '#CAC4D0',
          px: 1,
          py: 2,
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          bgcolor: 'common.white',
        }}>
        <Button
          variant="outlined"
          size="medium"
          data-testid="searchFlightsModesMobile-clearButton"
          onClick={() => {
            if (activeTab === 0 && formRefRoundTrip.current) {
              formRefRoundTrip.current.resetForm({ values: ROUND_TRIP_DEFAULT_VALUES })
            }
            if (activeTab === 1 && formRefOneWay.current) {
              formRefOneWay.current.resetForm({ values: ONE_WAY_DEFAULT_VALUES })
            }
          }}>
          Tout effacer
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          size="medium"
          data-testid="searchFlightsModesMobile-submitButton">
          Rechercher
        </Button>
      </Stack>
    </Stack>
  )
}
