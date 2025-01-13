// Here we put utils to convert data to DTOs

import {
  PassengerData,
  PayerData,
  SearchFlightsParams,
  SearchFlightsParamsDto,
  CreateOrderDto,
  OrderClientDto,
  OrderPassengerDto,
  BrandedFareRequestDto,
  AgencyId,
  SolutionId,
} from '@/types'

export const searchParamsToDto = (
  params: SearchFlightsParams | undefined,
): SearchFlightsParamsDto | undefined => {
  if (!params) return undefined

  const searchParamsDto: SearchFlightsParamsDto = {
    search_data: {
      adults: params?.adults || 0,
      childrens: params?.childrens || 0,
      infants: params?.infants || 0,
      segments: [],
    },
  }
  if (params._type === 'oneWay') {
    searchParamsDto.search_data.segments.push({
      from: params.from,
      to: params.to,
      date: params.departure,
      fromType: params.fromType,
      toType: params.toType,
    })
    return searchParamsDto
  }
  if (params._type === 'roundTrip') {
    searchParamsDto.search_data.segments.push({
      from: params.from,
      to: params.to,
      date: params.departure,
      fromType: params.fromType,
      toType: params.toType,
    })
    searchParamsDto.search_data.segments.push({
      from: params.to,
      to: params.from,
      date: params.return,
      fromType: params.toType,
      toType: params.fromType,
    })
    return searchParamsDto
  }
  if (params._type === 'multiDestinations') {
    searchParamsDto.search_data.segments = params.destinations.map((destination) => ({
      from: destination.from,
      to: destination.to,
      date: destination.departure,
      fromType: destination.fromType,
      toType: destination.toType,
    }))
    return searchParamsDto
  }
  const allCasesHandled: never = params
  return allCasesHandled
}

export const getCreateOrderDto = ({ agencyId }: { agencyId: AgencyId }): CreateOrderDto => {
  const dto = { agency: agencyId }
  return dto
}

export const getOrderClientDto = ({ payer }: { payer: PayerData }): OrderClientDto => {
  const dto = {
    title: payer.salutation ? payer.salutation : '',
    first_name: payer.firstName,
    last_name: payer.lastName,
    birth_date: payer.dateOfBirth ? payer.dateOfBirth.format('YYYY-MM-DD') : '',
    email: payer.email,
    phone: payer.phoneNumber.replace(/\s/g, ''),
    phone_country_prefix: payer.phoneCode.replace(/\s/g, ''),
    address: payer.address,
    postal_code: payer.postalCode,
    city: payer.city,
    country: payer.country,
    create_account: payer.createAccountOptIn,
    subscribe_to_newsletter: payer.subscribeNewsletterOptIn,
  }
  return dto
}

export const getOrderPassengerDto = ({
  passenger,
}: {
  passenger: PassengerData
}): OrderPassengerDto => {
  const dto = {
    category: passenger.type,
    title: passenger.salutation ? passenger.salutation : '',
    first_name: passenger.firstName,
    last_name: passenger.lastName,
    birth_date: passenger.dateOfBirth ? passenger.dateOfBirth.format('YYYY-MM-DD') : '',
    email: passenger.email,
    phone:
      passenger.type == 'ADT'
        ? `${passenger.phoneCode}${passenger.phoneNumber}`.replace(/\s/g, '')
        : '',
    ancillaries: passenger.ancillaries,
  }
  return dto
}

export const getSearchBrandedFaresDto = ({
  solutionId,
}: {
  solutionId: SolutionId
}): BrandedFareRequestDto => {
  return {
    solution_id: solutionId,
  }
}
