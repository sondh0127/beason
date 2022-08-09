import { z } from 'zod';
import { TodoWhereUniqueInputObjectSchema } from './objects/TodoWhereUniqueInput.schema';

export const TodoDeleteOneSchema = z.object({
  where: TodoWhereUniqueInputObjectSchema,
});
