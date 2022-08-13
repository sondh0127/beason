import { z } from 'zod'
import type { Prisma } from '@prisma/client'
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema'

const Schema: z.ZodType<Prisma.IntFilter> = z
  .object({
    equals: z.number().optional(),
    in: z.number().array().optional(),
    notIn: z.number().array().optional(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    not: z
      .union([z.number(), z.lazy(() => NestedIntFilterObjectSchema)])
      .optional(),
  })
  .strict()

export const IntFilterObjectSchema = Schema
