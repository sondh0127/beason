import type { DehydratedState, VueQueryPluginOptions } from 'vue-query'
import {
  QueryClient,
  VueQueryPlugin,
  dehydrate,
  hydrate,
} from 'vue-query'
import * as trpc from '@trpc/client'
import type { NextAuthOptions, Session } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import type { CompatibilityEvent } from 'h3'
import { NextAuthHandler } from 'next-auth/core'
import type { SessionContextValue } from './next-auth/session-context'
import { createSessionProvider, getSession } from './client/auth-client'
import { defineNuxtPlugin } from '#app'
import type { router } from '~/server/trpc'

declare type AppRouter = typeof router

declare module '#app' {
  interface NuxtApp {
    $trpcClient: trpc.TRPCClient<AppRouter>
    $session: SessionContextValue | undefined
  }
}

// need to provide the options for query client
export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig().public.trpcQuery

  // TRPC client
  const trpcClient = trpc.createTRPCClient<AppRouter>({
    url: `${config.baseURL}${config.endpoint}`,
    headers: () => {
      if (nuxtApp.ssrContext) {
        return {
          // ...unref(otherHeaders),
          // ...headers,
        }
      }
      return {}
    },
  })

  nuxtApp.provide('trpcClient', trpcClient)

  // Vue Query client
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 } },
  })
  const options: VueQueryPluginOptions = { queryClient }

  nuxtApp.vueApp.use(VueQueryPlugin, options)
  const vueQueryClient = useState<DehydratedState | null>('vue-query')

  if (process.server) {
    nuxtApp.hooks.hook('app:rendered', () => {
      vueQueryClient.value = dehydrate(queryClient)
    })
  }

  if (process.client) {
    nuxtApp.hooks.hook('app:created', () => {
      hydrate(queryClient, vueQueryClient.value)
    })
  }

  // NextAuth Session Provider

  const sessionValue = useState<Session | null>('auth-session')

  // const sessionValue = createSessionProvider()

  // // nuxt auth
  // nuxtApp.provide('session', sessionValue)

  addRouteMiddleware('next-auth', async (to, from) => {
    if (process.server) {
      const nuxt = useNuxtApp()
      sessionValue.value = await getSession({ req: nuxt.ssrContext?.event.req })
    }

    if (process.client) {
      const session = sessionValue.value
      if (session) {
        if (to.path === '/login') {
          // todo get redirect url from session or from query string
          return navigateTo('/')
        }
      }
      else {
        if (to.path !== '/login')
          return navigateTo('/login')
      }
    }
  }, { global: true })
})
