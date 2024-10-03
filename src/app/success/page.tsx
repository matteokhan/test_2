'use client'

import { BookingConfirmation, Navbar, SectionContainer, TopBar } from '@/components'
import { useOrder } from '@/services'
import { Box } from '@mui/material'
import { useSearchParams } from 'next/navigation'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const order_id = searchParams.get('order_id')
  if (!order_id) {
    // TODO: log this somewhere
    // TODO: Warn the user that something went wrong
    return null
  }
  const { data: order } = useOrder({ orderId: order_id })
  return (
    <>
      <TopBar height={60}>
        <Navbar />
      </TopBar>
      <Box
        sx={{
          backgroundColor: 'grey.200',
          display: { xs: 'none', lg: 'block' },
        }}>
        <SectionContainer sx={{ paddingY: 3 }}>
          {order && <BookingConfirmation order={order} />}
        </SectionContainer>
      </Box>
      <Box
        sx={{
          display: { xs: 'block', lg: 'none' },
          height: '100vh',
        }}>
        {order && <BookingConfirmation order={order} />}
      </Box>
    </>
  )
}
