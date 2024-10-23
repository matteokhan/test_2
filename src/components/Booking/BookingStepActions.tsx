import { Box, Button, Stack } from '@mui/material'

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
    <>
      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        <Stack
          pt={2}
          px={4}
          pb={11}
          direction="row"
          justifyContent="flex-end"
          gap={1}
          className="desktop">
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
      </Box>
      <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
        <Stack
          pt={2}
          px={{ xs: 2, md: 5 }}
          pb={8}
          justifyContent="center"
          gap={1}
          className="mobile">
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
      </Box>
    </>
  )
}
