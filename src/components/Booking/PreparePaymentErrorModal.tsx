import { SimpleModal } from '@/components'
import React, { forwardRef } from 'react'

export const PreparePaymentErrorModal: React.FC<{ onClose: () => void }> = forwardRef(
  (props, ref) => {
    const { onClose } = props
    return (
      <SimpleModal
        imageUrl="/design_2.svg"
        title="Il y a eu une erreur lors de la préparation du paiement"
        mainAction="Valider"
        onMainAction={onClose}></SimpleModal>
    )
  },
)
