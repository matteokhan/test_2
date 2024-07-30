import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { SectionContainer } from '@/components'
import Link from 'next/link'

export const SelectedFlightInfoTopbar = () => {
  return (
    <Box
      sx={{
        borderRadius: 0,
        borderBottom: 1,
        borderColor: 'grey.200',
      }}>
      <SectionContainer
        sx={{
          height: 60,
          alignItems: 'center',
          gap: 0.8,
        }}>
        <Stack width="100%" height="56px" alignItems="center" direction="row">
          <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
            <Link href="/flights" style={{ textDecoration: 'none' }}>
              <Stack
                direction="row"
                alignItems="center"
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}>
                <IconButton aria-label="back" color="primary">
                  <ArrowBackIcon />
                </IconButton>
                <Typography
                  variant="labelLg"
                  color="primary"
                  ml={1}
                  sx={{
                    '&:hover': {
                      cursor: 'pointer',
                    },
                  }}>
                  Retour aux résultats
                </Typography>
              </Stack>
            </Link>
            {/* TODO: hardcoded data here */}
            <Stack direction="row" gap={1}>
              <Stack direction="row" gap={2} alignItems="center">
                <Stack direction="row" gap={1}>
                  <Typography variant="titleMd">Paris (PAR)</Typography>
                  <SwapHorizIcon />
                  <Typography variant="titleMd">New York (JFK)</Typography>
                </Stack>
                <Stack direction="row" gap={1}>
                  <Typography variant="bodyMd">Du 9/04 au 14/04</Typography>
                  <Typography variant="bodyMd">-</Typography>
                  <Typography variant="bodyMd">2 voyageurs</Typography>
                  <Typography variant="bodyMd">-</Typography>
                  <Typography variant="bodyMd">5 bagages</Typography>
                </Stack>
              </Stack>
              <Button>Voir le détail du vol</Button>
            </Stack>
          </Stack>
        </Stack>
      </SectionContainer>
    </Box>
  )
}
