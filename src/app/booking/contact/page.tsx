'use client'

import React, { useRef, useState } from 'react'
import {
  BookingStepActions,
  PayerForm,
  SelectAgencyMap,
  SimpleContainer,
  SelectAgency,
} from '@/components'
import { useBooking, useUserLocation } from '@/contexts'
import { Box, Button, Stack, Typography, Drawer } from '@mui/material'
import { FormikProps } from 'formik'
import { PayerData, ReservationDto } from '@/types'
import { useUpdateReservation, useNearAgencies } from '@/services'
import { getReservationClientDto } from '@/utils'

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
    payer,
    selectedAgency,
    setSelectedAgency,
    reservation,
    setReservation,
  } = useBooking()
  const [userLocation, setUserLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  // const { position: userLocation, canAccessPosition, askUserForPermission } = useUserLocation()
  // const { data: arroundAgencies } = useNearAgencies({ ...userLocation })
  const { data: arroundAgencies } = useNearAgencies({
    lat: userLocation?.latitude,
    lng: userLocation?.longitude,
  })
  const { mutate: updateReservation, isPending: isUpdatingReservation } = useUpdateReservation()

  // const handleGeoposition = () => {
  //   if (!canAccessPosition) {
  //     askUserForPermission()
  //   } else {
  //     // TODO: trigger request for agencies around user position
  //   }
  // }

  const handleSubmit = async () => {
    if (!formRef.current || !reservation) {
      // TODO: log this somewhere
      // TODO: Warn the user that something went wrong
      return
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

    const clientDto = getReservationClientDto({ payer: payerDataValidated })
    const newReservation: ReservationDto = {
      ...reservation,
      client: clientDto,
    }
    updateReservation(newReservation, {
      onSuccess: (data) => {
        setReservation(data)
        goNextStep()
      },
      onError: (error) => {
        // TODO: log this somewhere
        // TODO: Warn the user that something went wrong
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
            payerIndex !== null
              ? {
                  ...passengers[payerIndex],
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
        <Stack gap={2} pt={3} pb={1}>
          <Typography variant="bodyMd" color="grey.900" maxWidth="535px">
            Veuillez sélectionner une agence Leclerc Voyages qui suivra votre réservation sur
            internet. Vous n'aurez pas à vous déplacer
          </Typography>
          {selectedAgency ? (
            <>
              <Typography variant="titleMd">Agence sélectionnée</Typography>
              <SelectAgency
                isSelected
                agency={selectedAgency}
                onChange={() => setSelectedAgency(null)}
              />
            </>
          ) : (
            <Box>
              <Button
                data-testid="contactInfoPage-openMapSelectAgency"
                variant="outlined"
                sx={{ px: 3 }}
                onClick={() => setMapIsOpen(true)}>
                Sélectionner une agence
              </Button>
              {arroundAgencies && arroundAgencies?.length > 0 && (
                <>
                  <Typography variant="titleMd">
                    Agences les plus proches de votre adresse
                  </Typography>
                  {arroundAgencies
                    ?.slice(0, 3)
                    ?.map((agency) => (
                      <SelectAgency
                        agency={agency}
                        onSelect={({ agency }) => setSelectedAgency(agency)}
                      />
                    ))}
                </>
              )}
            </Box>
          )}
        </Stack>
      </SimpleContainer>
      <Drawer
        open={mapIsOpen}
        onClose={() => setMapIsOpen(false)}
        anchor="right"
        PaperProps={{
          sx: {
            borderRadius: 0,
          },
        }}>
        <SelectAgencyMap
          onClose={() => setMapIsOpen(false)}
          onSelectAgency={({ agency }) => {
            setSelectedAgency(agency)
            setMapIsOpen(false)
          }}
        />
      </Drawer>
      <BookingStepActions
        onContinue={handleSubmit}
        onGoBack={goPreviousStep}
        isLoading={isUpdatingReservation}
      />
    </>
  )
}
