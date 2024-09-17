import { SimpleModal } from '@/components'
import React, { forwardRef } from 'react'

export const AcceptBookingConditionsModal: React.FC<{ onClose: () => void }> = forwardRef(
  (props, ref) => {
    const { onClose } = props
    return (
      <SimpleModal
        imageUrl="/design_2.svg"
        title="Vous devez valider les conditions générales de vente"
        mainAction="Valider"
        onMainAction={onClose}></SimpleModal>
    )
  },
)
