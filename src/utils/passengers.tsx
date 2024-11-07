import { PassengerType } from '@/types'
import dayjs, { Dayjs } from 'dayjs'
import { getExampleNumber, validatePhoneNumberLength, parsePhoneNumber } from 'libphonenumber-js'
import examples from 'libphonenumber-js/examples.mobile.json'

export const getPassengerTypeDescription = (passengerType: PassengerType) => {
  if (passengerType == 'ADT') return 'Adulte'
  if (passengerType == 'CHD') return 'Enfant'
  if (passengerType == 'INF') return 'Bébé'
  const allCasesHandled: never = passengerType
  return allCasesHandled
}

export const ageIsAtLeast = (dateOfBirth: Dayjs, yearsOld: number) => {
  return dayjs().diff(dateOfBirth, 'year') >= yearsOld
}

export const getPassengerMaxBirthDate = ({
  type,
  flightDatetime,
}: {
  type: PassengerType
  flightDatetime: Dayjs
}) => {
  if (type === 'ADT') {
    return flightDatetime.subtract(12, 'year')
  }
  if (type === 'CHD') {
    return flightDatetime.subtract(2, 'year')
  }
  if (type === 'INF') {
    return dayjs()
  }
  const allCasesHandled: never = type
  return allCasesHandled
}

export const getPassengerMinBirthDate = ({
  type,
  flightDatetime,
}: {
  type: PassengerType
  flightDatetime: Dayjs
}) => {
  if (type === 'ADT') {
    return undefined
  }
  if (type === 'CHD') {
    return flightDatetime.subtract(12, 'year')
  }
  if (type === 'INF') {
    return flightDatetime.subtract(2, 'year')
  }
  const allCasesHandled: never = type
  return allCasesHandled
}

export const validatePhoneWithCountry = (
  phoneNumber: string,
  countryCode: string,
): { isValid: boolean; message?: string } => {
  if (!phoneNumber || !countryCode) return { isValid: false }

  try {
    const phoneNumberWithCountryCode = `+${countryCode}${phoneNumber}`
    const parsedNumber = parsePhoneNumber(phoneNumberWithCountryCode)

    if (!parsedNumber.country) {
      return {
        isValid: false,
        message: 'Le code pays est invalide.',
      }
    }

    const validationResult = validatePhoneNumberLength(phoneNumber, parsedNumber.country)
    let message = ''

    switch (validationResult) {
      case 'TOO_SHORT':
        message = 'Le numéro de téléphone est trop court.'
        break
      case 'TOO_LONG':
        message = 'Le numéro de téléphone est trop long.'
        break
      case 'INVALID_COUNTRY':
        message = 'Le code pays est invalide.'
        break
      case undefined:
        return { isValid: true }
    }

    // Add example number information if available
    const exampleNumber = getExampleNumber(parsedNumber.country, examples)
    if (exampleNumber) {
      message += ` Un numéro typique de +${countryCode} (${parsedNumber.country}) a ${exampleNumber.nationalNumber.length} chiffres.`
    }

    return { isValid: false, message }
  } catch (error) {
    return {
      isValid: false,
      message: "Le numéro de téléphone n'est pas valide",
    }
  }
}
