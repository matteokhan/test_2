'use client'

import { BookingConfirmation, FlightsLoader, Navbar, SectionContainer, TopBar } from '@/components'
import useMetadata from '@/contexts/useMetadata'
import { getOrder } from '@/services'
import { OrderDto } from '@/types'
import { Box, Stack, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SuccessPage() {
  useMetadata('Confirmation')
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const queryClient = useQueryClient()
  const [order, setOrder] = useState<OrderDto | null>(null)
  const router = useRouter()

  if (!orderId) {
    // TODO: log this somewhere
    // TODO: Warn the user that something went wrong
    return null
  }

  const confirmPayment = async () => {
    try {
      let orderIsReady = false
      do {
        // Fetch until the order is ready
        const orderData = await queryClient.fetchQuery<OrderDto>({
          queryKey: ['order', orderId],
          queryFn: () => getOrder({ orderId: orderId }),
          staleTime: 0,
        })
        if (
          !orderData.is_paid &&
          (orderData.payment_status_code === '00000' || !orderData.payment_status_code)
        ) {
          // wait 2 seconds before retrying
          await new Promise((resolve) => setTimeout(resolve, 2000))
        } else {
          orderIsReady = true
          if (orderData.is_paid) {
            setOrder(orderData)
          } else {
            router.push(`/booking/summary?order_id=${orderId}`)
          }
          setIsLoading(false)
        }
      } while (!orderIsReady)
      return order
    } catch (error) {
      // TODO: log this somewhere
      // TODO: Warn the user that something went wrong
      throw error
    }
  }

  useEffect(() => {
    confirmPayment()
  }, [])

  return (
    <>
      <TopBar height={60}>
        <Navbar />
      </TopBar>
      {isLoading && (
        <SectionContainer sx={{ paddingY: 3, justifyContent: 'center' }}>
          <Stack sx={{ mt: { xs: 0, lg: 2 }, mb: { xs: 2, lg: 5 } }} alignItems="center">
            <Stack maxWidth="516px" direction="row" gap={3} alignItems="center">
              <FlightsLoader />
              <Box>
                <Typography variant="titleLg">
                  Nous attendons la confirmation de votre paiement ...
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </SectionContainer>
      )}
      {!isLoading && order?.is_paid == true && (
        <>
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
      )}
    </>
  )
}
