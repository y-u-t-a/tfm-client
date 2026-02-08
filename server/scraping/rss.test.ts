import { expect, test } from 'bun:test'
import { getEpisodes } from './rss'

test('エピソード一覧が取得できること', async () => {
  const { title, episodes } = await getEpisodes('hitoiki')
  expect(title).toBeTruthy()
  expect(episodes.length).toBeGreaterThan(0)
  for (const value of Object.values(episodes[0])) {
    expect(value).not.toBeFalsy()
  }
  expect(typeof episodes[0].durationSeconds).toBe('number')
  expect(episodes[0].durationSeconds).toBeGreaterThan(0)
}, { timeout: 10000 })
