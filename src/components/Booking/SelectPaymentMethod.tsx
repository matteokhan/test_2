import React from 'react'
import { AgencyContractCode } from '@/types'
import { getPaymentMethodData } from '@/utils'
import { Box, Radio, Stack, Typography } from '@mui/material'
import { useAgencySelector } from '@/contexts'

export const SelectPaymentMethod = ({
  onSelect,
}: {
  onSelect: (contract: AgencyContractCode) => void
}) => {
  const [selectedMethod, setSelectedMethod] = React.useState<AgencyContractCode | null>(null)
  const { selectedAgency } = useAgencySelector()
  const availableContracts: AgencyContractCode[] =
    (selectedAgency?.available_contracts.map((contractCode) =>
      contractCode.replace(/\s/g, ''),
    ) as AgencyContractCode[]) || []

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
