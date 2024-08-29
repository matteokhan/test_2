'use client'

import React, { useRef, useState } from 'react'
import {
  BookingStepActions,
  PayerForm,
  SelectAgencyForm,
  SelectAgencyMap,
  SimpleContainer,
} from '@/components'
import { useBooking } from '@/contexts'
import { Box, Button, Stack, Typography, Drawer } from '@mui/material'
import { FormikProps } from 'formik'
import { PayerData } from '@/types'
import { useCreateReservation, useGetArroundAgencies } from '@/services'
import { SelectedAgency } from '@/components/Booking/SelectedAgency'
import { getCreateReservationDto } from '@/utils'

export default function ContactInfoPage() {
  const formRef = useRef<FormikProps<PayerData> | null>(null)
  const {
    goNextStep,
    setPayer,
    passengers,
    payerIndex,
    goPreviousStep,
    mapIsOpen,
    setMapIsOpen,
    selectedFlight,
    payer,
    setReservationId,
    agency,
    setAgency,
    correlationId,
  } = useBooking()
  const [userLocation, setUserLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const { data: arroundAgencies } = useGetArroundAgencies({
    lat: userLocation?.latitude,
    lng: userLocation?.longitude,
  })
  const { mutate: createReservation, isPending: isCreating } = useCreateReservation()

  const handleSubmit = async () => {
    if (formRef.current) {
      const errors = await formRef.current.validateForm()
      if (Object.keys(errors).length === 0) {
        const payerDataValidated = formRef.current.values
        setPayer(payerDataValidated)

        if (selectedFlight && correlationId) {
          const reservationParams = getCreateReservationDto({
            correlationId: correlationId,
            selectedFlight: selectedFlight,
            passengers,
            payer: payerDataValidated,
          })
          createReservation(reservationParams, {
            onSuccess: (data) => {
              setReservationId(data.ReservationId)
              goNextStep()
            },
            onError: (error) => {
              // TODO: log this somewhere
              // TODO: Warn the user that something went wrong
            },
          })
        } else {
          // TODO: log this somewhere
          // TODO: Warn the user that something went wrong
        }
      } else {
        formRef.current.setTouched(
          Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
        )
      }
    } else {
      // TODO: log this somewhere
      // TODO: Warn the user that something went wrong
    }
  }

  return (
    <>
      <SimpleContainer title="Coordonnées">
        <PayerForm
          formRef={formRef}
          onSubmit={() => {}}
          initialValues={
            payerIndex !== null
              ? {
                  ...passengers[payerIndex],
                  email: payer?.email || '',
                  address: payer?.address || '',
                  postalCode: payer?.postalCode || '',
                  city: payer?.city || '',
                  country: payer?.country || '',
                  createAccountOptIn: payer?.createAccountOptIn || false,
                }
              : undefined
          }
        />
      </SimpleContainer>
      <SimpleContainer title="Sélectionner votre agence Leclerc Voyages">
        {agency && (
          <Stack gap={2} py={3} data-testid="contactInfoPage-selectedAgency">
            <Typography pb={2} variant="bodyMd" color="grey.900" maxWidth="535px">
              Veuillez sélectionner une agence Leclerc Voyages qui suivra votre réservation sur
              internet. Vous n'aurez pas à vous déplacer
            </Typography>
            <Typography variant="titleMd">Agence sélectionnée</Typography>
            <SelectedAgency agency={agency} onChangeAgency={() => setAgency(null)}></SelectedAgency>
          </Stack>
        )}

        {!agency && (
          <Stack gap={2} py={3} data-testid="contactInfoPage-selectAgency">
            <Box pb={1}>
              <Typography pb={2} variant="bodyMd" color="grey.900" maxWidth="535px">
                Veuillez sélectionner une agence Leclerc Voyages qui suivra votre réservation sur
                internet. Vous n'aurez pas à vous déplacer
              </Typography>
              <Button
                data-testid="contactInfoPage-openMapSelectAgency"
                variant="outlined"
                sx={{ px: 3 }}
                onClick={() => setMapIsOpen(true)}>
                Sélectionner une agence
              </Button>
            </Box>
            {arroundAgencies && arroundAgencies?.items?.length > 0 && (
              <Box>
                <Typography variant="titleMd">Agences les plus proches de votre adresse</Typography>
                <SelectAgencyForm
                  agencies={arroundAgencies.items}
                  onSelectAgency={({ agency }) => {
                    setAgency(agency)
                  }}
                />
              </Box>
            )}

            <Drawer
              open={mapIsOpen}
              onClose={() => setMapIsOpen(false)}
              anchor="right"
              PaperProps={{
                sx: {
                  borderRadius: 0,
                },
              }}>
              {/* TODO: select agency */}
              <SelectAgencyMap
                onClose={() => setMapIsOpen(false)}
                onSelectAgency={({ agency }) => {
                  setAgency(agency)
                  setMapIsOpen(false)
                }}
              />
            </Drawer>
          </Stack>
        )}
      </SimpleContainer>
      <BookingStepActions
        onContinue={handleSubmit}
        onGoBack={goPreviousStep}
        isLoading={isCreating}
      />
    </>
  )
}
