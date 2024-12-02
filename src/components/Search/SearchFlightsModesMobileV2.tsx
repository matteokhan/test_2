'use client'

import React, { useRef, useEffect } from 'react'
import { Box, Tab, Tabs, Stack, Button, Modal } from '@mui/material'
import { OneWayFlightSearchParams, RoundTripFlightSearchParams, SearchFlightsParams } from '@/types'
import { useAgencySelector, useFlights } from '@/contexts'
import {
  SearchRoundTripFlightsFormMobile,
  SearchOneWayFlightsFormMobile,
  AlertDestinationModal,
  SelectAgencyLabel,
} from '@/components'
import { FormikProps } from 'formik'
import { isValidSearch } from '@/utils'

type SearchFlightsModesMobileProps = {
  onSearch: ({ searchParams }: { searchParams: SearchFlightsParams }) => void
}

export const SearchFlightsModesMobileV2 = ({ onSearch }: SearchFlightsModesMobileProps) => {
  const [activeTab, setActiveTab] = React.useState(0)
  const [modalIsOpen, setModalIsOpen] = React.useState(false)

  const formRefOneWay = useRef<FormikProps<OneWayFlightSearchParams> | null>(null)
  const formRefRoundTrip = useRef<FormikProps<RoundTripFlightSearchParams> | null>(null)

  const { searchParamsCache } = useFlights()
  const { setIsAgencySelectorOpen } = useAgencySelector()

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
      if (isValidSearch(formRefRoundTrip.current.values))
        onSearch({ searchParams: formRefRoundTrip.current.values })
      else setModalIsOpen(true)
    } else if (formRefOneWay.current) {
      const errors = await formRefOneWay.current.validateForm()
      if (Object.keys(errors).length !== 0) {
        formRefOneWay.current.setTouched(
          Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
        )
        return
      }
      if (isValidSearch(formRefOneWay.current.values))
        onSearch({ searchParams: formRefOneWay.current.values })
      else setModalIsOpen(true)
    } else {
      // TODO: log this somewhere
      return
    }
  }

  return (
    <Stack width="100%" bgcolor="common.white" borderRadius={1}>
      <Stack pt={1}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ height: '42px', mx: 2 }}>
          <Tab label="Aller-retour" data-testid="searchFlightsModesMobileV2-roundtripFlightTab" />
          <Tab label="Aller simple" data-testid="searchFlightsModesMobileV2-singleFlightTab" />
        </Tabs>
      </Stack>
      <Box sx={{ p: 2 }}>
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
        <Box mt={2}>
          <SelectAgencyLabel openSelectionAgency={() => setIsAgencySelectorOpen(true)} />
        </Box>
        <Button
          sx={{ mt: 2, width: '100%' }}
          onClick={handleSubmit}
          variant="contained"
          size="medium"
          data-testid="searchFlightsModesMobileV2-submitButton">
          Rechercher
        </Button>
      </Box>
      <Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
        <AlertDestinationModal
          onShowAgency={() => {
            setIsAgencySelectorOpen(true)
            setModalIsOpen(false)
          }}
          onClose={() => {
            setModalIsOpen(false)
          }}
        />
      </Modal>
    </Stack>
  )
}
