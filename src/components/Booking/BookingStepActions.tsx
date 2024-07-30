import { Button, Stack } from '@mui/material'

export const BookingStepActions = ({
  onContinue,
  onGoBack,
}: {
  onContinue: React.MouseEventHandler<HTMLButtonElement>
  onGoBack: React.MouseEventHandler<HTMLButtonElement>
}) => {
  return (
    <Stack pt={2} px={4} pb={11} direction="row" justifyContent="flex-end" gap={1}>
      <Button onClick={onGoBack} variant="text" size="large">
        Précédent
      </Button>
      <Button onClick={onContinue} variant="contained" size="large">
        Continuer
      </Button>
    </Stack>
  )
}
