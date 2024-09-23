// Here we put utils to convert data to DTOs

import {
  CorrelationId,
  PassengerData,
  PayerData,
  SearchFlightsParams,
  SearchFlightsParamsDto,
  Solution,
  CreateReservationDto,
  ReservationClientDto,
  ReservationPassengerDto,
  BrandedFareRequestDto,
} from '@/types'
import { getAgencyCodeForRequest } from '@/utils'

export const searchParamsToDto = (
  params: SearchFlightsParams | undefined,
): SearchFlightsParamsDto | undefined => {
  if (!params) return undefined

  const searchParamsDto: SearchFlightsParamsDto = {
    adults: params?.adults || 0,
    childrens: params?.childrens || 0,
    infants: params?.infants || 0,
    segments: [],
    agencyCode: getAgencyCodeForRequest(),
  }
  if (params._type === 'oneWay') {
    searchParamsDto.segments.push({
      from: params.from,
      to: params.to,
      date: params.departure,
    })
    return searchParamsDto
  }
  if (params._type === 'roundTrip') {
    searchParamsDto.segments.push({
      from: params.from,
      to: params.to,
      date: params.departure,
    })
    searchParamsDto.segments.push({
      from: params.to,
      to: params.from,
      date: params.return,
    })
    return searchParamsDto
  }
  if (params._type === 'multiDestinations') {
    searchParamsDto.segments = params.destinations.map((destination) => ({
      from: destination.from,
      to: destination.to,
      date: destination.departure,
    }))
    return searchParamsDto
  }
  const allCasesHandled: never = params
  return allCasesHandled
}

export const getCreateReservationDto = ({
  correlationId,
  flight,
}: {
  correlationId: CorrelationId
  flight: Solution
}): CreateReservationDto => {
  const dto = {
    ticket: {
      correlation_id: correlationId,
      data_object: flight.ticket,
      verification_price: flight.priceInfo.total,
      routes: [
        {
          solution_id: flight.id,
          route_ids: flight.routes.map((route) => route.id),
        },
      ],
      trip_end_date: flight.routes.slice(-1)[0].segments.slice(-1)[0].arrivalDateTime,
    },
  }
  return dto
}

export const getReservationClientDto = ({ payer }: { payer: PayerData }): ReservationClientDto => {
  const dto = {
    title: payer.salutation ? payer.salutation : '',
    first_name: payer.firstName,
    last_name: payer.lastName,
    birth_date: payer.dateOfBirth ? payer.dateOfBirth.format('YYYY-MM-DD') : '',
    email: payer.email,
    phone: payer.phoneNumber,
    phone_country_prefix: '0033',
    address: payer.address,
    postal_code: payer.postalCode,
    city: payer.city,
    country: payer.country,
    create_account: payer.createAccountOptIn,
    subscribe_to_newsletter: payer.subscribeNewsletterOptIn,
  }
  return dto
}

export const getReservationPassengerDto = ({
  passenger,
}: {
  passenger: PassengerData
}): ReservationPassengerDto => {
  const dto = {
    category: passenger.type,
    title: passenger.salutation ? passenger.salutation : '',
    first_name: passenger.firstName,
    last_name: passenger.lastName,
    birth_date: passenger.dateOfBirth ? passenger.dateOfBirth.format('YYYY-MM-DD') : '',
    email: passenger.email,
    phone: passenger.phoneNumber,
  }
  return dto
}

export const getSearchBrandedFaresDto = ({
  correlationId,
  solution,
  passengers,
}: {
  correlationId: CorrelationId
  solution: Solution
  passengers: PassengerData[]
}): BrandedFareRequestDto => {
  return {
    correlationId,
    ticket: solution.ticket,
    adults: passengers.filter((passenger) => passenger.type === 'ADT').length,
    childrens: passengers.filter((passenger) => passenger.type === 'CHD').length,
    infants: passengers.filter((passenger) => passenger.type === 'INF').length,
  }
}
