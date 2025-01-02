import React, { forwardRef } from 'react'
import { Typography } from '@mui/material'
import { SimpleModal } from '@/components'

export const RoundtripRestrictedFlightModal: React.FC<{
  onClose: () => void
}> = forwardRef((props, ref) => {
  const { onClose } = props
  return (
    <SimpleModal
      imageUrl="/design_2.svg"
      title="Impossible de réserver ce trajet"
      mainAction="Valider"
      onMainAction={onClose}>
      <Typography variant="bodyMd">
        Les autorités du pays de destination demandent un billet aller/retour, veuillez modifier le
        type de voyage en Aller/Retour
      </Typography>
    </SimpleModal>
  )
})
