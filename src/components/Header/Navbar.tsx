'use client'

import React from 'react'
import Image from 'next/image'
import { Box, Button, Stack, Typography, IconButton, Drawer } from '@mui/material'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
// import ExpandMore from '@mui/icons-material/ExpandMore'
import MenuIcon from '@mui/icons-material/Menu'
import { SectionContainer, SelectAgencyMap } from '@/components'
import Link from 'next/link'
import { useAgencySelector } from '@/contexts'

export const Navbar = () => {
  const [mapIsOpen, setMapIsOpen] = React.useState(false)
  const { setSelectedAgency } = useAgencySelector()

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'grey.200',
        boxSizing: 'border-box',
        bgcolor: 'common.white',
      }}>
      <SectionContainer sx={{ height: 60, justifyContent: 'space-between' }}>
        <Stack gap={5} alignItems="center" direction="row">
          <Link href="/">
            <Box
              data-testid="navbar-leclercLogo"
              sx={{
                position: 'relative',
                height: 42,
                width: 164,
              }}>
              <Image src="/voyages_logo.svg" alt="voyages logo" fill />
            </Box>
          </Link>
          {/* TODO: enable this when neccesary */}
          {/* <Button
            data-testid="navbar-allTripsButton"
            color="primary"
            variant="contained"
            endIcon={<ExpandMore data-testid={null} />}
            sx={{
              display: {
                xs: 'none',
                md: 'flex',
              },
            }}>
            Tous nos voyages et séjours
          </Button> */}
        </Stack>
        <Stack alignItems="space-between" direction="row" gap={3}>
          <Stack
            direction="row"
            alignItems="center"
            gap={0.5}
            sx={{
              display: {
                xs: 'none',
                lg: 'flex',
              },
            }}>
            {/* TODO: put some tests ids here */}
            <Typography color="leclerc.red.main" variant="bodyMd" fontWeight={500}>
              0 825 884 620
            </Typography>
            <Typography color="grey.700" variant="bodySm">
              (0,25€ TTC/min)
            </Typography>
          </Stack>
          <Stack gap={{ xs: 2, sm: 5 }} direction="row" alignItems="center">
            <Stack
              gap={1}
              direction="row"
              sx={{
                display: {
                  xs: 'none',
                  sm: 'flex',
                },
              }}>
              <Button href="/newsletter" color="primary" data-testid="navbar-newsletterButton">
                Newsletter
              </Button>
              <Button href="/help" color="primary" variant="text" data-testid="navbar-helpButton">
                Aide
              </Button>
              <Button
                onClick={() => setMapIsOpen(true)}
                color="primary"
                variant="text"
                data-testid="navbar-ourAgenciesButton">
                Nos agences
              </Button>
            </Stack>
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
                  setSelectedAgency(agency.code, agency.name, true)
                  setMapIsOpen(false)
                }}
              />
            </Drawer>
            <Stack direction="row">
              <IconButton
                aria-label="favorites"
                color="primary"
                data-testid="navbar-favoriteButton">
                <FavoriteBorderOutlinedIcon data-testid={null} />
              </IconButton>
              <IconButton aria-label="account" color="primary" data-testid="navbar-accountButton">
                <AccountCircleOutlinedIcon data-testid={null} />
              </IconButton>
            </Stack>
            <Stack
              direction="row"
              sx={{
                display: {
                  xs: 'flex',
                  sm: 'none',
                },
              }}>
              <IconButton
                aria-label="account"
                sx={{ color: 'common.black' }}
                data-testid="navbar-menuButton">
                <MenuIcon data-testid={null} />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </SectionContainer>
    </Box>
  )
}
