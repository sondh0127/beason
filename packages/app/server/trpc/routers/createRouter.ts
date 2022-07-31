import * as trpc from '@trpc/server'

import type { Context } from '../index'

export function createRouter() {
  return trpc.router<Context>()
}

export function createProtectedRouter() {
  return trpc
    .router<Context>()
}
