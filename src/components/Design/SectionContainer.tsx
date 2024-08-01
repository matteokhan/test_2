import { Container as MuiContainer, ContainerProps as MuiContainerProps } from '@mui/material'

export const SectionContainer = ({ children, sx, ...props }: MuiContainerProps) => {
  return (
    <MuiContainer
      sx={{
        paddingX: {
          xs: 2,
          sm: 2,
          md: 5,
          lg: 5,
          xl: 5,
        },
        display: 'flex',
        ...sx,
      }}
      disableGutters
      {...props}>
      {children}
    </MuiContainer>
  )
}
