import { Button, Stack } from '@mui/material'

export const BookingStepActionsMobile = ({
  onContinue,
  onGoBack,
  isLoading,
  goBackDisabled,
}: {
  onContinue: React.MouseEventHandler<HTMLButtonElement>
  onGoBack: React.MouseEventHandler<HTMLButtonElement>
  isLoading?: boolean
  goBackDisabled?: boolean
}) => {
  return (
    <Stack pt={2} px={{ xs: 2, md: 5 }} pb={8} justifyContent="center" gap={1}>
      <Button
        disabled={isLoading}
        onClick={onContinue}
        variant="contained"
        size="medium"
        data-testid="bookingStepsAction-continueButton">
        Continuer
      </Button>
      <Button
        disabled={isLoading || goBackDisabled}
        onClick={onGoBack}
        variant="text"
        size="medium"
        data-testid="bookingStepsAction-goBackButton">
        Précédent
      </Button>
    </Stack>
  )
}
