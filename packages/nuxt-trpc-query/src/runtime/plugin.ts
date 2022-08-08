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

  addRouteMiddleware('global-auth', async (from, to) => {
    const res = await $fetch('/api/session2')
    console.log('[LOG] ~ file: plugin.ts ~ line 80 ~ res', res)
    if (from.path === '/login')
      return undefined

    // const _session = await getSession()
    // if (!_session) {
    //   if (process.client && from.path !== '/login')

    //     return navigateTo('/login')
    // }
    // return navigateTo('/')
  }, { global: true })
})
