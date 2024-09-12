import { SimpleModal } from '@/components'

export const NoPaymentMethodConfirmationModal = ({
  onChoosePaymentMethod,
}: {
  onChoosePaymentMethod: () => void
}) => {
  return (
    <SimpleModal
      imageUrl="/design_2.svg"
      title="Vous devez sélectionner un moyen de paiement"
      mainAction="Je choisis un moyen de paiement"
      onMainAction={onChoosePaymentMethod}></SimpleModal>
  )
}
