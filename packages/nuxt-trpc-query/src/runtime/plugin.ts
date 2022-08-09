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
import type { SessionContextValue } from './session-context'
import { createSessionProvider, getSession } from './auth-client'
import { defineNuxtPlugin } from '#app'
import type { router } from '~/server/trpc'

declare type AppRouter = typeof router

declare module '#app' {
  interface NuxtApp {
    $client: trpc.TRPCClient<AppRouter>
    $session: SessionContextValue | undefined
  }
}

// need to provide the options for query client
export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig().public.trpcQuery

  const client = trpc.createTRPCClient<AppRouter>({
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

  nuxtApp.provide('client', client)

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
  const sessionValue = useState<Session | null>('auth-session')

  if (process.server) {
    nuxtApp.hooks.hook('app:redirected', () => {

    })
  }

  // const sessionValue = createSessionProvider()

  // // nuxt auth
  // nuxtApp.provide('session', sessionValue)

  addRouteMiddleware('global-auth', async (to, from) => {
    if (process.server) {
      const nuxt = useNuxtApp()
      sessionValue.value = await getSession({ req: nuxt.ssrContext?.event.req })
    }

    if (process.client) {
      const _session = sessionValue.value
      if (_session) {
        if (from.path === '/login')
          navigateTo('/')
      }
      else {
        if (from.path !== '/login')
          navigateTo('/login')
      }
    }
  }, { global: true })
})
