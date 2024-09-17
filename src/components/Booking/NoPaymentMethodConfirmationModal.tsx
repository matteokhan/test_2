import { SimpleModal } from '@/components'
import React, { forwardRef } from 'react'

export const NoPaymentMethodConfirmationModal: React.FC<{
  onChoosePaymentMethod: () => void
}> = forwardRef((props, ref) => {
  const { onChoosePaymentMethod } = props
  return (
    <SimpleModal
      imageUrl="/design_2.svg"
      title="Vous devez sélectionner un moyen de paiement"
      mainAction="Je choisis un moyen de paiement"
      onMainAction={onChoosePaymentMethod}></SimpleModal>
  )
})
