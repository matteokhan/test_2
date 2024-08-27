import { Box, Button } from '@mui/material'
import { SectionContainer } from '@/components'

export const CommonLinks = () => {
  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'grey.200',
        display: {
          xs: 'none',
          md: 'block',
        },
      }}>
      <SectionContainer
        sx={{
          height: 60,
          alignItems: 'center',
          gap: 0.8,
        }}>
        <Button variant="outlined" data-testid="navbar-flashSalesButton">
          Ventes Flash
        </Button>
        <Button variant="outlined" data-testid="navbar-lastMinuteButton">
          Dernière minute
        </Button>
        <Button variant="outlined" data-testid="navbar-easterButton">
          Pâques
        </Button>
      </SectionContainer>
    </Box>
  )
}
