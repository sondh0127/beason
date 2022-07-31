import * as trpc from '@trpc/server'
import type { inferAsyncReturnType } from '@trpc/server'
import { z } from 'zod'
import type { CompatibilityEvent } from 'h3'

const baseURL = 'https://jsonplaceholder.typicode.com'

const TodoShape = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
})

export type Todo = z.infer<typeof TodoShape>

export const router = trpc.router<Context>()
  .query('getTodos', {
    async resolve() {
      return await $fetch<Todo[]>(`${baseURL}/todos`)
    },
  })
  .query('getTodo', {
    input: z.number(),
    async resolve(req) {
      return await $fetch<Todo>(`${baseURL}/todos/${req.input}`)
    },
  })
  .mutation('addTodo', {
    input: TodoShape,
    async resolve(req) {
      return await $fetch<Todo>(`${baseURL}/todos`, {
        method: 'POST',
        body: req.input,
      })
    },
  }).query('getInfiniteTodos', {
    input: z.object({
      cursor: z.number().nullish(),
      limit: z.number().min(1).max(100).nullish(),
    }),
    async resolve({ input }) {
      const limit = input.limit ?? 50
      const { cursor } = input

      // const items = await prisma
    },
  })

export async function createContext(event: CompatibilityEvent) {
  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers

  // This is just an example of something you'd might want to do in your ctx fn
  // const x = useCookies(event)
  console.log(event.req.headers)

  return {

  }
}

type Context = inferAsyncReturnType<typeof createContext>
