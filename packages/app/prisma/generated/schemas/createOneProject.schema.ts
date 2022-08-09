import { z } from 'zod';
import { ProjectCreateInputObjectSchema } from './objects/ProjectCreateInput.schema';

export const ProjectCreateOneSchema = z.object({
  data: ProjectCreateInputObjectSchema,
});
