import { forwardRef } from 'react'
import { Container as MuiContainer, ContainerProps as MuiContainerProps } from '@mui/material'

export const SectionContainer = forwardRef<HTMLDivElement, MuiContainerProps>(
  ({ children, sx, ...props }, ref) => {
    return (
      <MuiContainer
        ref={ref}
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
  },
)

// Add display name for better debugging
SectionContainer.displayName = 'SectionContainer'
