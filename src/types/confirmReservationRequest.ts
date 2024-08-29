import { CorrelationId } from '@/types'

export type ReservationId = string

export type ConfirmReservationDto = {
  correlationId: CorrelationId
  reservationId: ReservationId
}
