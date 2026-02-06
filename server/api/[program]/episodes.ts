import * as z from 'zod'

import { getEpisodes } from '~~/server/scraping/episodes'

const paramSchema = z.object({
  program: z.string(),
})

export default defineEventHandler(async (event) => {
  const { program } = await getValidatedRouterParams(event, paramSchema.parse)
  const episodes = await getEpisodes(program)
  return {
    episodes,
  }
})
