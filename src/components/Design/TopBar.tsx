import { Box, Paper } from '@mui/material'

export const TopBar = ({
  children,
  height,
  fixed,
}: {
  children: React.ReactNode
  height: number
  fixed?: boolean
}) => {
  return (
    <>
      <Paper
        sx={{
          position: fixed ? 'fixed' : 'unset',
          width: '100%',
          zIndex: 'appBar',
          borderRadius: 0,
        }}
        elevation={2}>
        {children}
      </Paper>
      {fixed && <Box sx={{ height: height }}></Box>}
    </>
  )
}
