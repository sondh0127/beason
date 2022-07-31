import { z } from 'zod';
import { TodoWhereUniqueInputObjectSchema } from './objects/TodoWhereUniqueInput.schema';

export const TodoFindUniqueSchema = z.object({
  where: TodoWhereUniqueInputObjectSchema,
});
