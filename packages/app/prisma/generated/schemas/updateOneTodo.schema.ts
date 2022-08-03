import { z } from 'zod'
import { TodoUpdateInputObjectSchema } from './objects/TodoUpdateInput.schema'
import { TodoWhereUniqueInputObjectSchema } from './objects/TodoWhereUniqueInput.schema'

export const TodoUpdateOneSchema = z.object({
  data: TodoUpdateInputObjectSchema,
  where: TodoWhereUniqueInputObjectSchema,
})
