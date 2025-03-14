'use client'

import React from 'react'
import * as Yup from 'yup'
import { Box, Button, Stack } from '@mui/material'
import { Form, Formik, FormikHelpers } from 'formik'
import { OneWayFlightSearchParams, SearchFlightSegmentType } from '@/types'
import {
  DatePicker,
  CustomTextField,
  PassengersField,
  DepartureAndDestinationField,
} from '@/components'
// Importer MagicAssistantButton et son type
import MagicAssistantButton from './MagicAssistant/MagicAssistantButton'
import dayjs from 'dayjs'
import { useSearchDataCache } from '@/contexts'
import { usePathname } from 'next/navigation'

const DEFAULT_VALUES: OneWayFlightSearchParams = {
  adults: 1,
  childrens: 0,
  infants: 0,
  from: '',
  fromLabel: '',
  fromCountry: '',
  fromCountryCode: '',
  fromType: SearchFlightSegmentType.PLACE,
  fromInputValue: '',
  to: '',
  toLabel: '',
  toCountry: '',
  toCountryCode: '',
  toInputValue: '',
  toType: SearchFlightSegmentType.PLACE,
  departure: dayjs().add(3, 'day').format('YYYY-MM-DD'),
  _type: 'oneWay',
}

const searchParamsSchema = Yup.object().shape({
  adults: Yup.number().min(1).required('Requise'),
  childrens: Yup.number().min(0).required('Requise'),
  infants: Yup.number().min(0).required('Requise'),
  from: Yup.string()
    .nullable()
    .test('from-validation', function (value) {
      const hasInput = Boolean(this.parent.fromInputValue) // Check if user has typed something
      const userClickedLocation = Boolean(this.parent.fromLabel)
      if (!userClickedLocation && hasInput) {
        return this.createError({
          message: 'Veuillez sélectionner une ville de départ dans la liste proposée',
        })
      }
      if (!value) {
        return this.createError({
          message: 'Requise',
        })
      }
      return true
    }),
  to: Yup.string()
    .nullable()
    .test('to-validation', function (value) {
      const hasInput = Boolean(this.parent.toInputValue) // Check if user has typed something
      const userClickedLocation = Boolean(this.parent.toLabel)
      if (!userClickedLocation && hasInput) {
        return this.createError({
          message: 'Veuillez sélectionner une ville de destination dans la liste proposée',
        })
      }
      if (!value) {
        return this.createError({
          message: 'Requise',
        })
      }
      return true
    }),
  fromLabel: Yup.string(),
  fromCountry: Yup.string(),
  toLabel: Yup.string(),
  toCountry: Yup.string(),
  departure: Yup.date().typeError('Date invalide').required('Requise'),
})

type SearchOneWayFlightsFormProps = {
  onSubmit: (
    values: OneWayFlightSearchParams,
    actions: FormikHelpers<OneWayFlightSearchParams>,
  ) => void
  initialValues?: OneWayFlightSearchParams
  disabled?: boolean
}

export const SearchOneWayFlightsForm = ({
  onSubmit,
  initialValues,
  disabled,
}: SearchOneWayFlightsFormProps) => {
  // Référence à l'instance Formik
  const formikRef = React.useRef<any>(null);
  // Récupérer le chemin actuel pour déterminer si on est sur la page de recherche
  const pathname = usePathname();
  const isSearchPage = pathname === '/search';

  // Fonction pour soumettre le formulaire avec des paramètres du chatbot
  const handleChatbotSearch = (params: any) => {
    if (formikRef.current) {
      // Vérifier que le type de paramètres est correct
      if (params._type !== 'oneWay') {
        // Convertir les paramètres si nécessaire
        // Nous ignorons simplement la propriété "return" pour un vol aller simple
        params = {
          ...params,
          _type: 'oneWay'
        };
        // Supprimer la propriété return si elle existe
        delete params.return;
      }
      
      // Mettre à jour les valeurs du formulaire
      const formik = formikRef.current;
      
      // Mise à jour des champs avec les valeurs extraites du chatbot
      for (const [key, value] of Object.entries(params)) {
        formik.setFieldValue(key, value, false);
      }
      
      // Soumettre le formulaire après avoir mis à jour les valeurs
      setTimeout(() => {
        formik.submitForm();
      }, 100);
    }
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues || DEFAULT_VALUES}
      validationSchema={searchParamsSchema}
      onSubmit={onSubmit}
      enableReinitialize>
      {({ values, setFieldValue, touched, errors }) => {
        useSearchDataCache(setFieldValue)
        return (
          <Form data-testid="searchOneWayFlightsForm">
            <Stack direction="row" width="100%" gap={1}>
              <Stack gap={1} direction="row" flexGrow={1}>
                <Stack width="50%" gap={1} direction="row">
                  <DepartureAndDestinationField sx={{ width: '100%' }} />
                </Stack>
                <Box width="25%">
                  <DatePicker
                    sx={{ width: '100%' }}
                    slots={{ textField: CustomTextField }}
                    data-testid="departureField"
                    label="Date"
                    value={dayjs(values.departure)}
                    slotProps={{
                      textField: { helperText: touched.departure && errors.departure },
                      popper: {
                        modifiers: [{ name: 'offset', options: { offset: [0, 10] } }],
                      },
                    }}
                    minDate={dayjs().add(3, 'day')}
                    onChange={(value) => {
                      setFieldValue('departure', value?.format('YYYY-MM-DD'), true)
                    }}
                  />
                </Box>
                <Box width="25%">
                  <PassengersField sx={{ width: '100%' }} />
                </Box>
              </Stack>
              <Button
                type="submit"
                variant="contained"
                size="large"
                data-testid="searchButton"
                disabled={disabled}>
                Rechercher
              </Button>
            </Stack>
            {/* N'afficher le MagicAssistantButton que si on n'est pas sur la page de recherche */}
            {!isSearchPage && <MagicAssistantButton onSearch={handleChatbotSearch} />}
          </Form>
        )
      }}
    </Formik>
  )
}