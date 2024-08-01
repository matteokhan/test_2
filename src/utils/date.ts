// Trasform duration 02:57:00 to 2h57 or 2h57mn if addMinutesSuffix is true
export const transformDuration = (duration?: string, addMinutesSuffix: boolean = false): string => {
  if (!duration) return ''
  const [hours, minutes] = duration.split(':').map(Number)
  const formattedDuration = `${hours}h${minutes.toString().padStart(2, '0')}`
  return addMinutesSuffix ? `${formattedDuration}mn` : formattedDuration
}
