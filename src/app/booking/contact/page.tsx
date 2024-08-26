'use client'

import React, { useEffect, useRef, useState } from 'react'
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
import { getArroundAgency, useSearchAgencies } from '@/services'
import { SelectedAgency } from '@/components/Booking/SelectedAgency'

export default function ContactInfoPage() {
  // TODO: search agencies by nearest position
  const { data: agencies } = useSearchAgencies({})
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
    setCreateReservation,
    reservationId,
    agency,
    setAgency,
  } = useBooking()

  const [userLocation, setUserLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)

  const [arroundAgencies, setArroundAgencies] = useState([])

  const handleSubmit = async () => {
    if (formRef.current) {
      const errors = await formRef.current.validateForm()
      if (Object.keys(errors).length === 0) {
        formRef.current.handleSubmit()
      } else {
        formRef.current.setTouched(
          Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
        )
      }
    } else {
      // TODO: log this somewhere
    }
  }

  useEffect(() => {
    if (selectedFlight && payer && !reservationId) {
      setCreateReservation()
    }
    if (!userLocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      })
    }
    if (userLocation && !arroundAgencies.length) {
      fetchArroundAgencies()
    }
  })

  const fetchArroundAgencies = async () => {
    if (userLocation) {
      const response = await getArroundAgency({
        lat: userLocation.latitude,
        lng: userLocation.longitude,
      })
      if (response && response.items) {
        setArroundAgencies(response.items)
      }
    }
  }

  const handlePayerSubmit = (values: PayerData) => {
    setPayer(values)
  }

  return (
    <>
      <SimpleContainer title="Coordonnées">
        <PayerForm
          formRef={formRef}
          onSubmit={handlePayerSubmit}
          initialValues={
            payerIndex !== null
              ? {
                  ...passengers[payerIndex],
                  email: '',
                  address: '',
                  postalCode: '',
                  city: '',
                  country: '',
                  createAccountOptIn: false,
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
            {arroundAgencies?.length > 0 && (
              <Box>
                <Typography variant="titleMd">Agences les plus proches de votre adresse</Typography>
                <SelectAgencyForm
                  agencies={arroundAgencies}
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
      <BookingStepActions onContinue={handleSubmit} onGoBack={goPreviousStep} />
    </>
  )
}
