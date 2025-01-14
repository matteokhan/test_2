'use client'

import { useEffect } from 'react'
import { useFlights } from '@/contexts'
import { SearchFlightSegmentType } from '@/types'

export const useSearchDataCache = (
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
) => {
  const { destinationCache, departureCache } = useFlights()

  useEffect(() => {
    if (destinationCache) {
      setFieldValue('to', destinationCache.code)
      setFieldValue('toLabel', destinationCache.name + ' (' + destinationCache.code + ')')
      setFieldValue('toCountry', destinationCache.country_name)
      setFieldValue('toCountryCode', destinationCache.country_code)
      setFieldValue(
        'toType',
        destinationCache.category === 'City'
          ? SearchFlightSegmentType.CITY
          : SearchFlightSegmentType.PLACE,
      )
    }
    if (departureCache) {
      setFieldValue('from', departureCache.code)
      setFieldValue('fromLabel', departureCache.name + ' (' + departureCache.code + ')')
      setFieldValue('fromCountry', departureCache.country_name)
      setFieldValue('fromCountryCode', departureCache.country_code)
      setFieldValue(
        'fromType',
        departureCache.category === 'City'
          ? SearchFlightSegmentType.CITY
          : SearchFlightSegmentType.PLACE,
      )
    }
  }, [setFieldValue, destinationCache, departureCache])
}
