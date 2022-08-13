import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<Prisma.ProjectUncheckedCreateInput> = z
  .object({
    id: z.number().optional(),
    description: z.string(),
    name: z.string(),
    createdAt: z.date().optional(),
  })
  .strict()

export const ProjectUncheckedCreateInputObjectSchema = Schema
