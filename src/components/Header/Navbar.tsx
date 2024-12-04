'use client'

import React from 'react'
import Image from 'next/image'
import { Box, Stack, Typography } from '@mui/material'
import { SectionContainer } from '@/components'
import Link from 'next/link'
import { useAgencySelector } from '@/contexts'
import { env } from 'next-runtime-env'
import FavoriteIcon from '@mui/icons-material/Favorite'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EmailIcon from '@mui/icons-material/Email'
import StorefrontIcon from '@mui/icons-material/Storefront'
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk'

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
        </Stack>
        <Stack alignItems="space-between" direction="row" gap={3}>
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
            <PhoneInTalkIcon data-testid={null} sx={{ p: 0, pb: 0.5, color: 'grey.400' }} />
            <Typography variant="bodyMd" fontWeight={500} textTransform="uppercase">
              0825 884 620*
            </Typography>
          </Stack>
          <Stack
            onClick={() => setIsAgencySelectorOpen(true)}
            justifyContent="center"
            alignItems="center"
            data-testid="navbar-ourAgenciesButton"
            sx={{
              cursor: 'pointer',
              '&:hover svg': {
                color: 'primary.main',
              },
            }}>
            <StorefrontIcon data-testid={null} sx={{ p: 0, pb: 0.5, color: 'grey.400' }} />
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
            <EmailIcon data-testid={null} sx={{ p: 0, pb: 0.5, color: 'grey.400' }} />
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
            <FavoriteIcon data-testid={null} sx={{ p: 0, pb: 0.5, color: 'grey.400' }} />
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
            <AccountCircleIcon data-testid={null} sx={{ p: 0, pb: 0.5, color: 'grey.400' }} />
            <Typography variant="bodyMd" fontWeight={500} textTransform="uppercase">
              Mon compte
            </Typography>
          </Stack>
        </Stack>
      </SectionContainer>
    </Box>
  )
}
