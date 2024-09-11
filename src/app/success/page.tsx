import { BookingConfirmation, Navbar, SectionContainer, TopBar } from '@/components'
import { Box } from '@mui/material'

export default function SuccessPage() {
  return (
    <>
      <TopBar height={60}>
        <Navbar />
      </TopBar>
      <Box
        sx={{
          backgroundColor: 'grey.200',
        }}>
        <SectionContainer sx={{ paddingY: 3 }}>
          <BookingConfirmation />
        </SectionContainer>
      </Box>
    </>
  )
}
