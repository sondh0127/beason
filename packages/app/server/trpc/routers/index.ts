import { createRouter } from './createRouter'
import { todosRouter } from './Todo.router'

export const appRouter = createRouter()
  .merge('todo.', todosRouter)
