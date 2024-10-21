import { PassengerType } from '@/types'
import dayjs, { Dayjs } from 'dayjs'

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
