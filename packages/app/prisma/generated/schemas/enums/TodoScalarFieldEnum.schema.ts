import { z } from 'zod';

export const TodoScalarFieldEnumSchema = z.enum([
  'id',
  'title',
  'completed',
  'createdAt',
  'giang',
]);
