'use client'

import { SimpleModal } from '@/components'
import React, { forwardRef } from 'react'

export const NoAgencyWarningModal: React.FC<{ onShowAgency: () => void }> = forwardRef(
  (props, ref) => {
    const { onShowAgency } = props
    return (
      <SimpleModal
        imageUrl="/design_2.svg"
        title="Veuillez sélectionner votre agence"
        mainAction="Valider"
        onMainAction={onShowAgency}></SimpleModal>
    )
  },
)
