import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import Image from 'next/image'

type SimpleModalBaseProps = {
  imageUrl: string
  title: string
  children?: React.ReactNode
  alignItems?: 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline'
}

type SimpleModalMainActionProps =
  | {
      mainAction: string
      onMainAction: () => void
    }
  | {
      mainAction?: never
      onMainAction?: never
    }

type SimpleModalSecondaryActionProps =
  | {
      secondaryAction: string
      onSecondaryAction: () => void
    }
  | {
      secondaryAction?: never
      onSecondaryAction?: never
    }

type SimpleModalProps = SimpleModalBaseProps &
  SimpleModalMainActionProps &
  SimpleModalSecondaryActionProps

export const SimpleModal = ({
  imageUrl,
  title,
  children,
  mainAction,
  onMainAction,
  secondaryAction,
  onSecondaryAction,
  alignItems,
}: SimpleModalProps) => {
  return (
    <Paper
      sx={{
        pt: 4,
        px: 3,
        pb: 3,
        boxSizing: 'border-box',
        maxWidth: 412,
        width: '90%',
        borderRadius: '12px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}>
      <Stack alignItems="center" width={'100%'}>
        <Box width={160} height={160} position="relative" mb={2}>
          <Image src={imageUrl} alt="modal image" fill />
        </Box>
        <Stack pt={1} pb={2} gap={1.5} alignItems="center" width={'100%'}>
          <Typography variant="titleLg">{title}</Typography>
          <Stack gap={1} alignItems={alignItems || 'center'} width={'100%'}>
            {children}
          </Stack>
        </Stack>
        <Stack direction="row" gap={1} width="100%" justifyContent="flex-end" pt={2}>
          {onSecondaryAction && (
            <Button
              sx={{ px: 3 }}
              onClick={() => {
                onSecondaryAction ? onSecondaryAction() : null
              }}>
              {secondaryAction}
            </Button>
          )}
          <Button
            sx={{ px: 3 }}
            variant="contained"
            onClick={() => {
              onMainAction ? onMainAction() : null
            }}>
            {mainAction}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}
