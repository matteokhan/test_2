import React from 'react'
import { AgencyContractCode } from '@/types'
import { capitalizeFirstLetter, getPaymentMethodData } from '@/utils'
import { Box, Radio, Stack, Typography } from '@mui/material'
import { useAgencySelector, useBooking } from '@/contexts'
import { FloaIcon } from '@/components'
import { useFloaPaymentOptions } from '@/services'
import dayjs from 'dayjs'

export const SelectPaymentMethod = ({
  onSelect,
}: {
  onSelect: (contract: AgencyContractCode | null) => void
}) => {
  const [selectedMethod, setSelectedMethod] = React.useState<AgencyContractCode | null>(null)
  const [floaSelected, setFloaSelected] = React.useState<boolean>(false)
  const { selectedAgency } = useAgencySelector()
  const { order, totalPrice } = useBooking()

  const { data: floaOptions } = useFloaPaymentOptions({
    orderId: order?.id,
    amount: totalPrice.toString(),
  })
  let agency_contracts = selectedAgency?.available_contracts
  let hasFloaOption = agency_contracts?.some((c) => c.startsWith('FLOA_'))

  return (
    <Box pt={3} pb={2} data-testid="selectPaymentMethod" maxWidth={590}>
      <Stack border="1px solid" borderColor="grey.400" borderRadius={2} mb={floaSelected ? 2 : 0}>
        {agency_contracts
          ?.filter((c) => !c.startsWith('FLOA_'))
          .map((contract, index) => {
            const { name, icon } = getPaymentMethodData({ contractCode: contract })
            const isLastOne = hasFloaOption ? false : index === agency_contracts.length - 1
            return (
              <Stack
                borderBottom={isLastOne ? 'none' : '1px solid'}
                borderColor="grey.400"
                p={1}
                height={56}
                key={contract}
                onClick={() => {
                  setFloaSelected(false)
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
        {hasFloaOption && (
          <Stack
            p={1}
            height={56}
            key="FLOA"
            onClick={() => {
              setFloaSelected(true)
              onSelect(null)
              setSelectedMethod(null)
            }}
            direction="row"
            justifyContent="space-between"
            alignItems="center">
            <Stack direction="row" alignItems="center" gap={2}>
              <FloaIcon />
              <Typography variant="bodyMd">Floa</Typography>
            </Stack>
            <Radio data-testid="selectPaymentMethod-option" checked={floaSelected} />
          </Stack>
        )}
      </Stack>
      {floaSelected && (
        <Stack borderRadius={2} border="1px solid" borderColor="grey.400">
          {floaOptions?.map((option, index) => {
            const isLastOne = index === floaOptions.length - 1
            const contractCode: AgencyContractCode = `FLOA_${option.product_code}`
            const { name, icon } = getPaymentMethodData({
              contractCode: contractCode,
            })
            return (
              <Stack
                key={index}
                px={1}
                py={2}
                direction="row"
                justifyContent="space-between"
                borderBottom={isLastOne ? 'none' : '1px solid'}
                borderColor="grey.400"
                gap={2}
                onClick={() => {
                  onSelect(contractCode)
                  setSelectedMethod(contractCode)
                }}>
                <Stack gap={1} flexGrow={1}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Box>{icon}</Box>
                    <Typography variant="titleSm">{name}</Typography>
                  </Stack>
                  <Typography variant="bodyMd">
                    Ce moyen de payment entraine des frais supplémentaires de{' '}
                    <span style={{ fontWeight: 'bold' }}>{option.customer_fees} EU</span>
                  </Typography>
                  <Stack borderTop="1px solid" borderColor="grey.200" pt={1} gap={1.25}>
                    {option.simulated_installments.map((installment, index) => {
                      const isFirstOne = index === 0
                      return (
                        <Stack key={index} direction="row" justifyContent="space-between" gap={2}>
                          <Typography variant="bodyMd" fontWeight={isFirstOne ? 700 : 400}>
                            {capitalizeFirstLetter(
                              dayjs(installment.date).format('dddd D MMMM YYYY'),
                            )}{' '}
                            {isFirstOne && "(Aujourd'hui)"}
                          </Typography>
                          <Typography
                            variant="bodyMd"
                            fontWeight={isFirstOne ? 700 : 400}
                            noWrap
                            sx={{ minWidth: 80, textAlign: 'right' }}>
                            {installment.amount} €
                          </Typography>
                        </Stack>
                      )
                    })}
                  </Stack>
                </Stack>
                <Stack justifyContent="center">
                  <Radio
                    data-testid="selectFloaOption-option"
                    checked={selectedMethod === contractCode}
                  />
                </Stack>
              </Stack>
            )
          })}
        </Stack>
      )}
    </Box>
  )
}
