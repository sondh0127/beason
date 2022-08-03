import { z } from 'zod'
import type { Prisma } from '@prisma/client'
import { IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema'
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema'
import { BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema'
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const Schema: z.ZodType<Prisma.TodoScalarWhereWithAggregatesInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => TodoScalarWhereWithAggregatesInputObjectSchema),
        z.lazy(() => TodoScalarWhereWithAggregatesInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => TodoScalarWhereWithAggregatesInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => TodoScalarWhereWithAggregatesInputObjectSchema),
        z.lazy(() => TodoScalarWhereWithAggregatesInputObjectSchema).array(),
      ])
      .optional(),
    id: z
      .union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number()])
      .optional(),
    title: z
      .union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()])
      .optional(),
    completed: z
      .union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()])
      .optional(),
    createdAt: z
      .union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.date()])
      .optional(),
  })
  .strict()

export const TodoScalarWhereWithAggregatesInputObjectSchema = Schema
