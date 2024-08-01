import { Box, Paper, Typography } from '@mui/material'

export const SimpleContainer = ({
  children,
  title,
}: {
  children: React.ReactNode
  title?: string
}) => {
  return (
    <Paper sx={{ pb: 4, mb: 2 }}>
      {title && (
        <Box pt={3} pb={2} pl={4} width="100%" borderBottom="1px solid" borderColor="grey.400">
          <Typography variant="titleLg">{title}</Typography>
        </Box>
      )}
      <Box px={4} pt={2}>
        {children}
      </Box>
    </Paper>
  )
}
