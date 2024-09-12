import React from 'react'
import { useBooking } from '@/contexts'
import { AgencyContractCode } from '@/types'
import { getPaymentMethodData } from '@/utils'
import { Box, Radio, Stack, Typography } from '@mui/material'

export const SelectPaymentMethod = ({
  onSelect,
}: {
  onSelect: (contract: AgencyContractCode) => void
}) => {
  // TODO: need to attend to the selected agency
  const { selectedAgency } = useBooking()
  const [selectedMethod, setSelectedMethod] = React.useState<AgencyContractCode | null>(null)
  // TODO: get available contracts from selected agency
  const availableContracts: AgencyContractCode[] = ['3DS', 'ANCV', 'MULTI_CB']
  return (
    <Box pt={3} pb={2} data-testid="selectPaymentMethod" maxWidth={590}>
      <Stack border="1px solid" borderColor="grey.400" borderRadius={2}>
        {availableContracts.map((contract, index) => {
          const { name, icon } = getPaymentMethodData({ contractCode: contract })
          const isLastOne = index === availableContracts.length - 1
          return (
            <Stack
              borderBottom={isLastOne ? 'none' : '1px solid'}
              borderColor="grey.400"
              p={1}
              height={56}
              key={contract}
              onClick={() => {
                onSelect(contract)
                setSelectedMethod(contract)
              }}
              direction="row"
              justifyContent="space-between"
              alignItems="center">
              <Stack direction="row" alignItems="center" gap={2}>
                {icon}
                <Typography variant="bodyMd">{name}</Typography>
              </Stack>
              <Radio
                data-testid="selectPaymentMethod-option"
                checked={selectedMethod === contract}
              />
            </Stack>
          )
        })}
      </Stack>
    </Box>
  )
}
