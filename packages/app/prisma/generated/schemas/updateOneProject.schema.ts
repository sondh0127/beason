import { z } from 'zod'
import { ProjectUpdateInputObjectSchema } from './objects/ProjectUpdateInput.schema'
import { ProjectWhereUniqueInputObjectSchema } from './objects/ProjectWhereUniqueInput.schema'

export const ProjectUpdateOneSchema = z.object({
  data: ProjectUpdateInputObjectSchema,
  where: ProjectWhereUniqueInputObjectSchema,
})
