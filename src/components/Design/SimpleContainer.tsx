import { Box, Button, Paper, Stack, SxProps, Typography } from '@mui/material'

type BaseSimpleContainerProps = {
  children: React.ReactNode
  title?: string
  sx?: SxProps
  disabled?: boolean
}

type SimpleContainerWithoutAction = BaseSimpleContainerProps & {
  action?: never
  onAction?: never
}

type SimpleContainerWithAction = BaseSimpleContainerProps & {
  action: string
  onAction: () => void
}

type SimpleContainerProps = SimpleContainerWithoutAction | SimpleContainerWithAction

export const SimpleContainer = ({
  children,
  title,
  sx,
  action,
  onAction,
  disabled,
}: SimpleContainerProps) => {
  return (
    <Paper sx={{ pb: { xs: 3, lg: 4 }, borderRadius: { xs: 0, lg: '6px' }, mb: 2, ...sx }}>
      {title && (
        <Stack
          alignItems="center"
          pb={2}
          width="100%"
          borderBottom="1px solid"
          borderColor="grey.400"
          direction="row"
          justifyContent="space-between"
          sx={{ pt: action ? 2 : 3, px: { xs: 2, md: 5, lg: 4 } }}>
          <Typography variant="titleLg">{title}</Typography>
          {action && (
            <Button onClick={onAction} variant="outlined" sx={{ px: 3 }} disabled={disabled}>
              {action}
            </Button>
          )}
        </Stack>
      )}
      <Box sx={{ px: { xs: 2, md: 5, lg: 4 } }}>{children}</Box>
    </Paper>
  )
}
