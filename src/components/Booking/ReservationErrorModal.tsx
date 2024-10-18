import { SimpleModal } from '@/components'
import React, { forwardRef } from 'react'

export const ReservationErrorModal: React.FC<{ onClose: () => void }> = forwardRef((props, ref) => {
  const { onClose } = props
  return (
    <SimpleModal
      imageUrl="/design_2.svg"
      title="Oups, votre dossier de voyage n'a pas été créé"
      mainAction="Valider"
      onMainAction={onClose}></SimpleModal>
  )
})
