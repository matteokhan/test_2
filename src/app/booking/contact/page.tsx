'use client'

import React, { useRef } from 'react'
import {
  BookingStepActions,
  PayerForm,
  PurchaseDetails,
  SelectAgencyForm,
  SelectAgencyMap,
  SimpleContainer,
} from '@/components'
import { useBooking } from '@/contexts'
import { Box, Button, Stack, Typography, Drawer } from '@mui/material'
import { FormikProps } from 'formik'
import { PayerData } from '@/types'
import { useSearchAgencies } from '@/services'

export default function ContactInfoPage() {
  // TODO: search agencies by nearest position
  const { data: agencies } = useSearchAgencies({})
  const formRef = useRef<FormikProps<PayerData> | null>(null)
  const { goNextStep, setPayer, passengers, payerIndex, goPreviousStep } = useBooking()
  const [mapIsOpen, setMapIsOpen] = React.useState(false)

  const handleSubmit = async () => {
    if (formRef.current) {
      const errors = await formRef.current.validateForm()
      if (Object.keys(errors).length === 0) {
        formRef.current.handleSubmit()
        goNextStep()
      } else {
        formRef.current.setTouched(
          Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
        )
      }
    } else {
      // TODO: log this somewhere
    }
  }

  const handlePayerSubmit = (values: PayerData) => {
    setPayer(values)
  }

  return (
    <>
      <Typography variant="headlineMd" py={3}>
        Informations et création de votre dossier
      </Typography>
      {/* The overflow and height hack is to avoid double scrolling while mapIsOpen */}
      <Stack
        direction="row"
        gap={2}
        sx={{ overflow: mapIsOpen ? 'hidden' : 'auto', height: mapIsOpen ? '50vh' : 'auto' }}>
        <Box flexGrow="1">
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
            <Stack gap={2} py={3}>
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
              <Typography variant="titleMd">Agences les plus proches de votre adresse</Typography>
              {/* TODO: select agency */}
              <SelectAgencyForm
                agencies={agencies}
                onSelectAgency={({ agency }) => console.log(agency)}
              />
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
                  onSelectAgency={({ agency }) => console.log(agency)}
                />
              </Drawer>
            </Stack>
          </SimpleContainer>
          <BookingStepActions onContinue={handleSubmit} onGoBack={goPreviousStep} />
        </Box>
        <Box>
          <PurchaseDetails />
        </Box>
      </Stack>
    </>
  )
}
