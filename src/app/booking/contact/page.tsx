'use client'

import React, { useRef, useState } from 'react'
import {
  BookingStepActions,
  PayerForm,
  SimpleContainer,
  ReservationErrorModal,
  ReservationPriceChangeErrorModal,
} from '@/components'
import { useBooking } from '@/contexts'
import { Modal } from '@mui/material'
import { FormikProps } from 'formik'
import {
  GDSType,
  PayerData,
  UpdateOrderParams,
  AncillariesQueryResult,
  LCCAncillary,
} from '@/types'
import { useUpdateOrder, useReserveOrder, getAncillaries, getLCCAncillaries } from '@/services'
import { useQueryClient } from '@tanstack/react-query'
import useMetadata from '@/contexts/useMetadata'
import { AppError, getAncillaryServices } from '@/utils'
import { useRouter } from 'next/navigation'
import * as Sentry from '@sentry/nextjs'

export default function ContactInfoPage() {
  useMetadata('Informations facturation')
  const formRef = useRef<FormikProps<PayerData> | null>(null)
  const queryClient = useQueryClient()
  const [isNavigating, setIsNavigating] = useState(false)
  const [reservationErrorModalIsOpen, setReservationErrorModalIsOpen] = useState(false)
  const [reservationPriceChangeErrorModalIsOpen, setReservationPriceChangeErrorModalIsOpen] =
    useState(false)
  const [isCheckingAncillaries, setIsCheckingAncillaries] = useState(false)
  const {
    goNextStep,
    setPayer,
    passengers,
    payerIndex,
    goPreviousStep,
    payer,
    order,
    setOrder,
    selectedFare,
    setPnr,
    skipStep,
    bookingStartTime,
  } = useBooking()
  const router = useRouter()
  const { mutate: updateOrder, isPending: isUpdatingOrder } = useUpdateOrder()
  const { mutate: reserveOrder, isPending: isReservingOrder } = useReserveOrder()
  const isLoading = isUpdatingOrder || isNavigating || isReservingOrder || isCheckingAncillaries

  const handleSubmit = async () => {
    if (!formRef.current || !order || !selectedFare) {
      throw new AppError(
        'Something went wrong submitting contact info',
        'Submit contact info preconditions not met',
        {
          missingData: {
            formRef: !formRef.current,
            order: !order,
            selectedFare: !selectedFare,
          },
        },
      )
    }

    const errors = await formRef.current.validateForm()
    if (Object.keys(errors).length !== 0) {
      formRef.current.setTouched(
        Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
      )
      return
    }
    const payerDataValidated = formRef.current.values
    setPayer(payerDataValidated)

    const newOrder: UpdateOrderParams = {
      orderId: order.id,
      payer: payerDataValidated,
    }
    updateOrder(newOrder, {
      onSuccess: async (orderRes) => {
        setOrder(orderRes)
        if (selectedFare.gdsType == GDSType.REGULAR) {
          reserveOrder(
            { orderId: order.id, solutionId: selectedFare.id },
            {
              onSuccess: async (reservationData) => {
                if (reservationData.travel_data?.passenger_name_record) {
                  setIsCheckingAncillaries(true)
                  try {
                    const ancillaries = await queryClient.fetchQuery<AncillariesQueryResult>({
                      queryKey: ['ancillaries', order.id],
                      queryFn: () => getAncillaries({ orderId: order.id }),
                      gcTime: 3 * 1000,
                      staleTime: 3 * 1000,
                    })
                    const hasAncillaries = ancillaries.ancillaries.some((anc) => {
                      const [outboundServices, inboundServices] = getAncillaryServices(
                        anc,
                        ancillaries,
                        selectedFare,
                      )
                      return outboundServices.length > 0 || inboundServices.length > 0
                    })
                    if (!hasAncillaries) {
                      skipStep('ancillaries')
                    }
                  } catch (error) {
                    skipStep('ancillaries')
                    let appError = new AppError(
                      'Something went wrong checking ancillaries',
                      'Server error prechecking ancillaries',
                      {
                        serverError: error,
                      },
                    )
                    Sentry.captureException(appError, {
                      extra: appError.extra,
                    })
                  } finally {
                    setIsCheckingAncillaries(false)
                  }
                  // If we get a PNR, the booking won't change price, so no need to warn the user
                  bookingStartTime.current = null
                  setPnr(reservationData.travel_data.passenger_name_record)
                  setIsNavigating(true)
                  goNextStep()
                } else {
                  if (reservationData.status == 'ERROR PRICE CHANGE') {
                    setReservationPriceChangeErrorModalIsOpen(true)
                  } else {
                    setReservationErrorModalIsOpen(true)
                  }
                  let appError = new AppError(
                    'Something went wrong reserving the order',
                    'Reserving order failed. No PNR',
                    {
                      reservationData: reservationData,
                    },
                  )
                  Sentry.captureException(appError, {
                    extra: appError.extra,
                  })
                }
              },
              onError: (error) => {
                setReservationErrorModalIsOpen(true)
                let appError = new AppError(
                  'Something went wrong reserving the order',
                  'Reserving order failed',
                  {
                    serverError: error,
                  },
                )
                Sentry.captureException(appError, {
                  extra: appError.extra,
                })
              },
            },
          )
        } else if (selectedFare.gdsType === GDSType.LOW_COST_CARRIER) {
          setIsCheckingAncillaries(true)
          try {
            const lccAncillaries = await queryClient.fetchQuery<LCCAncillary[]>({
              queryKey: ['lcc-ancillaries', order.id, selectedFare.id],
              queryFn: () => getLCCAncillaries({ orderId: order.id, solutionId: selectedFare.id }),
            })
            if (lccAncillaries.filter((a) => Number(a.price) > 0).length === 0) {
              skipStep('ancillaries')
            }
          } catch (error) {
            skipStep('ancillaries')
            let appError = new AppError(
              'Something went wrong checking ancillaries',
              'Server error prechecking LCC ancillaries',
              {
                serverError: error,
              },
            )
            Sentry.captureException(appError, {
              extra: appError.extra,
            })
          } finally {
            setIsCheckingAncillaries(false)
          }
          setIsNavigating(true)
          goNextStep()
        } else {
          throw new AppError(
            'Something went wrong submitting contact info',
            'Invalid selected fare GDS type',
            {
              selectedFare: selectedFare,
            },
          )
        }
      },
      onError: (error) => {
        setReservationErrorModalIsOpen(true)
        let appError = new AppError(
          'Something went wrong updating the order',
          'Updating order at contact step failed',
          {
            serverError: error,
          },
        )
        Sentry.captureException(appError, {
          extra: appError.extra,
        })
      },
    })
  }

  return (
    <>
      <SimpleContainer title="Coordonnées">
        <PayerForm
          formRef={formRef}
          onSubmit={() => {}}
          initialValues={
            payer
              ? payer
              : payerIndex !== null
                ? {
                    ...passengers[payerIndex],
                    address: '',
                    postalCode: '',
                    city: '',
                    country: 'FR',
                    createAccountOptIn: false,
                    subscribeNewsletterOptIn: true,
                  }
                : undefined
          }
        />
      </SimpleContainer>
      <BookingStepActions
        onContinue={handleSubmit}
        onGoBack={goPreviousStep}
        isLoading={isLoading}
      />
      <Modal
        open={reservationErrorModalIsOpen}
        onClose={() => setReservationErrorModalIsOpen(false)}>
        <ReservationErrorModal onClose={() => setReservationErrorModalIsOpen(false)} />
      </Modal>
      <Modal
        open={reservationPriceChangeErrorModalIsOpen}
        onClose={() => setReservationPriceChangeErrorModalIsOpen(false)}>
        <ReservationPriceChangeErrorModal
          onClose={() => {
            setReservationPriceChangeErrorModalIsOpen(false)
            router.push('/search?rechercher=1')
          }}
        />
      </Modal>
    </>
  )
}
