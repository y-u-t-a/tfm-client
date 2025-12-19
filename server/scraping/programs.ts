import { Program } from "~~/shared/model/program"
import { withBrowser } from "../utils/browser"

export async function searchPrograms(keyword: string): Promise<Program[]> {
  return withBrowser(async (page) => {
    await page.goto("https://www.tfm.co.jp/podcast/")

    // 検索
    await page.locator(".p-search_box").fill(keyword)
    await page.keyboard.press("Enter")
    await page.waitForSelector("#programList")

    // 検索結果を取得
    const programElements = await page.$$("#programList > .p-podcast_item")
    const programs: Program[] = []
    for (const element of programElements) {
      const title = await element.$eval(".p-podcast_item_ttl", el => el.textContent.trim())
      const href = await element.$eval("a", el => el.href)
      const img = await element.$eval("img", el => el.src)
      const id = href.split("/").at(-1) ?? ""
      programs.push({ id, title, href, img })
    }

    return programs
  })
}
