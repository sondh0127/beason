import type { inferAsyncReturnType } from '@trpc/server'
import type { CompatibilityEvent } from 'h3'
import { prisma } from '../db/client'
import { appRouter } from './routers'

export const router = appRouter

export async function createContext(event: CompatibilityEvent) {
  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers

  // This is just an example of something you'd might want to do in your ctx fn
  // const x = useCookies(event)
  // console.log(event.req.headers)

  return {
    prisma,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
