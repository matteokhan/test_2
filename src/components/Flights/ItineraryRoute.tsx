'use client'

import { Route } from '@/types'
import { Box, SxProps, Typography } from '@mui/material'
import { ItinerarySegment } from '@/components'
import { locationName, transformDuration } from '@/utils'
import { useLocationData } from '@/services'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useState } from 'react'

export const ItineraryRoute = ({
  route,
  sx,
  isExpanded = false,
}: {
  route: Route
  sx?: SxProps
  isExpanded?: boolean
}) => {
  const [expanded, setExpanded] = useState(isExpanded)

  const departure = route.segments[0].departure
  const arrival = route.segments[route.segments.length - 1].arrival

  const departureDate = new Date(route.segments[0].departureDateTime)
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  const { data: departureLocationData } = useLocationData({ locationCode: departure })
  const { data: arrivalLocationData } = useLocationData({ locationCode: arrival })

  const handleAccordionChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded)
  }

  return (
    <Accordion
      expanded={expanded}
      onChange={handleAccordionChange}
      disableGutters
      data-testid="itineraryRoute"
      sx={{
        maxWidth: '100%',
        borderRadius: '4px',
        '&:before': {
          display: 'none',
        },
        ...sx,
      }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="itineraryRoute-header"
        data-testid="itineraryRoute-detailsAccordion">
        <Box>
          <Typography variant="titleMd" data-testid="itineraryRoute-departureAndArrival">
            {locationName(departureLocationData)} - {locationName(arrivalLocationData)}
          </Typography>
          <Typography
            variant="bodyMd"
            color="grey.800"
            data-testid="itineraryRoute-durationDetails">
            {departureDate.toLocaleDateString(undefined, dateOptions)} - durée{' '}
            {transformDuration(route.travelTime, true)}{' '}
            {route.stopNumber > 0 && (
              <span>
                - {route.stopNumber} escale ({transformDuration(route.totalStopDuration)})
              </span>
            )}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}>
        {route.segments.map((segment, index) => (
          <ItinerarySegment
            carrier={route.carrier}
            key={segment.id}
            segment={segment}
            indexSegment={index}
            allSegments={route.segments}
            isLastSegment={index === route.segments.length - 1}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  )
}
