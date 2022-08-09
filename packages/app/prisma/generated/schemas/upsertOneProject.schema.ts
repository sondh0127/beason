import { z } from 'zod';
import { ProjectWhereUniqueInputObjectSchema } from './objects/ProjectWhereUniqueInput.schema';
import { ProjectCreateInputObjectSchema } from './objects/ProjectCreateInput.schema';
import { ProjectUpdateInputObjectSchema } from './objects/ProjectUpdateInput.schema';

export const ProjectUpsertSchema = z.object({
  where: ProjectWhereUniqueInputObjectSchema,
  create: ProjectCreateInputObjectSchema,
  update: ProjectUpdateInputObjectSchema,
});
