import { z } from 'zod'

export const ProjectScalarFieldEnumSchema = z.enum([
  'id',
  'description',
  'name',
  'createdAt',
])
