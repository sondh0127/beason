import { z } from 'zod'
import { TodoCreateInputObjectSchema } from './objects/TodoCreateInput.schema'

export const TodoCreateOneSchema = z.object({
  data: TodoCreateInputObjectSchema,
})
