import { expect, test } from 'bun:test'
import { getEpisodes } from './episodes'

test('エピソード一覧が取得できること', async () => {
  const result = await getEpisodes('hitoiki')
  expect(result.length).toBeGreaterThan(0)
  for (const value of Object.values(result[0])) {
    expect(value).not.toBeFalsy()
  }
}, { timeout: 30000 })
