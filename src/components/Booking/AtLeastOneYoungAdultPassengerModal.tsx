import { SimpleModal } from '@/components'
import React, { forwardRef } from 'react'

export const AtLeastOneYoungAdultPassengerModal: React.FC<{ onClose: () => void }> = forwardRef(
  (props, ref) => {
    const { onClose } = props
    return (
      <SimpleModal
        imageUrl="/design_2.svg"
        title="Au moins un jeune adulte"
        mainAction="Valider"
        onMainAction={onClose}></SimpleModal>
    )
  },
)
