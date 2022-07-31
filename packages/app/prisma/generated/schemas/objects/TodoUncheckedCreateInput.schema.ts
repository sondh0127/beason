import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TodoUncheckedCreateInput> = z
  .object({
    id: z.number().optional(),
    title: z.string(),
    completed: z.boolean().optional(),
    createdAt: z.date().optional(),
  })
  .strict();

export const TodoUncheckedCreateInputObjectSchema = Schema;
