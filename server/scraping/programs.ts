import type { Program } from '~~/shared/model/program'

/**
 * ポッドキャストトップの HTML に埋め込まれている番組データ
 * TFM 側の検索も同じ JSON をブラウザ内でフィルタしているだけなので、
 * ブラウザを起動せず HTML を取得して自前でフィルタする
 */
interface EntryItem {
  title: string
  url: string
  image: string
  date: string
  category: string
  keyword: string
}

const PODCAST_URL = 'https://www.tfm.co.jp/podcast/'
const CACHE_TTL = 10 * 60 * 1000

let cache: { items: EntryItem[], fetchedAt: number } | null = null

async function fetchEntryData(): Promise<EntryItem[]> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL) {
    return cache.items
  }

  const res = await fetch(PODCAST_URL)
  if (!res.ok) {
    throw new Error('Failed to fetch podcast list')
  }
  const html = await res.text()

  // HTML 内の番組データを抽出
  const json = html.match(/const\s+entryData\s*=\s*JSON\.parse\(`([\s\S]*?)`\)/)?.[1]
  if (!json) {
    throw new Error(`entryData not found in ${PODCAST_URL}. TFM 側のページ構造が変わった可能性があります`)
  }

  const items: EntryItem[] = JSON.parse(json)
  cache = { items, fetchedAt: Date.now() }
  return items
}

export async function searchPrograms(keyword: string): Promise<Program[]> {
  const items = await fetchEntryData()
  const query = keyword.trim().toLowerCase()

  return items
    .filter((item) => {
      const titleMatch = item.title?.toLowerCase().includes(query)
      // キーワードはカンマ区切りで格納されている
      const keywords = item.keyword?.split(',').map(k => k.trim().toLowerCase()) ?? []
      return titleMatch || keywords.some(k => k.includes(query))
    })
    .sort((a, b) => a.title.localeCompare(b.title, 'ja', { sensitivity: 'base' }))
    .map(item => ({
      id: item.url,
      title: item.title,
      href: `https://www.tfm.co.jp/podcast/${item.url}`,
      // 画像 URL にはクエリパラメータが付いていることがある
      img: item.image.split('?')[0] ?? '',
    }))
}
