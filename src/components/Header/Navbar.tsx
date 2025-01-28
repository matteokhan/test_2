'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Box, Drawer, Stack, Typography } from '@mui/material'
import { MenuMobile, SectionContainer } from '@/components'
import Link from 'next/link'
import FavoriteIcon from '@mui/icons-material/Favorite'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EmailIcon from '@mui/icons-material/Email'
import StorefrontIcon from '@mui/icons-material/Storefront'
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk'
import MenuIcon from '@mui/icons-material/Menu'
import { getEnvVar } from '@/utils'

export const Navbar = () => {
  const LOGO_REDIRECTION_URL = getEnvVar({ name: 'NEXT_PUBLIC_LOGO_REDIRECTION_URL' }) || ''
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  return (
    <Box
      sx={{
        bgcolor: 'common.white',
      }}>
      <SectionContainer
        sx={{
          height: 60,
          justifyContent: 'space-between',
          display: {
            xs: 'none',
            md: 'flex',
          },
        }}>
        <Stack gap={5} alignItems="center" direction="row" className="desktop">
          <Link href={LOGO_REDIRECTION_URL}>
            <Box
              data-testid="navbar-leclercLogo"
              sx={{
                position: 'relative',
                height: 42,
                width: 164,
              }}>
              <Image src="/LVLogotype.svg" alt="voyages logo" fill />
            </Box>
          </Link>
        </Stack>
        <Stack
          alignItems="space-between"
          direction="row"
          gap={3}
          sx={{
            gap: {
              xs: 2,
              md: 3,
            },
          }}>
          <Stack
            justifyContent="center"
            alignItems="center"
            data-testid="navbar-ourAgenciesButton"
            sx={{
              cursor: 'pointer',
              '&:hover svg': {
                color: 'primary.main',
              },
            }}>
            <PhoneInTalkIcon data-testid={null} sx={{ p: 0, pb: 0.5, color: 'grey.600' }} />
            <Typography variant="bodyMd" fontWeight={500} textTransform="uppercase">
              0825 884 620*
            </Typography>
          </Stack>
          <Stack
            onClick={() => window.open('https://www.leclercvoyages.com/agences', '_blank')}
            justifyContent="center"
            alignItems="center"
            data-testid="navbar-ourAgenciesButton"
            sx={{
              cursor: 'pointer',
              '&:hover svg': {
                color: 'primary.main',
              },
            }}>
            <StorefrontIcon data-testid={null} sx={{ p: 0, pb: 0.5, color: 'grey.600' }} />
            <Typography variant="bodyMd" fontWeight={500} textTransform="uppercase">
              Nos agences
            </Typography>
          </Stack>
          <Stack
            onClick={() => (window.location.href = 'https://www.leclercvoyages.com/newsletter/')}
            justifyContent="center"
            alignItems="center"
            data-testid="navbar-newsletterButton"
            sx={{
              cursor: 'pointer',
              '&:hover svg': {
                color: 'primary.main',
              },
            }}>
            <EmailIcon data-testid={null} sx={{ p: 0, pb: 0.5, color: 'grey.600' }} />
            <Typography variant="bodyMd" fontWeight={500} textTransform="uppercase">
              Newsletter
            </Typography>
          </Stack>
          <Stack
            onClick={() => (window.location.href = 'https://www.leclercvoyages.com/account')}
            justifyContent="center"
            alignItems="center"
            data-testid="navbar-favoriteButton"
            sx={{
              cursor: 'pointer',
              '&:hover svg': {
                color: 'primary.main',
              },
            }}>
            <FavoriteIcon data-testid={null} sx={{ p: 0, pb: 0.5, color: 'grey.600' }} />
            <Typography variant="bodyMd" fontWeight={500} textTransform="uppercase">
              Favoris
            </Typography>
          </Stack>
          <Stack
            onClick={() => (window.location.href = 'https://www.leclercvoyages.com/account')}
            justifyContent="center"
            alignItems="center"
            data-testid="navbar-accountButton"
            sx={{
              cursor: 'pointer',
              '&:hover svg': {
                color: 'primary.main',
              },
            }}>
            <AccountCircleIcon data-testid={null} sx={{ p: 0, pb: 0.5, color: 'grey.600' }} />
            <Typography variant="bodyMd" fontWeight={500} textTransform="uppercase">
              Mon compte
            </Typography>
          </Stack>
        </Stack>
      </SectionContainer>
      <SectionContainer
        sx={{
          height: 74,
          justifyContent: 'space-between',
          gap: 1,
          display: {
            xs: 'flex',
            md: 'none',
          },
        }}>
        <Stack
          direction="row"
          width="40%"
          gap={1}
          justifyContent="space-between"
          className="mobile">
          <Stack
            onClick={() => setIsMenuOpen(true)}
            justifyContent="center"
            alignItems="center"
            data-testid="navbar-menuButton"
            sx={{
              cursor: 'pointer',
              '&:hover svg': {
                color: 'primary.main',
              },
            }}>
            <MenuIcon data-testid={null} sx={{ color: 'grey.600' }} />
            <Typography
              fontSize={8}
              variant="labelSm"
              fontWeight={500}
              textTransform="uppercase"
              textAlign="center">
              Menu
            </Typography>
          </Stack>
        </Stack>
        <Stack gap={5} alignItems="center" direction="row" sx={{ position: 'relative', top: 8 }}>
          <Link href={LOGO_REDIRECTION_URL}>
            <Box
              data-testid="navbar-leclercLogo"
              sx={{
                position: 'relative',
                height: 70,
                width: 70,
              }}>
              <Image src="/logo_symbole.svg" alt="voyages logo" fill />
            </Box>
          </Link>
        </Stack>
        <Stack direction="row" width="40%" gap={1} justifyContent="space-between">
          <Stack
            onClick={() => window.open('https://www.leclercvoyages.com/agences', '_blank')}
            justifyContent="center"
            alignItems="center"
            data-testid="navbar-ourAgenciesButton"
            sx={{
              cursor: 'pointer',
              '&:hover svg': {
                color: 'primary.main',
              },
            }}>
            <StorefrontIcon data-testid={null} sx={{ color: 'grey.600' }} />
            <Typography
              fontSize={8}
              variant="labelSm"
              fontWeight={500}
              textTransform="uppercase"
              textAlign="center">
              agences
            </Typography>
          </Stack>
          <Stack
            onClick={() => (window.location.href = 'https://www.leclercvoyages.com/account')}
            justifyContent="center"
            alignItems="center"
            data-testid="navbar-favoriteButton"
            sx={{
              cursor: 'pointer',
              '&:hover svg': {
                color: 'primary.main',
              },
            }}>
            <FavoriteIcon data-testid={null} sx={{ color: 'grey.600' }} />
            <Typography
              variant="labelSm"
              fontWeight={500}
              textTransform="uppercase"
              fontSize={8}
              textAlign="center">
              Favoris
            </Typography>
          </Stack>
          <Stack
            onClick={() => (window.location.href = 'https://www.leclercvoyages.com/account')}
            justifyContent="center"
            alignItems="center"
            data-testid="navbar-accountButton"
            sx={{
              cursor: 'pointer',
              '&:hover svg': {
                color: 'primary.main',
              },
            }}>
            <AccountCircleIcon data-testid={null} sx={{ color: 'grey.600' }} />
            <Typography
              variant="labelSm"
              fontWeight={500}
              textTransform="uppercase"
              fontSize={8}
              textAlign="center">
              compte
            </Typography>
          </Stack>
        </Stack>
      </SectionContainer>
      <Drawer
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        anchor="right"
        PaperProps={{
          sx: {
            borderRadius: 0,
            width: '100%',
          },
        }}>
        <MenuMobile onClose={() => setIsMenuOpen(false)} />
      </Drawer>
    </Box>
  )
}
