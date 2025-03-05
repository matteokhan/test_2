'use client'

import React from 'react'
import * as Yup from 'yup'
import { Box, Button, Stack } from '@mui/material'
import { DateRangePicker, SingleInputDateRangeField } from '@mui/x-date-pickers-pro'
import { Form, Formik, FormikHelpers } from 'formik'
import { RoundTripFlightSearchParams, SearchFlightSegmentType } from '@/types'
import { CustomTextField, DepartureAndDestinationField, PassengersField } from '@/components'
// Importer MagicAssistantButton
import MagicAssistantButton from './MagicAssistantButton';
import dayjs from 'dayjs'
import { useSearchDataCache } from '@/contexts'
import { usePathname } from 'next/navigation'

const DEFAULT_VALUES: RoundTripFlightSearchParams = {
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
  toType: SearchFlightSegmentType.PLACE,
  toInputValue: '',
  departure: dayjs().add(3, 'day').format('YYYY-MM-DD'),
  return: dayjs().add(4, 'day').format('YYYY-MM-DD'),
  _type: 'roundTrip',
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
  toLabel: Yup.string(),
  departure: Yup.date().typeError('Date invalide').required('Requise'),
  return: Yup.date()
    .typeError('Date invalide')
    .required('Requise')
    .min(Yup.ref('departure'), 'La date de retour doit être après la date de départ'),
})

type SearchRoundTripFlightsFormProps = {
  onSubmit: (
    values: RoundTripFlightSearchParams,
    actions: FormikHelpers<RoundTripFlightSearchParams>,
  ) => void
  initialValues?: RoundTripFlightSearchParams
  disabled?: boolean
}

export const SearchRoundTripFlightsForm = ({
  onSubmit,
  initialValues,
  disabled,
}: SearchRoundTripFlightsFormProps) => {
  // Référence à l'instance Formik
  const formikRef = React.useRef<any>(null);
  // Récupérer le chemin actuel pour déterminer si on est sur la page de recherche
  const pathname = usePathname();
  const isSearchPage = pathname === '/search';

  // Fonction pour soumettre le formulaire avec des paramètres du chatbot
  const handleChatbotSearch = (params: any) => {
    if (formikRef.current) {
      // Vérifier que le type de paramètres est correct
      if (params._type !== 'roundTrip') {
        // Convertir les paramètres si nécessaire
        // Pour un vol aller simple converti en aller-retour, ajouter une date de retour
        params = {
          ...params,
          _type: 'roundTrip',
          return: params.return || dayjs(params.departure).add(7, 'day').format('YYYY-MM-DD')
        };
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
          <Form data-testid="searchRoundTripFlightsForm">
            <Stack direction="row" width="100%" gap={1}>
              <Stack gap={1} direction="row" flexGrow={1}>
                <Stack width="50%" gap={1} direction="row">
                  <DepartureAndDestinationField sx={{ width: '100%' }} />
                </Stack>
                <Box width="25%">
                  <DateRangePicker
                    disableAutoMonthSwitching={true}
                    sx={{ width: '100%' }}
                    slots={{ field: SingleInputDateRangeField, textField: CustomTextField }}
                    data-testid="datesField"
                    label="Dates"
                    slotProps={{
                      textField: {
                        helperText:
                          (touched.departure && errors.departure) ||
                          (touched.return && errors.return),
                      },
                      popper: {
                        modifiers: [{ name: 'offset', options: { offset: [0, 10] } }],
                      },
                    }}
                    minDate={dayjs().add(3, 'day')}
                    value={[dayjs(values.departure), dayjs(values.return)]}
                    onChange={([departure, destination]) => {
                      setFieldValue(
                        'departure',
                        departure ? departure?.format('YYYY-MM-DD') : null,
                        true,
                      )
                      setFieldValue(
                        'return',
                        destination ? destination?.format('YYYY-MM-DD') : null,
                        true,
                      )
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