import * as z from 'zod'

import { searchPrograms } from '../scraping/programs'

const querySchema = z.object({
  name: z.string(),
})

export default defineEventHandler(async (event) => {
  const { name } = await getValidatedQuery(event, data => querySchema.parse(data))
  const programs = await searchPrograms(name)
  return {
    programs,
  }
})
