'use client'

import React, { useRef } from 'react'
import { Box, Tab, Tabs, Stack, Button } from '@mui/material'
import {
  MultiDestinationsFlightSearchParams,
  OneWayFlightSearchParams,
  RoundTripFlightSearchParams,
  SearchFlightsParams,
} from '@/types'
import { useFlights } from '@/contexts'
import { SearchRoundTripFlightsFormMobile, SearchOneWayFlightsFormMobile } from '@/components'
import { FormikProps } from 'formik'
import { useRouter } from 'next/navigation'

export const SearchFlightsModesMobile = () => {
  const [activeTab, setActiveTab] = React.useState(0)

  const formRefOneWay = useRef<FormikProps<OneWayFlightSearchParams> | null>(null)
  const formRefRoundTrip = useRef<FormikProps<RoundTripFlightSearchParams> | null>(null)

  const router = useRouter()
  const { setSearchParams } = useFlights()

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

  const handleSubmit = () => {
    console.log('formRefOneWay', formRefOneWay)
    console.log('formRefRoundTrip', formRefRoundTrip)
    if (formRefRoundTrip.current) {
      setSearchParams(formRefRoundTrip.current.values)
    } else if (formRefOneWay.current) {
      setSearchParams(formRefOneWay.current.values)
    } else {
      // TODO: log this somewhere
      return
    }
    router.push('/flights')
  }

  return (
    <Stack>
      <Stack bgcolor="grey.100">
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ height: '48px', mx: 4 }}>
          <Tab label="Aller-retour" data-testid="searchFlightsMode-roundtripFlightTab" />
          <Tab label="Aller simple" data-testid="searchFlightsMode-singleFlightTab" />
        </Tabs>
      </Stack>
      <Box sx={{ p: 3 }}>
        {activeTab === 0 && (
          <SearchRoundTripFlightsFormMobile
            formRef={formRefRoundTrip}
            initialValues={roundTripInitialValues}
          />
        )}
        {activeTab === 1 && (
          <SearchOneWayFlightsFormMobile
            formRef={formRefOneWay}
            initialValues={oneWayInitialValues}
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
          data-testid="searchFlightsModes-clearButton"
          onClick={() => {
            if (activeTab === 0 && formRefRoundTrip.current) {
              formRefRoundTrip.current.resetForm()
            }
            if (activeTab === 1 && formRefOneWay.current) {
              formRefOneWay.current.resetForm()
            }
          }}>
          Tout effacer
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          size="medium"
          data-testid="searchFlightsModes-submitButton">
          Rechercher
        </Button>
      </Stack>
    </Stack>
  )
}
