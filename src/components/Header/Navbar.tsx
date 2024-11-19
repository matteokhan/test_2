'use client'

import React from 'react'
import Image from 'next/image'
import { Box, Button, Stack, Typography, IconButton, Drawer } from '@mui/material'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import { SectionContainer } from '@/components'
import Link from 'next/link'
import { useAgencySelector } from '@/contexts'
import { env } from 'next-runtime-env'
// TODO: enable this when the time comes ...
// import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
// import ExpandMore from '@mui/icons-material/ExpandMore'

const LOGO_REDIRECTION_URL = env('NEXT_PUBLIC_LOGO_REDIRECTION_URL') || ''

export const Navbar = () => {
  const { setIsAgencySelectorOpen } = useAgencySelector()
  return (
    <Box
      sx={{
        bgcolor: 'common.white',
      }}>
      <SectionContainer sx={{ height: 60, justifyContent: 'space-between' }}>
        <Stack gap={5} alignItems="center" direction="row">
          <Link href={LOGO_REDIRECTION_URL}>
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
              *
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
              {/* TODO: enable this when the time comes ... */}
              {/* <Button href="/newsletter" color="primary" data-testid="navbar-newsletterButton">
                Newsletter
              </Button>
              <Button href="/help" color="primary" variant="text" data-testid="navbar-helpButton">
                Aide
              </Button> */}
              <Button
                onClick={() => setIsAgencySelectorOpen(true)}
                color="primary"
                variant="text"
                data-testid="navbar-ourAgenciesButton">
                Nos agences
              </Button>
            </Stack>
            <Stack direction="row">
              {/* TODO: enable this when the time comes ... */}
              {/* <IconButton
                aria-label="favorites"
                color="primary"
                data-testid="navbar-favoriteButton">
                <FavoriteBorderOutlinedIcon data-testid={null} />
              </IconButton> */}
              <IconButton aria-label="account" color="primary" data-testid="navbar-accountButton">
                <a href="https://www.leclercvoyages.com/account/" target="blank">
                  <AccountCircleOutlinedIcon data-testid={null} />
                </a>
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
