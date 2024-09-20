import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const calculateDaysBetween = (date1: Dayjs, date2: Dayjs) => {
  // This function calculates the number of days between two dates
  const utcDate1 = date1.utc().startOf('day')
  const utcDate2 = date2.utc().startOf('day')

  return utcDate2.diff(utcDate1, 'day')
}

// Trasform duration 02:57:00 to 2h57 or 2h57mn if addMinutesSuffix is true
export const transformDuration = (duration?: string, addMinutesSuffix: boolean = false): string => {
  if (!duration) return ''
  const [hours, minutes] = duration.split(':').map(Number)
  const formattedDuration = `${hours}h${minutes.toString().padStart(2, '0')}`
  return addMinutesSuffix ? `${formattedDuration}mn` : formattedDuration
}
