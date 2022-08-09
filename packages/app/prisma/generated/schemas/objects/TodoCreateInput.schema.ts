import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TodoCreateInput> = z
  .object({
    title: z.string(),
    completed: z.boolean().optional(),
    createdAt: z.date().optional(),
    giang: z.boolean().optional(),
  })
  .strict();

export const TodoCreateInputObjectSchema = Schema;
