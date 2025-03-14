import { SimpleModal } from '@/components'
import React, { forwardRef } from 'react'

export const AtLeastOneAdultPassengerModal: React.FC<{ onClose: () => void }> = forwardRef(
  (props, ref) => {
    const { onClose } = props
    return (
      <SimpleModal
        imageUrl="/design_2.svg"
        title="Votre réservation doit comporter au moins un passager de + de 18 ans."
        mainAction="Valider"
        onMainAction={onClose}></SimpleModal>
    )
  },
)
