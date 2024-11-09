import { SimpleModal } from '@/components'
import { Formality } from '@/types'
import { Box } from '@mui/material'
import DOMPurify from 'dompurify'
import React, { forwardRef } from 'react'

export const FormalitiesModal: React.FC<{ onClose: () => void; formalities: Formality[] }> =
  forwardRef((props, ref) => {
    const { onClose, formalities } = props
    return (
      <SimpleModal imageUrl="/design_2.svg" title="" mainAction="Valider" onMainAction={onClose}>
        <Box maxHeight="40vh" overflow="scroll">
          {formalities.map((formality) => (
            <Box
              pb={2}
              key={formality.id}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(formality.description, {
                  ADD_ATTR: ['target'],
                }),
              }}></Box>
          ))}
        </Box>
      </SimpleModal>
    )
  })
