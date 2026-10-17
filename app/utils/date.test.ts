import { resetLocalTimeZone, setLocalTimeZone } from '@internationalized/date'
import { afterEach, beforeEach, expect, test } from 'vitest'
import { parseDateString, toLocalDate } from './date'

beforeEach(() => {
  setLocalTimeZone('Asia/Tokyo')
})

afterEach(() => {
  resetLocalTimeZone()
})

test('ブラウザのタイムゾーンでの日付に変換する', () => {
  // 日本時間の 2025-08-01 00:30 は、UTC では前日の 15:30
  expect(toLocalDate(Date.parse('2025-07-31T15:30:00Z')).toString()).toBe('2025-08-01')
  expect(toLocalDate(Date.parse('2025-08-01T14:59:59Z')).toString()).toBe('2025-08-01')
  expect(toLocalDate(Date.parse('2025-08-01T15:00:00Z')).toString()).toBe('2025-08-02')
})

test('YYYY-MM-DD 形式の文字列を日付に変換する', () => {
  expect(parseDateString('2025-08-01')?.toString()).toBe('2025-08-01')
})

test('日付として解析できない値は undefined', () => {
  expect(parseDateString('')).toBeUndefined()
  expect(parseDateString(undefined)).toBeUndefined()
  // 形式違い
  expect(parseDateString('2025-8-1')).toBeUndefined()
  // 存在しない日付
  expect(parseDateString('2025-02-30')).toBeUndefined()
})
