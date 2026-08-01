import { expect, test } from 'vitest'
import { getEpisodes, parseDuration } from './rss'

test('エピソード一覧が取得できること', async () => {
  const { title, episodes } = await getEpisodes('hitoiki')
  expect(title).toBeTruthy()
  expect(episodes.length).toBeGreaterThan(0)
  const episode = episodes[0]!
  for (const value of Object.values(episode)) {
    expect(value).not.toBeFalsy()
  }
  expect(typeof episode.durationSeconds).toBe('number')
  expect(episode.durationSeconds).toBeGreaterThan(0)
}, 10000)

test('itunes:duration を秒数に変換できること', () => {
  expect(parseDuration(2217)).toBe(2217)
  expect(parseDuration('2217')).toBe(2217)
  expect(parseDuration('23:45')).toBe(23 * 60 + 45)
  expect(parseDuration('01:23:45')).toBe(3600 + 23 * 60 + 45)
  expect(parseDuration('1:00:00')).toBe(3600)
})

test('解析できない itunes:duration は 0', () => {
  expect(parseDuration('')).toBe(0)
  expect(parseDuration('unknown')).toBe(0)
})
