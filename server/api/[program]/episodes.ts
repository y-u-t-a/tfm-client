import * as z from 'zod'

import { getEpisodes } from '~~/server/scraping/rss'

const paramSchema = z.object({
  program: z.string(),
})

export default defineEventHandler(async (event) => {
  const { program } = await getValidatedRouterParams(event, data => paramSchema.parse(data))
  const { title, episodes } = await getEpisodes(program)
  return {
    title,
    episodes,
  }
})
