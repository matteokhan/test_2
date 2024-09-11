'use client'

import { useState } from 'react'
import { Box, Drawer, Typography, Stack, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import {
  SectionContainer,
  SearchFlightsModesMobile,
  ResortsStayIcon,
  ToursIcon,
  CruisesIcon,
} from '@/components'
import { styled } from '@mui/material/styles'

const TravelOptionButton = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  borderRadius: theme.spacing(0.5),
  flexDirection: 'column',
  gap: theme.spacing(0.75),
  height: 'auto',
  padding: `${theme.spacing(1.25)} ${theme.spacing(1.8125)}`,
  width: theme.spacing(11.125),
}))

export const TravelOptionsBanner = () => {
  const [flightSearchOpen, setFlightSearchOpen] = useState(false)

  return (
    <SectionContainer sx={{ bgcolor: 'primary.main', justifyContent: 'center' }}>
      <Stack sx={{ gap: 3.5, pt: 4, pb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography
            color="common.white"
            variant="titleLg"
            sx={{ maxWidth: '250px', textAlign: 'center' }}
            data-testid="travelOptionsBanner-title">
            Explorez toute l’offre E.Leclerc Voyages
          </Typography>
        </Box>
        <Stack gap={1} direction="row">
          <TravelOptionButton
            onClick={() => setFlightSearchOpen(true)}
            data-testid="travelOptionsBanner-resortsButton">
            <ResortsStayIcon />
            <Typography color="common.black" variant="labelLg">
              Séjours
            </Typography>
          </TravelOptionButton>
          {/* <TravelOptionButton
            onClick={() => console.log('Circuits')}
            data-testid="travelOptionsBanner-toursButton">
            <ToursIcon />
            <Typography color="common.black" variant="labelLg">
              Circuits
            </Typography>
          </TravelOptionButton>
          <TravelOptionButton
            onClick={() => console.log('Séjours')}
            data-testid="travelOptionsBanner-resortsButton">
            <ResortsStayIcon />
            <Typography color="common.black" variant="labelLg">
              Séjours
            </Typography>
          </TravelOptionButton>
          <TravelOptionButton
            onClick={() => console.log('Croisières')}
            data-testid="travelOptionsBanner-cruisesButton">
            <CruisesIcon />
            <Typography color="common.black" variant="labelLg">
              Croisières
            </Typography>
          </TravelOptionButton> */}
        </Stack>
        <Drawer
          open={flightSearchOpen}
          anchor="right"
          PaperProps={{
            sx: {
              borderRadius: 0,
              width: '100%',
            },
          }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            p={2}
            pl={3}
            alignItems="center"
            bgcolor="grey.100">
            <Typography color="common.black" variant="titleLg">
              Vols
            </Typography>
            <IconButton
              aria-label="close"
              onClick={() => setFlightSearchOpen(false)}
              data-testid="travelOptionsBanner-closeButton">
              <CloseIcon />
            </IconButton>
          </Stack>
          <SearchFlightsModesMobile />
        </Drawer>
      </Stack>
    </SectionContainer>
  )
}
