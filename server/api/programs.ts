import * as z from 'zod'

import { searchPrograms } from '../scraping/programs'

const querySchema = z.object({
  name: z.string(),
})

export default defineEventHandler(async (event) => {
  const { name } = await getValidatedQuery(event, querySchema.parse)
  const programs = await searchPrograms(name)
  return {
    programs,
  }
})
