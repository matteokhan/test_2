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

export const getMaxBirthDate = (type: PassengerType) => {
  if (type === 'ADT') {
    return dayjs().subtract(12, 'year')
  }
  if (type === 'CHD') {
    return dayjs().subtract(2, 'year')
  }
  if (type === 'INF') {
    return dayjs()
  }
  const allCasesHandled: never = type
  return allCasesHandled
}

export const getMinBirthDate = (type: PassengerType) => {
  if (type === 'ADT') {
    return undefined
  }
  if (type === 'CHD') {
    return dayjs().subtract(12, 'year')
  }
  if (type === 'INF') {
    return dayjs().subtract(2, 'year')
  }
  const allCasesHandled: never = type
  return allCasesHandled
}
