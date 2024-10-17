import React, { forwardRef } from 'react'
import { Typography } from '@mui/material'
import { SimpleModal } from '@/components'

export const AlertDestinationModal: React.FC<{
  onShowAgency: () => void
  onClose: () => void
}> = forwardRef((props, ref) => {
  const { onShowAgency, onClose } = props
  return (
    <SimpleModal
      imageUrl="/design_2.svg"
      title="Impossible de réserver ce trajet"
      mainAction="Voir les agences"
      onMainAction={onShowAgency}
      secondaryAction="Nouvelle recherche"
      onSecondaryAction={onClose}>
      <Typography variant="bodyMd">
        Pour ce type de trajet, vous devez prendre contact avec une de nos agences directement. Vous
        pouvez afficher les agences autour de chez vous pour plus d'informations.
      </Typography>
    </SimpleModal>
  )
})
