'use client'

import React, { MouseEventHandler, useState } from 'react'
import { SectionContainer, CustomerSupport } from '@/components'
import { Box, Drawer, Stack, Typography, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import Image from 'next/image'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SearchIcon from '@mui/icons-material/Search'
import HomeIcon from '@mui/icons-material/Home'
import Link from 'next/link'

const MenuButton = styled(Box)(({ theme }) => ({
  textWrap: 'nowrap',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  height: 48,
  width: '100%',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2),
  borderRadius: theme.spacing(1),
  borderLeft: '8px solid',
  backgroundColor: 'white',
}))

type MenuMobileProps = {
  onClose: MouseEventHandler<HTMLButtonElement>
}

export const MenuMobile = ({ onClose }: MenuMobileProps) => {
  const [isHotelsMenuOpen, setIsHotelsMenuOpen] = useState(false)
  const [isToursMenuOpen, setIsToursMenuOpen] = useState(false)
  const [isVacationsMenuOpen, setIsVacationsMenuOpen] = useState(false)

  const closeMenu: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    setIsHotelsMenuOpen(false)
    onClose(e)
  }

  return (
    <>
      <Box bgcolor="rgb(239, 249, 254)">
        <Stack
          direction="row"
          gap={1}
          justifyContent="space-between"
          width="100%"
          height={54}
          alignItems="center"
          position="relative">
          <Stack
            sx={{
              position: 'absolute',
              left: 0,
              bgcolor: 'rgb(239, 249, 254)',
              height: '100%',
              justifyContent: 'center',
              width: 48,
            }}>
            <IconButton onClick={closeMenu} data-testid="menuMobile-close">
              <CloseIcon data-testid={null} color="primary" />
            </IconButton>
          </Stack>
          <Stack
            bgcolor="white"
            flexGrow={1}
            height="100%"
            justifyContent="center"
            alignItems="center">
            <Box
              sx={{
                position: 'relative',
                height: 32,
                width: 128,
              }}>
              <Image src="/LVLogotype.svg" alt="voyages logo" fill />
            </Box>
          </Stack>
        </Stack>
        <SectionContainer>
          <Stack width="100%" gap={1} my={1}>
            <Link href="/search">
              <MenuButton sx={{ borderColor: 'primary.main' }}>
                <Typography color="common.black" variant="bodyLg">
                  Rechercher un voyage
                </Typography>
                <IconButton sx={{ p: 0 }}>
                  <SearchIcon sx={{ p: 0 }} />
                </IconButton>
              </MenuButton>
            </Link>
            <Link href="/vol">
              <MenuButton sx={{ borderColor: 'primary.main' }}>
                <Typography color="common.black" variant="bodyLg">
                  Retour à l'accueil
                </Typography>
                <IconButton sx={{ p: 0 }}>
                  <HomeIcon sx={{ p: 0 }} />
                </IconButton>
              </MenuButton>
            </Link>
            <MenuButton
              sx={{ borderColor: 'leclerc.red.main' }}
              onClick={() =>
                window.open('https://m.leclercvoyages.com/ventes-flash/Offres-Speciales', '_blank')
              }>
              <Typography color="common.black" variant="bodyLg">
                Ventes Flash
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ borderColor: 'leclerc.red.main' }}
              onClick={() => window.open('https://m.leclercvoyages.com/Derniere_Minute', '_blank')}>
              <Typography color="common.black" variant="bodyLg">
                Dernières Minutes
              </Typography>
            </MenuButton>
            <MenuButton
              onClick={() => setIsHotelsMenuOpen(true)}
              sx={{ borderColor: 'leclerc.blueLabel.main' }}>
              <Typography color="common.black" variant="bodyLg">
                S&eacute;jours
              </Typography>
              <IconButton sx={{ p: 0 }}>
                <ChevronRightIcon sx={{ p: 0 }} />
              </IconButton>
            </MenuButton>
            <MenuButton
              onClick={() => setIsToursMenuOpen(true)}
              sx={{ borderColor: 'leclerc.blueLabel.main' }}>
              <Typography color="common.black" variant="bodyLg">
                Circuits
              </Typography>
              <IconButton sx={{ p: 0 }}>
                <ChevronRightIcon sx={{ p: 0 }} />
              </IconButton>
            </MenuButton>
            <MenuButton
              onClick={() => window.open('https://m.leclercvoyages.com/location', '_blank')}
              sx={{ borderColor: 'leclerc.blueLabel.main' }}>
              <Typography color="common.black" variant="bodyLg">
                Locations
              </Typography>
            </MenuButton>
            <MenuButton
              onClick={() => window.open('https://m.leclercvoyages.com/mobilehome', '_blank')}
              sx={{ borderColor: 'leclerc.blueLabel.main' }}>
              <Typography color="common.black" variant="bodyLg">
                Mobile-Homes
              </Typography>
            </MenuButton>
            <MenuButton
              onClick={() => window.open('https://m.leclercvoyages.com/weekend', '_blank')}
              sx={{ borderColor: 'leclerc.blueLabel.main' }}>
              <Typography color="common.black" variant="bodyLg">
                Week-Ends
              </Typography>
            </MenuButton>
            <MenuButton
              onClick={() => setIsVacationsMenuOpen(true)}
              sx={{ borderColor: 'leclerc.blueLabel.main' }}>
              <Typography color="common.black" variant="bodyLg">
                Vacances scolaires
              </Typography>
              <IconButton sx={{ p: 0 }}>
                <ChevronRightIcon sx={{ p: 0 }} />
              </IconButton>
            </MenuButton>
            <MenuButton
              sx={{ borderColor: 'leclerc.blueLabel.main' }}
              onClick={() => window.open('https://m.leclercvoyages.com/idees_voyages', '_blank')}>
              <Typography color="common.black" variant="bodyLg">
                Idées voyages
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ borderColor: 'leclerc.blueLabel.main' }}
              onClick={() =>
                window.open('https://m.leclercvoyages.com/coffrets-cadeaux-voyages', '_blank')
              }>
              <Typography color="common.black" variant="bodyLg">
                Coffrets Cadeaux
              </Typography>
            </MenuButton>
          </Stack>
        </SectionContainer>
        <SectionContainer sx={{ pt: 2, pb: 3 }}>
          <CustomerSupport />
        </SectionContainer>
      </Box>
      <Drawer
        open={isHotelsMenuOpen}
        anchor="right"
        PaperProps={{
          sx: {
            borderRadius: 0,
            width: '100%',
          },
        }}>
        <Stack
          direction="row"
          gap={1}
          justifyContent="space-between"
          width="100%"
          height={54}
          alignItems="center"
          position="relative">
          <Stack
            sx={{
              position: 'absolute',
              left: 0,
              bgcolor: 'rgb(239, 249, 254)',
              height: '100%',
              justifyContent: 'center',
              width: 48,
            }}>
            <IconButton onClick={() => setIsHotelsMenuOpen(false)} data-testid="menuMobile-back">
              <ArrowBackIcon data-testid={null} color="primary" />
            </IconButton>
          </Stack>
          <Stack
            bgcolor="white"
            flexGrow={1}
            height="100%"
            justifyContent="center"
            alignItems="center">
            <Box
              sx={{
                position: 'relative',
                height: 32,
                width: 128,
              }}>
              <Image src="/LVLogotype.svg" alt="voyages logo" fill />
            </Box>
          </Stack>
        </Stack>
        <SectionContainer sx={{ bgcolor: 'rgb(239, 249, 254)', height: '100%' }}>
          <Stack width="100%" gap={1} my={1}>
            <MenuButton
              sx={{ borderColor: 'leclerc.blueLabel.main' }}
              onClick={() => window.open('https://m.leclercvoyages.com/france', '_blank')}>
              <Typography color="common.black" variant="bodyLg">
                France
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ borderColor: 'leclerc.blueLabel.main' }}
              onClick={() =>
                window.open('https://m.leclercvoyages.com/voyages-antilles-caraibes', '_blank')
              }>
              <Typography color="common.black" variant="bodyLg">
                Antilles et Caraïbes
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ borderColor: 'leclerc.blueLabel.main' }}
              onClick={() =>
                window.open('https://m.leclercvoyages.com/iles_ocean_indien', '_blank')
              }>
              <Typography color="common.black" variant="bodyLg">
                Océan Indien
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ borderColor: 'leclerc.blueLabel.main' }}
              onClick={() =>
                window.open('https://m.leclercvoyages.com/sejours_pays_mediterraneens', '_blank')
              }>
              <Typography color="common.black" variant="bodyLg">
                Pays méditerranéens
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ borderColor: 'leclerc.blueLabel.main' }}
              onClick={() =>
                window.open(
                  'https://m.leclercvoyages.com/sejours_canaries_iles_atlantiques',
                  '_blank',
                )
              }>
              <Typography color="common.black" variant="bodyLg">
                Canaries et Iles atlantiques
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ borderColor: 'leclerc.blueLabel.main' }}
              onClick={() =>
                window.open('https://m.leclercvoyages.com/sejours_maghreb_orient', '_blank')
              }>
              <Typography color="common.black" variant="bodyLg">
                Maghreb et Orient
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ borderColor: 'leclerc.blueLabel.main' }}
              onClick={() =>
                window.open('https://m.leclercvoyages.com/sejours_asie_oceanie', '_blank')
              }>
              <Typography color="common.black" variant="bodyLg">
                Asie et Océanie
              </Typography>
            </MenuButton>
          </Stack>
        </SectionContainer>
      </Drawer>
      <Drawer
        open={isToursMenuOpen}
        anchor="right"
        PaperProps={{
          sx: {
            borderRadius: 0,
            width: '100%',
          },
        }}>
        <Stack
          direction="row"
          gap={1}
          justifyContent="space-between"
          width="100%"
          height={54}
          alignItems="center"
          position="relative">
          <Stack
            sx={{
              position: 'absolute',
              left: 0,
              bgcolor: 'rgb(239, 249, 254)',
              height: '100%',
              justifyContent: 'center',
              width: 48,
            }}>
            <IconButton onClick={() => setIsToursMenuOpen(false)} data-testid="menuMobile-back">
              <ArrowBackIcon data-testid={null} color="primary" />
            </IconButton>
          </Stack>
          <Stack
            bgcolor="white"
            flexGrow={1}
            height="100%"
            justifyContent="center"
            alignItems="center">
            <Box
              sx={{
                position: 'relative',
                height: 32,
                width: 128,
              }}>
              <Image src="/LVLogotype.svg" alt="voyages logo" fill />
            </Box>
          </Stack>
        </Stack>
        <SectionContainer sx={{ bgcolor: 'rgb(239, 249, 254)', height: '100%' }}>
          <Stack width="100%" gap={1} my={1}>
            <MenuButton
              sx={{ borderColor: 'leclerc.blueLabel.main' }}
              onClick={() =>
                window.open(
                  'https://m.leclercvoyages.com/search?m_c.thematique=circuit-prive',
                  '_blank',
                )
              }>
              <Typography color="common.black" variant="bodyLg">
                Circuits privés
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ borderColor: 'leclerc.blueLabel.main' }}
              onClick={() =>
                window.open('https://m.leclercvoyages.com/search?m_c.thematique=auto', '_blank')
              }>
              <Typography color="common.black" variant="bodyLg">
                Circuits en voiture
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ borderColor: 'leclerc.blueLabel.main' }}
              onClick={() => window.open('https://m.leclercvoyages.com/circuits_europe', '_blank')}>
              <Typography color="common.black" variant="bodyLg">
                Europe
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ borderColor: 'leclerc.blueLabel.main' }}
              onClick={() =>
                window.open('https://m.leclercvoyages.com/circuits_ameriques', '_blank')
              }>
              <Typography color="common.black" variant="bodyLg">
                Amériques
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ borderColor: 'leclerc.blueLabel.main' }}
              onClick={() => window.open('https://m.leclercvoyages.com/circuits_asie', '_blank')}>
              <Typography color="common.black" variant="bodyLg">
                Asie
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ borderColor: 'leclerc.blueLabel.main' }}
              onClick={() =>
                window.open('https://m.leclercvoyages.com/circuits_afrique', '_blank')
              }>
              <Typography color="common.black" variant="bodyLg">
                Afrique
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ borderColor: 'leclerc.blueLabel.main' }}
              onClick={() =>
                window.open('https://m.leclercvoyages.com/circuits_maghreb_orient', '_blank')
              }>
              <Typography color="common.black" variant="bodyLg">
                Maghreb et Orient
              </Typography>
            </MenuButton>
          </Stack>
        </SectionContainer>
      </Drawer>
      <Drawer
        open={isVacationsMenuOpen}
        anchor="right"
        PaperProps={{
          sx: {
            borderRadius: 0,
            width: '100%',
          },
        }}>
        <Stack
          direction="row"
          gap={1}
          justifyContent="space-between"
          width="100%"
          height={54}
          alignItems="center"
          position="relative">
          <Stack
            sx={{
              position: 'absolute',
              left: 0,
              bgcolor: 'rgb(239, 249, 254)',
              height: '100%',
              justifyContent: 'center',
              width: 48,
            }}>
            <IconButton onClick={() => setIsVacationsMenuOpen(false)} data-testid="menuMobile-back">
              <ArrowBackIcon data-testid={null} color="primary" />
            </IconButton>
          </Stack>
          <Stack
            bgcolor="white"
            flexGrow={1}
            height="100%"
            justifyContent="center"
            alignItems="center">
            <Box
              sx={{
                position: 'relative',
                height: 32,
                width: 128,
              }}>
              <Image src="/LVLogotype.svg" alt="voyages logo" fill />
            </Box>
          </Stack>
        </Stack>
        <SectionContainer sx={{ bgcolor: 'rgb(239, 249, 254)', height: '100%' }}>
          <Stack width="100%" gap={1} my={1}>
            <MenuButton
              sx={{ borderColor: 'leclerc.blueLabel.main' }}
              onClick={() =>
                window.open(
                  'https://m.leclercvoyages.com/vacances_fevrier?cat=menu_vacances_scolaires&lab=menu_vacances_fevrier',
                  '_blank',
                )
              }>
              <Typography color="common.black" variant="bodyLg">
                Vacances de Février
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ borderColor: 'leclerc.blueLabel.main' }}
              onClick={() =>
                window.open(
                  'https://m.leclercvoyages.com/vacances_Paques?cat=menu_vacances_scolaires&lab=menu_vacances_paques',
                  '_blank',
                )
              }>
              <Typography color="common.black" variant="bodyLg">
                Vacances de Pâques
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ borderColor: 'leclerc.blueLabel.main' }}
              onClick={() =>
                window.open(
                  'https://m.leclercvoyages.com/Weekend_Mai?cat=menu_vacances_scolaires&lab=menu_vacances_pont_mai',
                  '_blank',
                )
              }>
              <Typography color="common.black" variant="bodyLg">
                Week-ends et ponts de mai
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ borderColor: 'leclerc.blueLabel.main' }}
              onClick={() =>
                window.open(
                  'https://m.leclercvoyages.com/vacances_ete?cat=menu_vacances_scolaires&lab=menu_vacances_ete',
                  '_blank',
                )
              }>
              <Typography color="common.black" variant="bodyLg">
                Vacances d'Été
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ borderColor: 'leclerc.blueLabel.main' }}
              onClick={() =>
                window.open(
                  'https://m.leclercvoyages.com/vacances_Toussaint?cat=menu_vacances_scolaires&lab=menu_vacances_toussaint',
                  '_blank',
                )
              }>
              <Typography color="common.black" variant="bodyLg">
                Vacances de Toussaint
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ borderColor: 'leclerc.blueLabel.main' }}
              onClick={() =>
                window.open(
                  'https://m.leclercvoyages.com/vacances_noel?cat=menu_vacances_scolaires&lab=menu_vacances_noel',
                  '_blank',
                )
              }>
              <Typography color="common.black" variant="bodyLg">
                Vacances de Noël
              </Typography>
            </MenuButton>
          </Stack>
        </SectionContainer>
      </Drawer>
    </>
  )
}
