// Here we put utils to convert data to DTOs

import {
  CorrelationId,
  CreateReservationDto,
  PassengerData,
  PayerData,
  SearchFlightsParams,
  SearchFlightsParamsDto,
  Solution,
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
  selectedFlight,
  passengers,
  payer,
}: {
  correlationId: CorrelationId
  selectedFlight: Solution
  passengers: PassengerData[]
  payer: PayerData
}): CreateReservationDto => {
  const params = {
    correlationId: correlationId,
    ticket: selectedFlight?.ticket,
    routes: [
      {
        solutionId: selectedFlight?.id,
        routeIds: selectedFlight?.routes.map((route) => route.id),
      },
    ],
    passengers: passengers.map((passenger) => ({
      title: passenger.salutation || '',
      firstName: passenger.firstName,
      lastName: passenger.lastName,
      dateOfBirth: passenger.dateOfBirth ? passenger.dateOfBirth.format('YYYY-MM-DD') : '',
      type: passenger.type,
    })),
    booker: {
      firstName: payer?.firstName || '',
      lastName: payer?.lastName || '',
      email: payer?.email || '',
      phone: payer?.phoneNumber || '',
      phoneCountry: '0033',
      sex: payer?.salutation === 'Mr' ? 'M' : 'F' || '',
      address: {
        street: payer?.address || '',
        city: payer?.city || '',
        country: payer?.country || '',
        zipCode: payer?.postalCode || '',
        number: '1',
      },
    },
  }
  return params
}
