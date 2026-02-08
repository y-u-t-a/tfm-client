import { expect, test } from 'bun:test'
import { getEpisodes } from './rss'

test('エピソード一覧が取得できること', async () => {
  const result = await getEpisodes('hitoiki')
  expect(result.length).toBeGreaterThan(0)
  for (const value of Object.values(result[0])) {
    expect(value).not.toBeFalsy()
  }
  expect(typeof result[0].durationSeconds).toBe('number')
  expect(result[0].durationSeconds).toBeGreaterThan(0)
}, { timeout: 10000 })
