import { LocationData } from '@/types'

export const locationName = (location?: LocationData) => {
  if (!location) return ''
  return location.name
}

export const locationNameExtension = (location?: LocationData) => {
  if (!location) return ''
  if (!location.extension) return location.name
  return location.name + ' ' + location.extension
}

export const locationExtensionOrName = (location?: LocationData) => {
  if (!location) return ''
  return location.extension || location.name
}
