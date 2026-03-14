import { expect, test } from 'vite-plus/test'
import { getEpisodes } from './rss'

test('エピソード一覧が取得できること', { timeout: 10000 }, async () => {
  const { title, episodes } = await getEpisodes('hitoiki')
  expect(title).toBeTruthy()
  expect(episodes.length).toBeGreaterThan(0)
  const episode = episodes[0]!
  for (const value of Object.values(episode)) {
    expect(value).not.toBeFalsy()
  }
  expect(typeof episode.durationSeconds).toBe('number')
  expect(episode.durationSeconds).toBeGreaterThan(0)
})
