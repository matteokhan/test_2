'use client'

import React, { useMemo } from 'react'
import { Box, Chip, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import TrainIcon from '@mui/icons-material/Train'
import { CheckedLuggageIcon, FlightAirline } from '@/components'
import { Route } from '@/types'
import { locationNameExtension, transformDuration } from '@/utils'
import { useLocationData } from '@/services'
import { calculateDaysBetween } from '@/utils'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const FlightRouteDetails = React.memo(
  ({
    route,
    departureLocationChange,
    arrivalLocationChange,
    isFirstRoute,
    isLastRoute,
  }: {
    route: Route
    departureLocationChange?: boolean
    arrivalLocationChange?: boolean
    isFirstRoute?: boolean
    isLastRoute?: boolean
  }) => {
    const theme = useTheme()
    const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
    const { segments, travelTime } = route
    const segmentsDetails = useMemo(
      () => ({
        firstSegment: segments[0],
        lastSegment: segments[segments.length - 1],
        hasTrainSegment: segments.some((segment) => segment.equipment === 'TRN'),
      }),
      [segments],
    )
    const departureDateTime = useMemo(
      () => dayjs(segmentsDetails.firstSegment.departureDateTime).utc(),
      [segmentsDetails],
    )
    const arrivalDateTime = useMemo(
      () => dayjs(segmentsDetails.lastSegment.arrivalDateTime).utc(),
      [segmentsDetails],
    )
    const flightDetails = useMemo(
      () => ({
        tags: segmentsDetails.hasTrainSegment ? 'Vol + train' : null,
        departureTime: departureDateTime.format('HH:mm'),
        arrivalTime: arrivalDateTime.format('HH:mm'),
        daysToArrival: calculateDaysBetween(departureDateTime, arrivalDateTime),
        departureLocation: segmentsDetails.firstSegment.departure,
        departureCityCode: segmentsDetails.firstSegment.departureCityCode,
        arrivalLocation: segmentsDetails.lastSegment.arrival,
        arrivalCityCode: segmentsDetails.lastSegment.arrivalCityCode,
        carbonFootprint: 'carbonFootprint',
        luggageIncluded: route.baggages ? route.baggages > 0 : false,
        warnDepartureChange:
          (departureLocationChange && isFirstRoute) || (arrivalLocationChange && isLastRoute),
        warnArrivalChange:
          (departureLocationChange && isLastRoute) || (arrivalLocationChange && isFirstRoute),
      }),
      [segmentsDetails, departureLocationChange, arrivalLocationChange, isFirstRoute, isLastRoute],
    )
    const { data: departureLocationData } = useLocationData({
      locationCode: flightDetails.departureLocation,
    })
    const { data: arrivalLocationData } = useLocationData({
      locationCode: flightDetails.arrivalLocation,
    })

    const getScaleDetails = () => {
      if (!route.totalStopDuration) {
        return ''
      }
      if (route.stopNumber === 0) {
        return ''
      }
      if (route.stopNumber === 1) {
        return '1 escale (' + transformDuration(route.totalStopDuration) + ')'
      }
      if (route.stopNumber >= 2) {
        return route.stopNumber + ' escales (' + transformDuration(route.totalStopDuration) + ')'
      }
    }

    return isDesktop ? (
      <Stack
        gap={4}
        direction="row"
        sx={{ display: { xs: 'none', lg: 'flex' } }}
        className="desktop">
        <Stack gap={1} minWidth="25%" maxWidth="25%">
          <FlightAirline carrier={route.carrier} />
          {flightDetails.tags && (
            <Stack direction="row" data-testid="flightRouteDetails-tags">
              <Chip label={flightDetails.tags} sx={{ backgroundColor: 'grey.100' }} size="small" />
            </Stack>
          )}
        </Stack>
        <Stack flexGrow={1}>
          <Stack direction="row" justifyContent="space-between" gap={2}>
            <Typography
              variant="titleLg"
              color="leclerc.red.main"
              data-testid="flightRouteDetails-departureTime">
              {flightDetails.departureTime}
            </Typography>
            <Stack
              flexGrow={1}
              direction="row"
              position="relative"
              justifyContent="center"
              alignItems="center">
              <Box borderRadius="4px" width="7px" height="7px" bgcolor="grey.900"></Box>
              <Box width="100%" height="1px" bgcolor="grey.900"></Box>
              <Box borderRadius="4px" width="7px" height="7px" bgcolor="grey.900"></Box>
            </Stack>
            {flightDetails.daysToArrival > 0 && (
              <Typography
                variant="bodySm"
                color="leclerc.red.main"
                data-testid="flightRouteDetails-daysToArrival">
                J+{flightDetails.daysToArrival}
              </Typography>
            )}
            <Typography
              variant="titleLg"
              color="leclerc.red.main"
              data-testid="flightRouteDetails-arrivalTime">
              {flightDetails.arrivalTime}
            </Typography>
          </Stack>
          <Stack direction="row" gap={4.5}>
            <Stack gap={0.5} width="30%">
              <Typography
                variant="bodyMd"
                data-testid="flightRouteDetails-departureLocation"
                color={flightDetails.warnDepartureChange ? 'leclerc.red.main' : 'black'}>
                {locationNameExtension(departureLocationData)}
              </Typography>
              <Stack direction="row" alignItems="center" gap={0.5}>
                <Typography
                  variant="labelLg"
                  data-testid="flightRouteDetails-departureCityCode"
                  color={flightDetails.warnDepartureChange ? 'leclerc.red.main' : 'black'}>
                  {flightDetails.departureCityCode}
                </Typography>
                {segmentsDetails.hasTrainSegment && (
                  <TrainIcon data-testid="flightRouteDetails-trainIcon" />
                )}
              </Stack>
            </Stack>
            <Stack textAlign="center" width="40%" gap="2px">
              <Typography variant="bodySm" data-testid="flightRouteDetails-duration">
                {transformDuration(travelTime, true)}
              </Typography>
              <Typography
                variant="bodySm"
                color="grey.700"
                data-testid="flightRouteDetails-scaleDetails">
                {getScaleDetails()}
              </Typography>
              {route.airportChange && (
                <Typography
                  variant="bodySm"
                  color="leclerc.red.main"
                  data-testid="flightRouteDetails-changeAirportWarning">
                  Changement d’aéroport
                </Typography>
              )}
            </Stack>
            <Stack gap={0.5} textAlign="right" width="30%">
              <Typography
                variant="bodyMd"
                data-testid="flightRouteDetails-arrivalLocation"
                color={flightDetails.warnArrivalChange ? 'leclerc.red.main' : 'black'}>
                {locationNameExtension(arrivalLocationData)}
              </Typography>
              <Stack direction="row" alignItems="center" gap={0.5} alignSelf="flex-end">
                <Typography
                  variant="labelLg"
                  data-testid="flightRouteDetails-arrivalCityCode"
                  color={flightDetails.warnArrivalChange ? 'leclerc.red.main' : 'black'}>
                  {flightDetails.arrivalCityCode}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          {flightDetails.luggageIncluded && (
            <Stack direction="row" justifyContent="space-between" pt={1} alignItems="center">
              <Stack direction="row" data-testid="flightRouteDetails-luggageDetails">
                {flightDetails.luggageIncluded && (
                  <CheckedLuggageIcon data-testid="flightRouteDetails-checkedLuggage" />
                )}
              </Stack>
              {/* TODO: enable carbon footprint when available */}
              {false && (
                <Typography
                  variant="bodySm"
                  color="grey.700"
                  data-testid="flightRouteDetails-carbonFootprint">
                  {flightDetails.carbonFootprint}
                </Typography>
              )}
            </Stack>
          )}
        </Stack>
      </Stack>
    ) : (
      <Stack gap={1.5} sx={{ display: { xs: 'flex', lg: 'none' } }} className="mobile">
        <Stack gap={1} direction="row" justifyContent="space-between" alignItems="center">
          <FlightAirline
            carrier={route.carrier}
            sx={{ gap: 1, flexDirection: 'row', alignItems: 'center', width: '100%' }}
          />
          {flightDetails.tags && (
            <Stack direction="row" data-testid="flightRouteDetails-tags">
              <Chip label={flightDetails.tags} sx={{ backgroundColor: 'grey.100' }} size="small" />
            </Stack>
          )}
        </Stack>
        <Stack gap={1}>
          <Stack direction="row" gap={5} alignItems="center">
            <Box width="60px" minWidth="60px" textAlign="right">
              <Typography
                variant="titleLg"
                color="leclerc.red.main"
                data-testid="flightRouteDetails-departureTime"
                fontSize="22px">
                {flightDetails.departureTime}
              </Typography>
            </Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexGrow={1}
              gap={2}>
              <Stack direction="row" alignItems="center" justifyContent="flex-start" gap={0.5}>
                <Typography
                  variant="bodyMd"
                  data-testid="flightRouteDetails-departureLocation"
                  color={flightDetails.warnDepartureChange ? 'leclerc.red.main' : 'black'}>
                  {locationNameExtension(departureLocationData)}
                </Typography>
                {segmentsDetails.hasTrainSegment && (
                  <TrainIcon data-testid="flightRouteDetails-trainIcon" />
                )}
              </Stack>
              <Typography
                variant="labelLg"
                data-testid="flightRouteDetails-departureCityCode"
                color={flightDetails.warnDepartureChange ? 'leclerc.red.main' : 'black'}>
                {flightDetails.departureCityCode}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row" gap={5}>
            <Box width="60px" minWidth="60px" textAlign="right">
              <Typography variant="bodySm" data-testid="flightRouteDetails-duration">
                {transformDuration(travelTime, true)}
              </Typography>
            </Box>
            <Stack direction="row" gap={1}>
              <Typography
                variant="bodySm"
                color="grey.700"
                data-testid="flightRouteDetails-scaleDetails">
                {getScaleDetails()}
              </Typography>
              {route.airportChange && (
                <Typography
                  variant="bodySm"
                  color="leclerc.red.main"
                  data-testid="flightRouteDetails-changeAirportWarning">
                  Changement d’aéroport
                </Typography>
              )}
            </Stack>
          </Stack>
          <Stack direction="row" gap={5}>
            <Box width="60px" minWidth="60px" textAlign="right" position="relative">
              <Typography
                variant="titleLg"
                color="leclerc.red.main"
                data-testid="flightRouteDetails-arrivalTime"
                fontSize="22px">
                {flightDetails.arrivalTime}
              </Typography>
              {flightDetails.daysToArrival > 0 && (
                <Box sx={{ position: 'absolute', right: '-32px', top: '2px' }}>
                  {' '}
                  <Typography
                    variant="bodySm"
                    color="leclerc.red.main"
                    data-testid="flightRouteDetails-daysToArrival">
                    J+{flightDetails.daysToArrival}
                  </Typography>
                </Box>
              )}
            </Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexGrow={1}
              gap={2}>
              <Typography
                variant="bodyMd"
                data-testid="flightRouteDetails-arrivalLocation"
                color={flightDetails.warnArrivalChange ? 'leclerc.red.main' : 'black'}>
                {locationNameExtension(arrivalLocationData)}
              </Typography>
              <Typography
                variant="labelLg"
                data-testid="flightRouteDetails-arrivalCityCode"
                color={flightDetails.warnArrivalChange ? 'leclerc.red.main' : 'black'}>
                {flightDetails.arrivalCityCode}
              </Typography>
            </Stack>
          </Stack>
          {flightDetails.luggageIncluded && (
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" data-testid="flightRouteDetails-luggageDetails">
                {flightDetails.luggageIncluded && (
                  <CheckedLuggageIcon data-testid="flightRouteDetails-checkedLuggage" />
                )}
              </Stack>
              {/* TODO: enable carbon footprint when available */}
              {false && (
                <Typography
                  variant="bodySm"
                  color="grey.700"
                  data-testid="flightRouteDetails-carbonFootprint">
                  {flightDetails.carbonFootprint}
                </Typography>
              )}
            </Stack>
          )}
        </Stack>
      </Stack>
    )
  },
)
