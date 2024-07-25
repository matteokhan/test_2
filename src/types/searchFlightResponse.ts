export type SearchResponseFilterData = {
    minPrice: number
    maxPrice: number
    allCarriers: string[]
    allCabinClasses: string[]
    allStops: number[]
  }
  
  export type SearchResponseDto = {
    correlationId: string
    solutions: Solution[]
    searchFilters: SearchResponseFilterData
  }
  
  export type Solution = {
    id: string
    routes: Route[]
    ticket: string
    priceInfo: PriceInfo
    adults: PassengerTypeInfo
    childrens: PassengerTypeInfo
    infants?: PassengerTypeInfo | null
    provider: string
    platingCarrier: string
  }
  
  export type Route = {
    id: string
    segments: RouteSegment[]
    travelTime: string
    nightsBeforeRoute?: number
    stopNumber: number
    carrier: string
    airportChange: boolean
    totalStopDuration?: string
    baggages?: number
  }
  
  type RouteSegment = {
    id: string
    departure: string
    departureCityCode: string
    departureDateTime: string
    arrival: string
    arrivalCityCode: string
    arrivalDateTime: string
    carrier: string
    flightNumber: string
    operatingCarrier: string
    operatingFlightNumber?: string | null
    duration: string
    cabinClass: number
    cabinClassName: string
    equipment: string
    timeBeforeSegment: number
  }
  
  type PriceInfo = {
    total: number
    tax: number
    currencyCode: string
    currencySymbol: string
    passengerNumber: number
  }
  
  type PassengerTypeInfo = {
    number: number
    type?: 'ADT' | 'CHD' | 'INF'
    tax: number
    pricePerPerson: number
    total: number
    currencyCode: string
    currencySymbol: string
  }