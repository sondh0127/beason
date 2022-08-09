import { createRouter } from './createRouter'
import { todosRouter } from './Todo.router'
import { projectRouter } from './Project.router'

export const appRouter = createRouter()
  .merge('todo.', todosRouter)
  .merge('project.', projectRouter)
