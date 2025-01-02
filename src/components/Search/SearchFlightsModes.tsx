'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Box, Paper, Stack, SxProps, Tab, Tabs } from '@mui/material'
import {
  SearchOneWayFlightsForm,
  SearchRoundTripFlightsForm,
  SelectAgencyLabel,
  SectionContainer,
} from '@/components'
import { SearchFlightsParams } from '@/types'
import { useAgencySelector, useFlights } from '@/contexts'

type SearchFlightsModesProps = {
  onSearch: ({ searchParams }: { searchParams: SearchFlightsParams }) => void
  sx?: SxProps
  disabled?: boolean
  sticky?: boolean
}

export const SearchFlightsModes = ({ sx, onSearch, disabled, sticky }: SearchFlightsModesProps) => {
  const [activeTab, setActiveTab] = useState(0)
  const { searchParamsCache } = useFlights()
  const { setIsAgencySelectorOpen } = useAgencySelector()
  const [isSticky, setIsSticky] = useState<boolean>(false)
  const stickyRef = useRef<HTMLDivElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

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

  useEffect(() => {
    const currentRef = stickyRef.current

    if (!currentRef || !currentRef.parentElement) return

    // Create a sentinel element to detect when the component becomes sticky
    const sentinel = document.createElement('div')
    sentinel.style.position = 'relative'
    currentRef.parentElement.insertBefore(sentinel, currentRef)

    observerRef.current = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        setIsSticky(!entry.isIntersecting)
      },
      { threshold: [1] },
    )

    observerRef.current.observe(sentinel)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      sentinel.remove()
    }
  }, [])

  return (
    <>
      <SectionContainer
        ref={stickyRef}
        sx={{
          position: sticky ? 'sticky' : 'initial',
          top: 0,
          zIndex: 'searchBar',
          width: '100%',
          p: sticky ? (isSticky ? '0 !important' : '') : '0 !important',
        }}
        maxWidth={sticky ? (isSticky ? false : undefined) : undefined}>
        <Paper
          elevation={sticky ? (isSticky ? 2 : 0) : 0}
          sx={{
            backgroundColor: 'common.white',
            paddingTop: 2,
            paddingBottom: 3,
            width: '100%',
            borderRadius: sticky ? (isSticky ? 0 : 1.5) : 1.5,
            ...sx,
          }}>
          <SectionContainer
            maxWidth={sticky ? (isSticky ? undefined : false) : false}
            sx={{ p: sticky ? (isSticky ? '' : '0 !important') : '0 !important', width: '100%' }}>
            <Stack direction="column" sx={{ paddingX: 4, width: '100%' }}>
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
                    initialValues={
                      searchParamsCache?._type === 'roundTrip' ? searchParamsCache : undefined
                    }
                  />
                )}
                {activeTab === 1 && (
                  <SearchOneWayFlightsForm
                    disabled={disabled}
                    onSubmit={handleSearch}
                    initialValues={
                      searchParamsCache?._type === 'oneWay' ? searchParamsCache : undefined
                    }
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
              <SelectAgencyLabel openSelectionAgency={() => setIsAgencySelectorOpen(true)} />
            </Stack>
          </SectionContainer>
        </Paper>
      </SectionContainer>
    </>
  )
}
