import { z } from 'zod'
import type { Prisma } from '@prisma/client'
import { NestedBoolWithAggregatesFilterObjectSchema } from './NestedBoolWithAggregatesFilter.schema'
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema'
import { NestedBoolFilterObjectSchema } from './NestedBoolFilter.schema'

const Schema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z
  .object({
    equals: z.boolean().optional(),
    not: z
      .union([
        z.boolean(),
        z.lazy(() => NestedBoolWithAggregatesFilterObjectSchema),
      ])
      .optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedBoolFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedBoolFilterObjectSchema).optional(),
  })
  .strict()

export const BoolWithAggregatesFilterObjectSchema = Schema
