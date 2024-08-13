// Here we put utils to convert data to DTOs

import { SearchFlightsParams, SearchFlightsParamsDto } from '@/types'

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
