'use client'

import React from 'react'
import { Box, Paper, Typography } from '@mui/material'
import { PassengerForm } from '@/components'
import { FormikHelpers, FormikProps } from 'formik'
import { PassengerData } from '@/types'

type PassengerInfoProps = {
  onSubmit: (values: PassengerData, actions: FormikHelpers<PassengerData>) => void
  formRef: (el: FormikProps<PassengerData> | null) => void
  passengerNumber: number
  isPayer: boolean
  onPayerChange: (isPayer: boolean) => void
  initialValues: PassengerData
}

export const PassengersInfo = ({
  formRef,
  onSubmit,
  passengerNumber,
  isPayer,
  onPayerChange,
  initialValues,
}: PassengerInfoProps) => {
  return (
    <Paper sx={{ pb: 4, mb: 2 }}>
      <Box pt={3} pb={2} pl={4} width="100%" borderBottom="1px solid" borderColor="grey.400">
        <Typography variant="titleLg">Passager {passengerNumber}</Typography>
      </Box>
      <Box px={4} pt={2}>
        <PassengerForm
          onSubmit={onSubmit}
          formRef={formRef}
          isPayer={isPayer}
          onPayerChange={onPayerChange}
          initialValues={initialValues}
        />
      </Box>
    </Paper>
  )
}
