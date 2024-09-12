import { AncvIcon, ObIcon, PaymentIcon } from '@/components'
import { AgencyContractCode, PaymentMethod } from '@/types'

export const getPaymentMethodData = ({
  contractCode,
}: {
  contractCode: AgencyContractCode
}): PaymentMethod => {
  const names = {
    CB: '',
    ANCV: 'Chèque-vacances Connect',
    MULTI_CB: 'Avec 2, 3 ou 4 cartes bancaires',
    '3DS': 'Carte Bancaire',
  }
  const icons = {
    CB: <ObIcon />,
    ANCV: <AncvIcon />,
    MULTI_CB: <PaymentIcon />,
    '3DS': <ObIcon />,
  }
  return {
    name: names[contractCode],
    icon: icons[contractCode],
  }
}
