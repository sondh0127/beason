import { z } from 'zod'
import type { Prisma } from '@prisma/client'
import { SortOrderSchema } from '../enums/SortOrder.schema'

const Schema: z.ZodType<Prisma.TodoMinOrderByAggregateInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    title: z.lazy(() => SortOrderSchema).optional(),
    completed: z.lazy(() => SortOrderSchema).optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
  })
  .strict()

export const TodoMinOrderByAggregateInputObjectSchema = Schema
