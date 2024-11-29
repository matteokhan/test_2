import { AncillariesQueryResult, Ancillary, LCCAncillary, Solution } from '@/types'

export const getLccAncillaryRouteCoverage = (ancillaryService: LCCAncillary) => {
  switch (ancillaryService.legIndex) {
    case 0:
      return 'Tous les trajets'
    case 1:
      return 'Aller uniquement'
    default:
      return 'Retour uniquement'
  }
}

export const getLccAncillaryDescription = (ancillaryService: LCCAncillary) => {
  return `${ancillaryService.baggagePieces} bagage(s) pour un total de ${ancillaryService.baggageWeight}kg maximum`
}

export const getAncillaryServices = (
  ancillary: Ancillary,
  ancillariesResponse: AncillariesQueryResult,
  selectedFare: Solution,
) => {
  const routeBySegment = selectedFare.routes.reduce(
    (acc, route, index) => {
      route.segments.forEach((segment) => {
        acc[`${segment.departure}${segment.arrival}`] = index
      })
      return acc
    },
    {} as Record<string, number>,
  )

  const outboundSegments = ancillary.segments.filter((segment) => {
    const segmentData = ancillariesResponse.segments.find((s) => s.id === segment.segment)
    if (!segmentData) return false
    const routeIndex =
      routeBySegment[`${segmentData.departure.iata}${segmentData.destination.iata}`]
    return routeIndex === 0
  })
  const totalOutboundSegments = ancillariesResponse.segments.filter((segment) => {
    const routeIndex = routeBySegment[`${segment.departure.iata}${segment.destination.iata}`]
    return routeIndex === 0
  })

  const inboundSegments = ancillary.segments.filter((segment) => {
    const segmentData = ancillariesResponse.segments.find((s) => s.id === segment.segment)
    if (!segmentData) return false
    const routeIndex =
      routeBySegment[`${segmentData.departure.iata}${segmentData.destination.iata}`]
    return routeIndex === 1
  })
  const totalInboundSegments = ancillariesResponse.segments.filter((segment) => {
    const routeIndex = routeBySegment[`${segment.departure.iata}${segment.destination.iata}`]
    return routeIndex === 1
  })

  const outboundSegmentsByService = outboundSegments.reduce(
    (acc, segment) => {
      segment.ancillaries.forEach((service) => {
        if (!acc[`${service.code}${service.name}`]) {
          acc[`${service.code}${service.name}`] = []
        }
        acc[`${service.code}${service.name}`].push(segment.segment)
      })
      return acc
    },
    {} as Record<string, string[]>,
  )
  const inboundSegmentsByService = inboundSegments.reduce(
    (acc, segment) => {
      segment.ancillaries.forEach((service) => {
        if (!acc[`${service.code}${service.name}`]) {
          acc[`${service.code}${service.name}`] = []
        }
        acc[`${service.code}${service.name}`].push(segment.segment)
      })
      return acc
    },
    {} as Record<string, string[]>,
  )

  return [
    outboundSegments
      .flatMap((segment) => segment.ancillaries)
      .filter((service) => {
        const routes = outboundSegmentsByService[`${service.code}${service.name}`]
        if (!routes) return false
        return routes.length === totalOutboundSegments.length
      })
      .filter(
        (service, index, self) =>
          index === self.findIndex((t) => t.code === service.code && t.name === service.name),
      ),
    inboundSegments
      .flatMap((segment) => segment.ancillaries)
      .filter((service) => {
        const routes = inboundSegmentsByService[`${service.code}${service.name}`]
        if (!routes) return false
        return routes.length === totalInboundSegments.length
      })
      .filter(
        (service, index, self) =>
          index === self.findIndex((t) => t.code === service.code && t.name === service.name),
      ),
  ]
}
