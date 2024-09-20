'use client'

import React from 'react'
import { PassengerForm } from '@/components'
import { FormikHelpers, FormikProps } from 'formik'
import { PassengerData } from '@/types'
import { SimpleContainer } from '@/components'

type PassengerInfoProps = {
  onSubmit?: (values: PassengerData, actions: FormikHelpers<PassengerData>) => void
  formRef: (el: FormikProps<PassengerData> | null) => void
  passengerNumber: number
  isPayer: boolean
  onPayerChange: (isPayer: boolean) => void
  initialValues: PassengerData
}

export const PassengerInfo = ({
  formRef,
  onSubmit,
  passengerNumber,
  isPayer,
  onPayerChange,
  initialValues,
}: PassengerInfoProps) => {
  return (
    <SimpleContainer title={'Passager ' + passengerNumber}>
      <PassengerForm
        onSubmit={onSubmit ? onSubmit : () => {}}
        formRef={formRef}
        isPayer={isPayer}
        onPayerChange={onPayerChange}
        initialValues={initialValues}
      />
    </SimpleContainer>
  )
}
