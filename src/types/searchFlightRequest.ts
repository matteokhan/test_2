export type SearchFlightSegment = {
    from: string
    to: string
    date: Date
    dateReturn?: Date
  }
  
  export type SearchFlightParams = {
    adults: number
    childrens: number
    infant: number
    directFlight: boolean
    nonStopFlight: boolean
    segments: SearchFlightSegment[]
  }


export type SearchFlightSegmentDto = {
    from: string
    to: string
    date: string
    dateReturn?: string
  }
  
  export type SearchFlightParamsDto = {
    adults: number
    childrens: number
    infant: number
    // directFlight: boolean
    // nonStopFlight: boolean
    segments: SearchFlightSegmentDto[]
  }