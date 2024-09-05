// Here we put utils to convert data to DTOs

import {
  CorrelationId,
  ReservationDto,
  PassengerData,
  PayerData,
  SearchFlightsParams,
  SearchFlightsParamsDto,
  Solution,
  CreateReservationDto,
  ReservationClientDto,
} from '@/types'

export const searchParamsToDto = (
  params: SearchFlightsParams | undefined,
): SearchFlightsParamsDto | undefined => {
  if (!params) return undefined

  const searchParamsDto: SearchFlightsParamsDto = {
    adults: params?.adults || 0,
    childrens: params?.childrens || 0,
    infant: params?.infant || 0,
    segments: [],
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
      routes: flight.routes.map((route) => ({
        solution_id: flight.id,
        route_ids: [route.id],
      })),
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
    subscribe_to_newsletter: false, // TODO: add this field to the form
  }
  return dto
}
