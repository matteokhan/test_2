import {
  BookingStepsTopbar,
  Header,
  SectionContainer,
  SelectedFlightInfoTopbar,
} from '@/components'
import { Box } from '@mui/material'

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <SelectedFlightInfoTopbar />
      <Box sx={{ backgroundColor: 'grey.200' }}>
        <SectionContainer
          sx={{ justifyContent: 'space-between', paddingY: 3, flexDirection: 'column' }}>
          <BookingStepsTopbar />
          {children}
        </SectionContainer>
      </Box>
    </>
  )
}
