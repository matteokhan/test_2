import { SimpleModal } from '@/components'
import React, { forwardRef } from 'react'

export const AtLeastOneAccompanyingAdultPassengerModal: React.FC<{ onClose: () => void }> =
  forwardRef((props, ref) => {
    const { onClose } = props
    return (
      <SimpleModal
        imageUrl="/design_2.svg"
        title="Les enfants et/ou bébés doivent voyager avec au moins 1 adulte de + de 18 ans."
        mainAction="Valider"
        onMainAction={onClose}></SimpleModal>
    )
  })
