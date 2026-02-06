import type { Episode } from '~~/shared/model/episode'
import { withBrowser } from '../utils/browser'

export async function getEpisodes(program: string): Promise<Episode[]> {
  return withBrowser(async (page) => {
    await page.goto(`https://www.tfm.co.jp/podcast/${program}`)
    await page.waitForSelector('.p-episode_list article')

    const articles = await page.$$('.p-episode_list article')
    const episodes: Episode[] = []
    for (const article of articles) {
      // メタ情報
      const metaContent = await article.$eval('.p-episode_info', el => el.textContent)
      const [publishedAtRaw, length] = metaContent.split('|').map(s => s.trim())
      const publishedAt = new Date(publishedAtRaw).getTime()
      const thumbnail = await article.$eval('img', img => img.src)

      // タイトル情報
      const titleContent = await article.$eval('.p-episode_ttl', el => el.textContent)
      const title = titleContent.trim()

      // 説明文
      const descriptionContent = await article.$eval('.p-episode_text', el => el.textContent)
      const description = descriptionContent.trim().replace(/\n\s+/g, '\n')

      // 音源
      const audio = await article.$eval('audio', el => el.src)
      const id = audio.split('/').at(-1)?.replace(/\.mp3.*/, '') ?? ''

      episodes.push({
        id,
        title,
        description,
        publishedAt,
        length,
        audio,
        thumbnail,
      })
    }

    return episodes
  })
}
