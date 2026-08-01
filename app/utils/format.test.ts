import { expect, test } from 'vitest'
import { formatDuration } from './format'

test('1時間未満は MM:SS 形式', () => {
  expect(formatDuration(0)).toBe('00:00')
  expect(formatDuration(9)).toBe('00:09')
  expect(formatDuration(75)).toBe('01:15')
  expect(formatDuration(3599)).toBe('59:59')
})

test('1時間以上は H:MM:SS 形式', () => {
  expect(formatDuration(3600)).toBe('1:00:00')
  expect(formatDuration(3615)).toBe('1:00:15')
  expect(formatDuration(7325)).toBe('2:02:05')
})

test('小数の秒数は切り捨てる', () => {
  expect(formatDuration(90.9)).toBe('01:30')
})

test('長さが不明な場合はプレースホルダを返す', () => {
  expect(formatDuration(NaN)).toBe('--:--')
  expect(formatDuration(Infinity)).toBe('--:--')
  expect(formatDuration(-1)).toBe('--:--')
})
