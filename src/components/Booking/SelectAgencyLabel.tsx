'use client'

import React from 'react'
import { useAgencySelector } from '@/contexts'
import { Skeleton, Stack, Typography } from '@mui/material'

type SelectAgencyLabelProps = {
  openSelectionAgency: () => void
}

export const SelectAgencyLabel = ({ openSelectionAgency }: SelectAgencyLabelProps) => {
  const { selectedAgency } = useAgencySelector()

  return (
    <>
      {!selectedAgency && <Skeleton variant="text" width={280} height={20} />}
      {selectedAgency && (
        <Stack direction="row">
          <Typography variant="titleSm" color="grey.600" data-testid="selectAgencyLabel-agencyName">
            Agence {selectedAgency.name} -{' '}
          </Typography>
          <Typography
            data-testid="selectAgencyLabel-changeAgency"
            variant="titleSm"
            color="grey.600"
            sx={{
              cursor: {
                xs: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              },
            }}>
            {' '}
            <span style={{ cursor: 'pointer' }} onClick={() => openSelectionAgency()}>
              Changer d'agence
            </span>
          </Typography>
        </Stack>
      )}
    </>
  )
}
