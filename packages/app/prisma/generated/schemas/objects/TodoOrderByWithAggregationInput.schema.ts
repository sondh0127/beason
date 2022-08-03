import { z } from 'zod'
import type { Prisma } from '@prisma/client'
import { SortOrderSchema } from '../enums/SortOrder.schema'
import { TodoCountOrderByAggregateInputObjectSchema } from './TodoCountOrderByAggregateInput.schema'
import { TodoAvgOrderByAggregateInputObjectSchema } from './TodoAvgOrderByAggregateInput.schema'
import { TodoMaxOrderByAggregateInputObjectSchema } from './TodoMaxOrderByAggregateInput.schema'
import { TodoMinOrderByAggregateInputObjectSchema } from './TodoMinOrderByAggregateInput.schema'
import { TodoSumOrderByAggregateInputObjectSchema } from './TodoSumOrderByAggregateInput.schema'

const Schema: z.ZodType<Prisma.TodoOrderByWithAggregationInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    title: z.lazy(() => SortOrderSchema).optional(),
    completed: z.lazy(() => SortOrderSchema).optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
    _count: z.lazy(() => TodoCountOrderByAggregateInputObjectSchema).optional(),
    _avg: z.lazy(() => TodoAvgOrderByAggregateInputObjectSchema).optional(),
    _max: z.lazy(() => TodoMaxOrderByAggregateInputObjectSchema).optional(),
    _min: z.lazy(() => TodoMinOrderByAggregateInputObjectSchema).optional(),
    _sum: z.lazy(() => TodoSumOrderByAggregateInputObjectSchema).optional(),
  })
  .strict()

export const TodoOrderByWithAggregationInputObjectSchema = Schema
