import { expect, test } from 'vite-plus/test'
import { searchPrograms } from './programs'

test('空白でも検索できること', { timeout: 20000 }, async () => {
  const result = await searchPrograms('')
  expect(result.length).toBeGreaterThan(0)
})

test('検索できること', { timeout: 20000 }, async () => {
  const result = await searchPrograms('ほっとひといき')
  expect(result).toHaveLength(1)
  expect(result[0]).toMatchObject({
    id: 'hitoiki',
    title: 'ローソン presents 日向坂46のほっとひといき！',
    href: 'https://www.tfm.co.jp/podcast/hitoiki',
  })
})

test('検索結果が 0件の場合は配列が 0', { timeout: 20000 }, async () => {
  const result = await searchPrograms('nodata')
  expect(result).toHaveLength(0)
})
