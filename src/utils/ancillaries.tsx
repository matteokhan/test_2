import { LCCAncillary } from '@/types'

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
  return `${ancillaryService.baggagePieces} baggage(s) pour ${ancillaryService.baggageWeight}kg maximum`
}
