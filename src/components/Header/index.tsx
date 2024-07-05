import React from 'react'
import Image from 'next/image'
import { Box, Button, Container, Stack, Typography, IconButton, AppBar } from '@mui/material'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import ExpandMore from '@mui/icons-material/ExpandMore'
import MenuIcon from '@mui/icons-material/Menu'

const Navbar = () => {
  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'grey.200',
      }}>
      <Container
        sx={{
          paddingX: {
            xs: 2,
            sm: 2,
            md: 5,
            lg: 5,
            xl: 5,
          },
          height: 60,
          display: 'flex',
          justifyContent: 'space-between',
        }}
        disableGutters>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}>
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
                sm: 'none',
                md: 'flex',
                lg: 'flex',
                xl: 'flex',
              },
            }}>
            Tous nos voyages et séjours
          </Button>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'space-between',
            gap: 3,
          }}>
          <Stack
            direction="row"
            alignItems="center"
            gap={0.5}
            sx={{
              display: {
                xs: 'none',
                sm: 'none',
                md: 'none',
                lg: 'flex',
                xl: 'flex',
              },
            }}>
            <Typography
              fontSize={14}
              fontWeight={500}
              lineHeight={18}
              letterSpacing={0.25}
              color="leclercRed.main">
              0 825 884 620
            </Typography>
            <Typography fontSize={12} color="grey.700" fontWeight={400} letterSpacing={0.4}>
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
                  md: 'flex',
                  lg: 'flex',
                  xl: 'flex',
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
                  md: 'none',
                  lg: 'none',
                  xl: 'none',
                },
              }}>
              <IconButton aria-label="account" sx={{ color: 'common.black' }}>
                <MenuIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Box>
      </Container>
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
          sm: 'none',
          md: 'block',
          lg: 'block',
          xl: 'block',
        },
      }}>
      <Container
        sx={{
          paddingX: 5,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          gap: 0.8,
        }}
        disableGutters>
        <Button variant="outlined">Ventes Flash</Button>
        <Button variant="outlined">Dernière minute</Button>
        <Button variant="outlined">Pâques</Button>
        <Button variant="outlined">WE de mai</Button>
      </Container>
    </Box>
  )
}

export const Header = () => {
  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: 'transparent' }}>
        <Navbar />
        <NavbarLinks />
      </AppBar>
    </>
  )
}
