import React, { forwardRef } from 'react'
import { Typography } from '@mui/material'
import { SimpleModal } from '@/components'

export const NoInsuranceConfirmationModal: React.FC<{
  onChooseInsurance: () => void
  onNoInsurance: () => void
}> = forwardRef((props, ref) => {
  const { onChooseInsurance, onNoInsurance } = props
  return (
    <SimpleModal
      imageUrl="/design_2.svg"
      title="Vous voyagez sans assurance ?"
      mainAction="Je choisis une assurance"
      onMainAction={onChooseInsurance}
      secondaryAction="Aucune assurance"
      onSecondaryAction={onNoInsurance}>
      <Typography variant="bodyMd">
        Pour votre confort, nous vous recommandons de sélectionner une des assurances proposées. Il
        ne sera plus possible d’y souscrire après votre réservation.
      </Typography>
    </SimpleModal>
  )
})
