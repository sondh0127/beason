import { z } from 'zod'
import { TodoWhereUniqueInputObjectSchema } from './objects/TodoWhereUniqueInput.schema'
import { TodoCreateInputObjectSchema } from './objects/TodoCreateInput.schema'
import { TodoUpdateInputObjectSchema } from './objects/TodoUpdateInput.schema'

export const TodoUpsertSchema = z.object({
  where: TodoWhereUniqueInputObjectSchema,
  create: TodoCreateInputObjectSchema,
  update: TodoUpdateInputObjectSchema,
})
