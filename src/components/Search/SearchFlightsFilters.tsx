'use client'

import React from 'react'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Stack,
  Typography,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import NightlightRoundIcon from '@mui/icons-material/NightlightRound'
import WbTwilightIcon from '@mui/icons-material/WbTwilight'

export const SearchFlightsFilters = () => {
  const [maxPrice, setMaxPrice] = React.useState<number | number[]>(450)
  return (
    <Paper sx={{ paddingX: 2, paddingY: 4 }}>
      <Stack gap={3}>
        <Typography variant="titleLg">Filtrer par </Typography>
        <Box>
          <Typography variant="titleMd" pb={1}>
            Escales
          </Typography>
          <Box pl={1.5}>
            <RadioGroup defaultValue="all" name="scale">
              <FormControlLabel value="all" control={<Radio />} label="Tous" />
              <FormControlLabel value="direct" control={<Radio />} label="Direct" />
              <FormControlLabel value="1-scale" control={<Radio />} label="Jusqu'à 1 escale" />
              <FormControlLabel value="2-scale" control={<Radio />} label="Jusqu'à 2 escales" />
            </RadioGroup>
            <FormGroup sx={{ paddingTop: 1 }}>
              <FormControlLabel
                value="one-night-scale"
                control={<Checkbox />}
                label="Autoriser les escales d'une nuit"
              />
            </FormGroup>
          </Box>
        </Box>
        <Box pb={1}>
          <Typography variant="titleMd" pb={1}>
            Expérience de vol
          </Typography>
          <Box pl={1.5}>
            <RadioGroup name="scale">
              <FormControlLabel
                value="no-night-flight"
                control={<Radio />}
                label="Aucun vol de nuit"
              />
              <FormControlLabel value="short-scales" control={<Radio />} label="Escales courtes" />
            </RadioGroup>
          </Box>
        </Box>
        <Box pb={1}>
          <Stack direction="row" justifyContent="space-between" pb={1}>
            <Typography variant="titleMd">Prix maximum</Typography>
            <Typography variant="bodyLg">{maxPrice}€</Typography>
          </Stack>
          <Slider
            size="small"
            defaultValue={450}
            min={50}
            max={1000}
            step={10}
            onChange={(event, value) => setMaxPrice(value)}
          />
          <FormControl sx={{ m: 1, minWidth: 120, width: '100%', margin: 0 }}>
            <Select defaultValue="per-person">
              <MenuItem value="per-person">Par Personne</MenuItem>
              <MenuItem value="total-price">Prix total</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box pb={1}>
          <Typography variant="titleMd" pb={1}>
            Temps de vol
          </Typography>
          <Box pb={1}>
            <Stack direction="row" gap={1} alignItems="center">
              <Typography variant="titleSm">Paris (PAR)</Typography>
              <ArrowForwardIcon />
              <Typography variant="titleSm">Sydney (SYD)</Typography>
            </Stack>
            <Typography variant="bodySm">Départ de Paris Charles de Gaulle</Typography>
          </Box>
          <Stack direction="row" gap={0.5} mt={0.5}>
            <Stack
              px={2}
              py={1}
              alignItems="center"
              gap={1}
              sx={{ bgcolor: '#f2f2f2', borderRadius: '4px' }}>
              <WbSunnyIcon />
              <Typography variant="labelMd" noWrap>
                00h - 6h
              </Typography>
            </Stack>
            <Stack
              px={2}
              py={1}
              alignItems="center"
              gap={1}
              sx={{ bgcolor: '#f2f2f2', borderRadius: '4px' }}>
              <WbSunnyIcon />
              <Typography variant="labelMd" noWrap>
                6h - 12h
              </Typography>
            </Stack>
            <Stack
              px={2}
              py={1}
              alignItems="center"
              gap={1}
              sx={{ bgcolor: '#f2f2f2', borderRadius: '4px' }}>
              <WbTwilightIcon />
              <Typography variant="labelMd" noWrap>
                12h - 18h
              </Typography>
            </Stack>
            <Stack
              px={2}
              py={1}
              alignItems="center"
              gap={1}
              sx={{ bgcolor: '#f2f2f2', borderRadius: '4px' }}>
              <NightlightRoundIcon />
              <Typography variant="labelMd" noWrap>
                18h - 24h
              </Typography>
            </Stack>
          </Stack>
        </Box>
        <Box>
          <Typography variant="titleMd" pb={1}>
            Compagnies aériennes
          </Typography>
          <Box pl={1.5} pb={1}>
            <FormGroup>
              <Stack justifyContent="space-between" direction="row" alignItems="center">
                <FormControlLabel value="air-france" control={<Checkbox />} label="Air France" />
                <Typography variant="bodyMd">1399€</Typography>
              </Stack>
              <Stack justifyContent="space-between" direction="row" alignItems="center">
                <FormControlLabel
                  value="tur-airlines"
                  control={<Checkbox />}
                  label="Turkish Airlines (8)"
                />
                <Typography variant="bodyMd">1399€</Typography>
              </Stack>
              <Stack justifyContent="space-between" direction="row" alignItems="center">
                <FormControlLabel
                  value="brit-airlines"
                  control={<Checkbox />}
                  label="British Airways (11)"
                />
                <Typography variant="bodyMd">1399€</Typography>
              </Stack>
            </FormGroup>
          </Box>
          <Button size="small" variant="text" sx={{ padding: 0 }}>
            Voir plus
          </Button>
        </Box>
      </Stack>
    </Paper>
  )
}
