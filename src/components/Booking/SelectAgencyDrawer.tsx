'use client'

import { useAgencySelector } from '@/contexts'
import { Drawer } from '@mui/material'
import { SelectAgencyMap } from '@/components'

export function SelectAgencyDrawer() {
  const { isAgencySelectorOpen, setIsAgencySelectorOpen, selectAgency } = useAgencySelector()
  return (
    <Drawer
      open={isAgencySelectorOpen}
      onClose={() => setIsAgencySelectorOpen(false)}
      anchor="right"
      PaperProps={{
        sx: {
          borderRadius: 0,
        },
      }}>
      <SelectAgencyMap
        onClose={() => setIsAgencySelectorOpen(false)}
        onSelectAgency={({ agency }) => {
          document.dispatchEvent(new CustomEvent('agencySelected', { detail: { agency } }))
          selectAgency(agency)
          setIsAgencySelectorOpen(false)
        }}
      />
    </Drawer>
  )
}
