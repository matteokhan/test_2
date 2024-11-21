import { SimpleModal } from '@/components'
import React, { forwardRef } from 'react'

export const NoResultsErrorModal: React.FC<{ onClose: () => void }> = forwardRef((props, ref) => {
  const { onClose } = props
  return (
    <SimpleModal
      imageUrl="/design_2.svg"
      title="Aucun vol n’est disponible pour la destination et/ou la date demandée. Vous pouvez re-essayer avec d’autres dates."
      mainAction="Valider"
      onMainAction={onClose}></SimpleModal>
  )
})
