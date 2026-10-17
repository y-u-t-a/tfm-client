import { fromAbsolute, getLocalTimeZone, parseDate, toCalendarDate } from '@internationalized/date'
import type { CalendarDate } from '@internationalized/date'

/** unixtime millis を、ブラウザのタイムゾーンでの日付に変換する */
export function toLocalDate(unixtimeMillis: number): CalendarDate {
  return toCalendarDate(fromAbsolute(unixtimeMillis, getLocalTimeZone()))
}

/** URL のクエリなどの YYYY-MM-DD 形式の文字列を日付に変換する。空文字や存在しない日付は undefined */
export function parseDateString(value: unknown): CalendarDate | undefined {
  if (typeof value !== 'string' || !value) return undefined
  try {
    return parseDate(value)
  } catch {
    return undefined
  }
}
