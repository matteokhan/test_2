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
import { useRouter } from 'next/navigation'

const TravelOptionButton = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  borderRadius: theme.spacing(0.5),
  flexDirection: 'column',
  gap: theme.spacing(0.75),
  height: 'auto',
  padding: `${theme.spacing(1.25)} ${theme.spacing(1.8125)}`,
  width: '25%',
  alignItems: 'center',
}))

export const TravelOptionsBanner = () => {
  const router = useRouter()
  const [flightSearchOpen, setFlightSearchOpen] = useState(false)

  return (
    <SectionContainer sx={{ bgcolor: 'primary.main', justifyContent: 'center' }}>
      <Stack sx={{ gap: 3.5, pt: 4, pb: 8, width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography
            color="common.white"
            variant="titleLg"
            sx={{ maxWidth: '250px', textAlign: 'center' }}>
            Explorez toute l’offre E.Leclerc Voyages
          </Typography>
        </Box>
        <Stack gap={1} direction="row" justifyContent="flex-start" width="100%">
          <TravelOptionButton
            onClick={() => setFlightSearchOpen(true)}
            data-testid="travelOptionsBanner-travelsButton">
            {/* TODO: this is not the right icon for flights */}
            <ResortsStayIcon />
            <Typography color="common.black" variant="labelLg">
              Voyages
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
          <SearchFlightsModesMobile
            onSubmit={() => {
              setFlightSearchOpen(false)
              router.push('/flights')
            }}
          />
        </Drawer>
      </Stack>
    </SectionContainer>
  )
}
