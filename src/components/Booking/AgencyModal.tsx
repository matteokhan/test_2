import React, { forwardRef } from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { SimpleModal } from '@/components'
import { Agency, AgencyOpening } from '@/types'

export const AgencyModal: React.FC<{
  agency: Agency | undefined
  onSelectAgency: (agency: Agency) => void
  onClose: () => void
}> = forwardRef((props, ref) => {
  const { agency, onSelectAgency, onClose } = props

  const days = [
    {
      index: '1',
      value: 'Lundi',
    },
    {
      index: '2',
      value: 'Mardi',
    },
    {
      index: '3',
      value: 'Mercredi',
    },
    {
      index: '4',
      value: 'Jeudi',
    },
    {
      index: '5',
      value: 'Vendredi',
    },
    {
      index: '6',
      value: 'Samedi',
    },
    {
      index: '7',
      value: 'Dimanche',
    },
  ]

  const getOpenning = (opening: AgencyOpening) => {
    const day = days.find((day) => day.index === opening.day)
    let result = ''
    if (opening.morning_open_time) {
      result += transformHours(opening.morning_open_time)
      if (opening.morning_close_time) {
        result += ' - ' + transformHours(opening.morning_close_time)
        if (opening.afternoon_open_time) {
          result += ' / ' + transformHours(opening.afternoon_open_time)
          if (opening.afternoon_close_time) {
            result += ' - ' + transformHours(opening.afternoon_close_time)
          }
        }
      } else if (opening.afternoon_close_time) {
        result += ' - ' + transformHours(opening.afternoon_close_time)
      }
    } else if (opening.afternoon_open_time) {
      result += transformHours(opening.afternoon_open_time)
      if (opening.afternoon_close_time) {
        result += ' - ' + transformHours(opening.afternoon_close_time)
      }
    } else if (opening.afternoon_open_time) {
      result += transformHours(opening.afternoon_open_time)
      if (opening.afternoon_close_time) {
        result += ' - ' + transformHours(opening.afternoon_close_time)
      }
    } else {
      result += 'Fermé'
    }
    return (
      <Grid container>
        <Grid item xs={4}>
          {day?.value}
        </Grid>
        <Grid item xs={8}>
          {result}
        </Grid>
      </Grid>
    )
  }

  const transformHours = (hour: string) => {
    const splitted = hour.split(':')
    return splitted[0] + 'h' + splitted[1]
  }

  const handleSelectAgency = () => {
    if (agency) onSelectAgency(agency)
  }

  return (
    <SimpleModal
      imageUrl="/design_2.svg"
      title={'Agence ' + agency?.name}
      mainAction="Selectionner cette agence"
      onMainAction={handleSelectAgency}
      secondaryAction="Fermer"
      onSecondaryAction={onClose}
      alignItems="flex-start">
      <Typography variant="bodyMd">Horaire d'ouverture</Typography>
      <Box sx={{ width: '100%' }}>
        {agency?.agency_openings.map((opening, index) => {
          return (
            <Typography key={index} variant="bodyMd">
              {getOpenning(opening)}
            </Typography>
          )
        })}
      </Box>
    </SimpleModal>
  )
})
