'use client'

import React, { MouseEventHandler, useState } from 'react'
import { SectionContainer, CustomerSupport } from '@/components'
import { Box, Drawer, Stack, Typography, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import Image from 'next/image'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const MenuButton = styled(Box)(({ theme }) => ({
  textWrap: 'nowrap',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  height: 54,
  borderBottom: '1px solid',
  borderColor: theme.palette.grey['400'],
  width: '100%',
  justifyContent: 'space-between',
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
      <Box>
        <SectionContainer
          sx={{
            flexDirection: 'column',
            gap: 0.5,
            width: '100%',
            borderBottom: '1px solid',
            borderColor: 'grey.400',
          }}>
          <Stack
            direction="row"
            gap={1}
            justifyContent="space-between"
            width="100%"
            height={54}
            alignItems="center">
            <Box
              sx={{
                position: 'relative',
                height: 32,
                width: 128,
              }}>
              <Image src="/LVLogotype.svg" alt="voyages logo" fill />
            </Box>
            <IconButton aria-label="close" onClick={closeMenu} data-testid="menuMobile-close">
              <CloseIcon data-testid={null} color="primary" />
            </IconButton>
          </Stack>
        </SectionContainer>
        <SectionContainer>
          <Stack width="100%">
            <MenuButton
              onClick={() =>
                window.open('https://m.leclercvoyages.com/ventes-flash/Offres-Speciales', '_blank')
              }>
              <Typography color="common.black" variant="titleLg">
                Ventes Flash
              </Typography>
              <IconButton sx={{ p: 0 }} aria-label="close">
                <ChevronRightIcon sx={{ p: 0 }} />
              </IconButton>
            </MenuButton>
            <MenuButton
              onClick={() => window.open('https://m.leclercvoyages.com/Derniere_Minute', '_blank')}>
              <Typography color="common.black" variant="titleLg">
                Dernières Minutes
              </Typography>
              <IconButton sx={{ p: 0 }} aria-label="close">
                <ChevronRightIcon sx={{ p: 0 }} />
              </IconButton>
            </MenuButton>
            <MenuButton onClick={() => setIsHotelsMenuOpen(true)}>
              <Typography color="common.black" variant="titleLg">
                S&eacute;jours
              </Typography>
              <IconButton sx={{ p: 0 }} aria-label="close">
                <ChevronRightIcon sx={{ p: 0 }} />
              </IconButton>
            </MenuButton>
            <MenuButton onClick={() => setIsToursMenuOpen(true)}>
              <Typography color="common.black" variant="titleLg">
                Circuits
              </Typography>
              <IconButton sx={{ p: 0 }} aria-label="close">
                <ChevronRightIcon sx={{ p: 0 }} />
              </IconButton>
            </MenuButton>
            <MenuButton
              onClick={() => window.open('https://m.leclercvoyages.com/location', '_blank')}>
              <Typography color="common.black" variant="titleLg">
                Locations
              </Typography>
              <IconButton sx={{ p: 0 }} aria-label="close">
                <ChevronRightIcon sx={{ p: 0 }} />
              </IconButton>
            </MenuButton>
            <MenuButton
              onClick={() => window.open('https://m.leclercvoyages.com/mobilehome', '_blank')}>
              <Typography color="common.black" variant="titleLg">
                Mobile-Homes
              </Typography>
              <IconButton sx={{ p: 0 }} aria-label="close">
                <ChevronRightIcon sx={{ p: 0 }} />
              </IconButton>
            </MenuButton>
            <MenuButton
              onClick={() => window.open('https://m.leclercvoyages.com/weekend', '_blank')}>
              <Typography color="common.black" variant="titleLg">
                Week-Ends
              </Typography>
              <IconButton sx={{ p: 0 }} aria-label="close">
                <ChevronRightIcon sx={{ p: 0 }} />
              </IconButton>
            </MenuButton>
            <MenuButton onClick={() => setIsVacationsMenuOpen(true)}>
              <Typography color="common.black" variant="titleLg">
                Vacances scolaires
              </Typography>
              <IconButton sx={{ p: 0 }} aria-label="close">
                <ChevronRightIcon sx={{ p: 0 }} />
              </IconButton>
            </MenuButton>
            <MenuButton
              onClick={() => window.open('https://m.leclercvoyages.com/idees_voyages', '_blank')}>
              <Typography color="common.black" variant="titleLg">
                Idées voyages
              </Typography>
              <IconButton sx={{ p: 0 }} aria-label="close">
                <ChevronRightIcon sx={{ p: 0 }} />
              </IconButton>
            </MenuButton>
            <MenuButton
              sx={{ borderBottom: 'none' }}
              onClick={() =>
                window.open('https://m.leclercvoyages.com/coffrets-cadeaux-voyages', '_blank')
              }>
              <Typography color="common.black" variant="titleLg">
                Coffrets Cadeaux
              </Typography>
              <IconButton sx={{ p: 0 }} aria-label="close">
                <ChevronRightIcon sx={{ p: 0 }} />
              </IconButton>
            </MenuButton>
          </Stack>
        </SectionContainer>
        <SectionContainer sx={{ borderTop: '1px solid', borderColor: 'grey.400', pt: 2, pb: 3 }}>
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
        <SectionContainer
          sx={{
            flexDirection: 'column',
            gap: 0.5,
            width: '100%',
            borderBottom: '1px solid',
            borderColor: 'grey.400',
          }}>
          <Stack
            direction="row"
            gap={1}
            justifyContent="space-between"
            width="100%"
            height={54}
            alignItems="center">
            <IconButton
              aria-label="close"
              onClick={() => setIsHotelsMenuOpen(false)}
              data-testid="menuMobile-goBack">
              <ArrowBackIcon data-testid={null} color="primary" />
            </IconButton>
            <Typography variant="headlineMd" sx={{ fontSize: 18 }}>
              S&eacute;jours
            </Typography>
            <IconButton aria-label="close" onClick={closeMenu} data-testid="menuMobile-close">
              <CloseIcon data-testid={null} color="primary" />
            </IconButton>
          </Stack>
        </SectionContainer>
        <SectionContainer>
          <Stack width="100%">
            <Typography
              variant="headlineMd"
              pt={3}
              pb={1.5}
              borderBottom="1px solid"
              borderColor="grey.400">
              Séjours
            </Typography>
            <MenuButton
              sx={{ height: 48 }}
              onClick={() => window.open('https://m.leclercvoyages.com/france', '_blank')}>
              <Typography color="common.black" variant="bodyLg">
                France
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ height: 48 }}
              onClick={() =>
                window.open('https://m.leclercvoyages.com/voyages-antilles-caraibes', '_blank')
              }>
              <Typography color="common.black" variant="bodyLg">
                Antilles et Caraïbes
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ height: 48 }}
              onClick={() =>
                window.open('https://m.leclercvoyages.com/iles_ocean_indien', '_blank')
              }>
              <Typography color="common.black" variant="bodyLg">
                Océan Indien
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ height: 48 }}
              onClick={() =>
                window.open('https://m.leclercvoyages.com/sejours_pays_mediterraneens', '_blank')
              }>
              <Typography color="common.black" variant="bodyLg">
                Pays méditerranéens
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ height: 48 }}
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
              sx={{ height: 48 }}
              onClick={() =>
                window.open('https://m.leclercvoyages.com/sejours_maghreb_orient', '_blank')
              }>
              <Typography color="common.black" variant="bodyLg">
                Maghreb et Orient
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ height: 48 }}
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
        <SectionContainer
          sx={{
            flexDirection: 'column',
            gap: 0.5,
            width: '100%',
            borderBottom: '1px solid',
            borderColor: 'grey.400',
          }}>
          <Stack
            direction="row"
            gap={1}
            justifyContent="space-between"
            width="100%"
            height={54}
            alignItems="center">
            <IconButton
              aria-label="close"
              onClick={() => setIsToursMenuOpen(false)}
              data-testid="menuMobile-goBack">
              <ArrowBackIcon data-testid={null} color="primary" />
            </IconButton>
            <Typography variant="headlineMd" sx={{ fontSize: 18 }}>
              Circuits
            </Typography>
            <IconButton aria-label="close" onClick={closeMenu} data-testid="menuMobile-close">
              <CloseIcon data-testid={null} color="primary" />
            </IconButton>
          </Stack>
        </SectionContainer>
        <SectionContainer>
          <Stack width="100%">
            <MenuButton
              sx={{ height: 48 }}
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
              sx={{ height: 48 }}
              onClick={() =>
                window.open('https://m.leclercvoyages.com/search?m_c.thematique=auto', '_blank')
              }>
              <Typography color="common.black" variant="bodyLg">
                Circuits en voiture
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ height: 48 }}
              onClick={() => window.open('https://m.leclercvoyages.com/circuits_europe', '_blank')}>
              <Typography color="common.black" variant="bodyLg">
                Europe
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ height: 48 }}
              onClick={() =>
                window.open('https://m.leclercvoyages.com/circuits_ameriques', '_blank')
              }>
              <Typography color="common.black" variant="bodyLg">
                Amériques
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ height: 48 }}
              onClick={() => window.open('https://m.leclercvoyages.com/circuits_asie', '_blank')}>
              <Typography color="common.black" variant="bodyLg">
                Asie
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ height: 48 }}
              onClick={() =>
                window.open('https://m.leclercvoyages.com/circuits_afrique', '_blank')
              }>
              <Typography color="common.black" variant="bodyLg">
                Afrique
              </Typography>
            </MenuButton>
            <MenuButton
              sx={{ height: 48 }}
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
        <SectionContainer
          sx={{
            flexDirection: 'column',
            gap: 0.5,
            width: '100%',
            borderBottom: '1px solid',
            borderColor: 'grey.400',
          }}>
          <Stack
            direction="row"
            gap={1}
            justifyContent="space-between"
            width="100%"
            height={54}
            alignItems="center">
            <IconButton
              aria-label="close"
              onClick={() => setIsVacationsMenuOpen(false)}
              data-testid="menuMobile-goBack">
              <ArrowBackIcon data-testid={null} color="primary" />
            </IconButton>
            <Typography variant="headlineMd" sx={{ fontSize: 18 }}>
              Vacances scolaires
            </Typography>
            <IconButton aria-label="close" onClick={closeMenu} data-testid="menuMobile-close">
              <CloseIcon data-testid={null} color="primary" />
            </IconButton>
          </Stack>
        </SectionContainer>
        <SectionContainer>
          <Stack width="100%">
            <MenuButton
              sx={{ height: 48 }}
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
              sx={{ height: 48 }}
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
              sx={{ height: 48 }}
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
              sx={{ height: 48 }}
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
              sx={{ height: 48 }}
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
              sx={{ height: 48 }}
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
