import { Box } from '@mui/material'
import { SectionContainer } from '@/components'

export const Search = () => {
  return (
    <>
      <Box
        sx={{
          backgroundColor: 'primary.main',
        }}>
        <SectionContainer sx={{ height: 60, justifyContent: 'space-between' }}>
          <p>Search</p>
        </SectionContainer>
      </Box>
    </>
  )
}
