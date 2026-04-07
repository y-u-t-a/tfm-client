import type { Program } from '~~/shared/model/program'
import { withBrowser } from '../utils/browser'

export async function searchPrograms(keyword: string): Promise<Program[]> {
  return withBrowser(async (page) => {
    await page.goto('https://www.tfm.co.jp/podcast/')

    // 検索
    await page.locator('.p-search_box').fill(keyword)
    await page.keyboard.press('Enter')
    await page.waitForSelector('#programList')

    // 検索結果を取得
    return page.$$eval('#programList > .p-podcast_item', elements =>
      elements.map((el) => {
        const href = el.querySelector('a')?.href ?? ''
        const title = el.querySelector('.p-podcast_item_ttl')?.textContent?.trim() ?? ''
        const img = el.querySelector('img')?.src ?? ''
        const id = href.split('/').at(-1) ?? ''
        return { id, title, href, img }
      }),
    )
  })
}
