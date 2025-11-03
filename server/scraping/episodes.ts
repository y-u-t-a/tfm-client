import { Episode } from "~~/shared/model/episode"
import { withBrowser } from "../utils/browser"

export async function getEpisodes(program: string): Promise<Episode[]> {
  return withBrowser(async (page) => {
      await page.goto(`https://www.tfm.co.jp/podcast/${program}`)
      await page.waitForSelector(".p-episode_list article")

      return await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll(".p-episode_list article"))
        const episodes = elements.map(e => {
          // メタ情報
          const metaContent = e.querySelector(".p-episode_info")?.textContent ?? ""
          const [publishedAtRaw, length] = metaContent.split("|").map((s) => s.trim());
          const publishedAt = new Date(publishedAtRaw).getTime()
          const thumbnail = e.querySelector("img")?.src ?? ""

          // タイトル情報
          const titleContent = e.querySelector(".p-episode_ttl")?.textContent ?? ""
          const title = titleContent.trim()

          // 説明文
          const descriptionContent = e.querySelector(".p-episode_text")?.textContent ?? ""
          const description = descriptionContent.trim().replace(/\n\s+/g, "\n")

          // 音源
          const audioElement = e.querySelector("audio")
          const audio = audioElement?.src ?? ""
          const id = audio.split("/").at(-1)?.replace(/\.mp3.*/, "") ?? ""

          return {
            id,
            title,
            description,
            publishedAt,
            length,
            audio,
            thumbnail,
          }
        })

        return episodes
      })
  })
}
