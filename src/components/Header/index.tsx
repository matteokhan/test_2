import React from 'react'
import Image from 'next/image'
import { Box, Button, Stack, Typography, IconButton, AppBar } from '@mui/material'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import ExpandMore from '@mui/icons-material/ExpandMore'
import MenuIcon from '@mui/icons-material/Menu'
import { SectionContainer } from '@/components'

const Navbar = () => {
  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'grey.200',
      }}>
      <SectionContainer sx={{ height: 60, justifyContent: 'space-between' }}>
        <Stack gap={5} alignItems="center" direction="row">
          <Box
            sx={{
              position: 'relative',
              height: 42,
              width: 164,
            }}>
            <Image src="/voyages_logo.svg" alt="voyages logo" fill />
          </Box>
          <Button
            color="primary"
            variant="contained"
            endIcon={<ExpandMore />}
            sx={{
              display: {
                xs: 'none',
                md: 'flex',
              },
            }}>
            Tous nos voyages et séjours
          </Button>
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
              <Button href="/newsletter" color="primary">
                Newsletter
              </Button>
              <Button href="/help" color="primary" variant="text">
                Aide
              </Button>
              <Button href="/agencies" color="primary" variant="text">
                Nos agences
              </Button>
            </Stack>
            <Stack direction="row">
              <IconButton aria-label="favorites" color="primary">
                <FavoriteBorderOutlinedIcon />
              </IconButton>
              <IconButton aria-label="account" color="primary">
                <AccountCircleOutlinedIcon />
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
              <IconButton aria-label="account" sx={{ color: 'common.black' }}>
                <MenuIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </SectionContainer>
    </Box>
  )
}

const NavbarLinks = () => {
  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'grey.200',
        display: {
          xs: 'none',
          md: 'block',
        },
      }}>
      <SectionContainer
        sx={{
          height: 60,
          alignItems: 'center',
          gap: 0.8,
        }}>
        <Button variant="outlined">Ventes Flash</Button>
        <Button variant="outlined">Dernière minute</Button>
        <Button variant="outlined">Pâques</Button>
        <Button variant="outlined">WE de mai</Button>
      </SectionContainer>
    </Box>
  )
}

type HeaderProps = {
  withLinks?: boolean
}

export const Header = ({ withLinks = false }: HeaderProps) => {
  const boxHeight = withLinks ? 120 : 60
  return (
    <>
      <AppBar sx={{ bgcolor: 'common.white', boxShadow: 'none' }}>
        <Navbar />
        {withLinks && <NavbarLinks />}
      </AppBar>
      <Box sx={{ height: { xs: 60, md: boxHeight } }}></Box>
    </>
  )
}
