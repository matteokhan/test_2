import { AncvIcon, ObIcon, PaymentIcon, Floa3XIcon, Floa4XIcon } from '@/components'
import { AgencyContractCode, PaymentMethod } from '@/types'

export const getPaymentMethodData = ({
  contractCode,
}: {
  contractCode: AgencyContractCode
}): PaymentMethod => {
  const names = {
    CB: '',
    ANCV: 'Chèque-vacances Connect.',
    MULTI_CB: 'Avec 2, 3 ou 4 cartes bancaires. Visa ou Mastercard.',
    '3DS': 'Carte Bancaire. Visa ou Mastercard.',
    FLOA_BC3XC: 'Payer en 3 fois. Avec votre carte bancaire, via notre partenaire Floa',
    FLOA_BC4XC: 'Payer en 4 fois. Avec votre carte bancaire, via notre partenaire Floa',
  }
  const icons = {
    CB: <ObIcon />,
    ANCV: <AncvIcon />,
    MULTI_CB: <PaymentIcon />,
    '3DS': <ObIcon />,
    FLOA_BC3XC: <Floa3XIcon />,
    FLOA_BC4XC: <Floa4XIcon />,
  }
  return {
    name: names[contractCode],
    icon: icons[contractCode],
    contractCode,
  }
}
