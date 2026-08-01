import { afterEach, expect, test, vi } from 'vitest'
import { getEpisodes, parseDuration } from './rss'

afterEach(() => {
  vi.unstubAllGlobals()
})

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

test('エピソードが 1 件だけの番組でも取得できること（バグ再現）', async () => {
  stubFetch(buildRss(1))

  const { episodes } = await getEpisodes('single')
  expect(episodes).toHaveLength(1)
  expect(episodes[0]).toMatchObject({
    id: 'episode-1',
    title: 'エピソード1',
    audio: 'https://example.com/audio1.mp3',
  })
})

test('エピソードが 0 件の番組は空配列', async () => {
  stubFetch(buildRss(0))

  const { title, episodes } = await getEpisodes('empty')
  expect(title).toBe('テスト番組')
  expect(episodes).toEqual([])
})

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

/** item を指定件数だけ持つ RSS を組み立てる */
function buildRss(itemCount: number): string {
  const items = Array.from({ length: itemCount }, (_, i) => `
    <item>
      <title>エピソード${i + 1}</title>
      <description>説明${i + 1}</description>
      <pubDate>Thu, 25 Dec 2025 00:00:00 +0900</pubDate>
      <guid isPermaLink="false">episode-${i + 1}</guid>
      <itunes:duration>23:45</itunes:duration>
      <itunes:image href="https://example.com/thumb.jpg"/>
      <enclosure url="https://example.com/audio${i + 1}.mp3"/>
    </item>`).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>テスト番組</title>${items}
  </channel>
</rss>`
}

/** 番組ページと RSS の取得を差し替える */
function stubFetch(rss: string) {
  vi.stubGlobal('fetch', vi.fn(async (url: string) =>
    url.startsWith('https://www.tfm.co.jp/podcast/')
      ? new Response(`<script>const rssUrl = 'https://example.com/rss'</script>`)
      : new Response(rss),
  ))
}
