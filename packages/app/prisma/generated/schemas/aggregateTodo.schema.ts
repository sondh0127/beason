import { z } from 'zod';
import { TodoWhereInputObjectSchema } from './objects/TodoWhereInput.schema';
import { TodoOrderByWithRelationInputObjectSchema } from './objects/TodoOrderByWithRelationInput.schema';
import { TodoWhereUniqueInputObjectSchema } from './objects/TodoWhereUniqueInput.schema';

export const TodoAggregateSchema = z.object({
  where: TodoWhereInputObjectSchema.optional(),
  orderBy: TodoOrderByWithRelationInputObjectSchema.optional(),
  cursor: TodoWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
});
