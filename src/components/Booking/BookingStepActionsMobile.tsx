import { Button, Stack } from '@mui/material'

export const BookingStepActionsMobile = ({
  onContinue,
  onGoBack,
  isLoading,
}: {
  onContinue: React.MouseEventHandler<HTMLButtonElement>
  onGoBack: React.MouseEventHandler<HTMLButtonElement>
  isLoading?: boolean
}) => {
  return (
    <Stack pt={2} px={2} pb={8} justifyContent="center" gap={1}>
      <Button
        disabled={isLoading}
        onClick={onContinue}
        variant="contained"
        size="medium"
        data-testid="bookingStepsAction-continueButtonMobile">
        Continuer
      </Button>
      <Button
        disabled={isLoading}
        onClick={onGoBack}
        variant="text"
        size="medium"
        data-testid="bookingStepsAction-goBackButtonMobile">
        Précédent
      </Button>
    </Stack>
  )
}
