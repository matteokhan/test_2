import { Box, Paper } from '@mui/material'

export const TopBar = ({ children, height }: { children: React.ReactNode; height: number }) => {
  return (
    <>
      <Paper
        sx={{
          position: 'fixed',
          width: '100%',
          zIndex: 'appBar',
          borderRadius: 0,
        }}
        elevation={2}>
        {children}
      </Paper>
      <Box sx={{ height: height }}></Box>
    </>
  )
}
