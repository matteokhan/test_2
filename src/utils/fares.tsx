import { Fare, FareService, LCCAncillary, Solution } from '@/types'
import CheckIcon from '@mui/icons-material/Check'
import PaymentsIcon from '@mui/icons-material/Payments'
import CloseIcon from '@mui/icons-material/Close'
import { FlightClass } from '@mui/icons-material'

export const getFareDataFromSolution = (solution: Solution): Fare => {
  const brand = solution.routes[0].segments[0].fare
  const services: FareService[] = brand.options
    .filter((option) => option.indicator !== 'Unknown' && option.description !== 'VOID')
    .map((option) => {
      switch (option.description) {
        case 'CHANGES':
          switch (option.indicator) {
            case 'IncludedInBrand':
              return {
                name: 'Modifiable avec frais',
                icon: <PaymentsIcon />,
                isIncluded: true,
              }
            case 'NotOffered':
              return {
                name: 'Pas de modification possible',
                icon: <CloseIcon color="error" />,
                isIncluded: false,
              }
            case 'AvailableForACharge':
              return { name: 'Modifiable avec frais', icon: <PaymentsIcon />, isIncluded: false }
          }
        case 'REFUND':
          switch (option.indicator) {
            case 'IncludedInBrand':
              return {
                name: 'Remboursable avec frais',
                icon: <PaymentsIcon />,
                isIncluded: true,
              }
            case 'NotOffered':
              return {
                name: 'Pas de remboursement possible',
                icon: <CloseIcon color="error" />,
                isIncluded: false,
              }
            case 'AvailableForACharge':
              return { name: 'Remboursable avec frais', icon: <PaymentsIcon />, isIncluded: false }
          }
        case 'BAGGAGE_CHECKED':
          switch (option.indicator) {
            case 'IncludedInBrand':
              if (brand.baggagePieces) {
                let name = `${brand.baggagePieces} bagage(s) enregistré(s) inclus`
                if (brand.baggageWeight) {
                  name = name + ` (${brand.baggageWeight} kg)`
                }
                return {
                  name: name,
                  icon: <CheckIcon color="primary" />,
                  isIncluded: true,
                }
              } else {
                return {
                  name: 'Tarif sans bagage',
                  icon: <PaymentsIcon />,
                  isIncluded: false,
                }
              }
            case 'NotOffered':
              return {
                name: 'Pas de bagage enregistré inclus',
                icon: <CloseIcon color="error" />,
                isIncluded: false,
              }
            case 'AvailableForACharge':
              return { name: 'Tarif sans bagage', icon: <PaymentsIcon />, isIncluded: false }
          }
      }
      return { name: option.description, icon: <CloseIcon color="error" />, isIncluded: false }
    })
  let bestCabinClass = 1
  solution.routes.forEach((route) => {
    route.segments.forEach((segment) => {
      if (segment.cabinClass > bestCabinClass) {
        bestCabinClass = segment.cabinClass
      }
    })
  })
  switch (bestCabinClass) {
    case 1:
      services.push({
        name: 'Voyage en classe Economique',
        icon: <FlightClass />,
        isIncluded: true,
      })
      break
    case 2:
      services.push({ name: 'Voyage en classe Affaires', icon: <FlightClass />, isIncluded: true })
      break
    case 4:
      services.push({ name: 'Voyage en Première classe', icon: <FlightClass />, isIncluded: true })
      break
    case 8:
      services.push({ name: 'Voyage en classe Premium', icon: <FlightClass />, isIncluded: true })
      break
  }
  return {
    id: solution.id,
    name: brand.name,
    description:
      'Nous gérons votre enregistrement et l’envoi des cartes d’embarquement par e-mail est automatique',
    price: Number(solution.priceInfo.total),
    services: services,
  }
}

export const getFareDataFromLccAncillaries = (ancillaries: LCCAncillary[]): Fare => {
  const services: FareService[] = []
  ancillaries
    .filter((ancillary) => Number(ancillary.price) === 0)
    .forEach((ancillary) => {
      switch (ancillary.code) {
        case 'BaggageFee':
          services.push({
            name: `${ancillary.baggagePieces} bagage(s) enregistré(s) (${ancillary.baggageWeight} kg)`,
            icon: <CheckIcon color="primary" />,
            isIncluded: true,
          })
          break
      }
    })
  return {
    id: 'lcc',
    name: 'Bagage enregistré',
    description: 'Bagage enregistré',
    price: Number(0.0),
    services: services,
  }
}
