import { Button, Stack } from '@mui/material'

export const BookingStepActions = ({
  onContinue,
  onGoBack,
  isLoading,
  goBackDisabled,
}: {
  onContinue: React.MouseEventHandler<HTMLButtonElement>
  onGoBack: React.MouseEventHandler<HTMLButtonElement>
  goBackDisabled?: boolean
  isLoading?: boolean
}) => {
  return (
    <Stack pt={2} px={4} pb={11} direction="row" justifyContent="flex-end" gap={1}>
      <Button
        disabled={isLoading || goBackDisabled}
        onClick={onGoBack}
        variant="text"
        size="large"
        data-testid="bookingStepsAction-goBackButton">
        Précédent
      </Button>
      <Button
        disabled={isLoading}
        onClick={onContinue}
        variant="contained"
        size="large"
        data-testid="bookingStepsAction-continueButton">
        Continuer
      </Button>
    </Stack>
  )
}
