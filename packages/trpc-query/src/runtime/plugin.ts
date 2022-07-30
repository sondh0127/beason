import type { DehydratedState, VueQueryPluginOptions } from 'vue-query'
import {
  QueryClient,
  VueQueryPlugin,
  dehydrate,
  hydrate,
} from 'vue-query'
import * as trpc from '@trpc/client'
import { defineNuxtPlugin } from '#app'
import type { router } from '~/server/trpc'

declare type AppRouter = typeof router

declare module '#app' {
  interface NuxtApp {
    $client: trpc.TRPCClient<AppRouter>
  }
}

// need to provide the options for query client
export default defineNuxtPlugin((nuxtApp) => {
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
})
