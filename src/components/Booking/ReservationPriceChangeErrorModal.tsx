import { SimpleModal } from '@/components'
import { Typography } from '@mui/material'
import React, { forwardRef } from 'react'

export const ReservationPriceChangeErrorModal: React.FC<{ onClose: () => void }> = forwardRef(
  (props, ref) => {
    const { onClose } = props
    return (
      <SimpleModal
        imageUrl="/design_2.svg"
        title="Oups, votre dossier de voyage n'a pas été créé"
        mainAction="Valider"
        onMainAction={onClose}>
        <Typography variant="bodyMd">
          Le tarif de votre voyage à changé ! Veuillez relancer une recherche et recommencer.
        </Typography>
      </SimpleModal>
    )
  },
)
