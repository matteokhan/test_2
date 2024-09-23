import { PassengerType } from '@/types'
import dayjs, { Dayjs } from 'dayjs'

export const getPassengerTypeDescription = (passengerType: PassengerType) => {
  if (passengerType == 'ADT') return 'Adulte'
  if (passengerType == 'CHD') return 'Enfant'
  if (passengerType == 'INF') return 'Bébé'
  const allCasesHandled: never = passengerType
  return allCasesHandled
}

export const passengerIsAbove16 = (dateOfBirth: Dayjs) => {
  return dayjs().diff(dateOfBirth, 'year') >= 16
}
