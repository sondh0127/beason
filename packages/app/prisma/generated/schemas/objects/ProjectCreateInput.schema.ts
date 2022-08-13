import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<Prisma.ProjectCreateInput> = z
  .object({
    description: z.string(),
    name: z.string(),
    createdAt: z.date().optional(),
  })
  .strict()

export const ProjectCreateInputObjectSchema = Schema
