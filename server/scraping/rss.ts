import { XMLParser } from 'fast-xml-parser'
import type { Episode } from '~~/shared/model/episode'

/**
 * プロパティ名は RSS XML の要素名に対応
 * @_ プレフィックスは XML 属性を表す（attributeNamePrefix で設定）
 */
interface RssItem {
  'title': string
  'description': string
  'pubDate': string
  'guid': string
  'itunes:duration': number | string
  'itunes:image'?: { '@_href'?: string }
  'enclosure'?: { '@_url'?: string }
}

interface Response {
  title: string
  episodes: Episode[]
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
})

async function discoverRssUrl(programId: string): Promise<string> {
  // 番組ページの HTML を取得
  const res = await fetch(`https://www.tfm.co.jp/podcast/${programId}`)
  if (!res.ok) {
    throw new Error(`Program not found: ${programId}`)
  }
  const html = await res.text()

  // HTML 内の RSS URL を抽出
  const url = html.match(/const\s+rssUrl\s*=\s*'([^']+)'/)?.[1]
  if (!url) {
    throw new Error(`RSS URL not found for program: ${programId}`)
  }
  return url
}

export async function getEpisodes(programId: string): Promise<Response> {
  const rssUrl = await discoverRssUrl(programId)
  const res = await fetch(rssUrl)
  if (!res.ok) {
    throw new Error(`Failed to fetch RSS feed: ${rssUrl}`)
  }

  const xml = await res.text()
  const parsed = parser.parse(xml)

  const channel = parsed?.rss?.channel
  const title: string = channel?.title ?? ''
  const items: RssItem[] = channel?.item
  if (!items || !Array.isArray(items)) {
    return { title, episodes: [] }
  }

  const episodes = items.map(item => ({
    id: item.guid,
    title: item.title,
    description: item.description?.trim() ?? '',
    durationSeconds: parseDuration(item['itunes:duration']),
    publishedAt: new Date(item.pubDate).getTime(),
    audio: item.enclosure?.['@_url'] ?? '',
    thumbnail: item['itunes:image']?.['@_href'] ?? '',
  }))

  return { title, episodes }
}

/** itunes:duration を秒数に変換する。秒数(number)、HH:MM:SS、MM:SS 形式に対応 */
function parseDuration(value: number | string): number {
  if (typeof value === 'number') return value
  const parts = value.split(':').map(Number)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return Number(value) || 0
}
