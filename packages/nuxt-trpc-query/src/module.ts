import { fileURLToPath } from 'url'
import { addAutoImport, addPlugin, addServerHandler, defineNuxtModule } from '@nuxt/kit'
import { join, resolve } from 'pathe'
import { defu } from 'defu'

export interface ModuleOptions {
  addPlugin: boolean
  baseURL: string
  endpoint: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'trpcQuery',
    configKey: 'trpcQuery',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  defaults: {
    addPlugin: true,
    baseURL: 'http://localhost:3000',
    endpoint: '/trpc',
  },
  setup(options, nuxt) {
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    // Final resolved configuration
    const finalConfig = nuxt.options.runtimeConfig.public.trpcQuery = defu(nuxt.options.runtimeConfig.public.trpcQuery, {
      addPlugin: options.addPlugin,
      baseURL: options.baseURL,
      endpoint: options.endpoint,
    })

    if (finalConfig.addPlugin) {
      nuxt.options.build.transpile.push(runtimeDir)
      addPlugin(resolve(runtimeDir, 'plugin'))
    }

    addAutoImport([
      { name: 'useQuery', from: join(runtimeDir, 'client') },
      { name: 'useMutation', from: join(runtimeDir, 'client') },
      { name: 'useInfiniteQuery', from: join(runtimeDir, 'client') },
      { name: 'useQueryClient', from: join(runtimeDir, 'client') },
      // { name: 'useClientHeaders', from: join(runtimeDir, 'client') },
      // { name: 'getQueryKey', from: join(runtimeDir, 'client') },

      { name: 'signIn', from: join(runtimeDir, 'auth-client') },
      { name: 'signOut', from: join(runtimeDir, 'auth-client') },
      { name: 'useSession', from: join(runtimeDir, 'auth-client') },
    ])

    // add server handler endpoint for trpc
    // const handlerPath = join(nuxt.options.buildDir, 'trpc-handler.ts')
    const handlerPath = join(runtimeDir, 'trpc-handler.ts')
    const handlerPathAuth = join(runtimeDir, 'next-auth.ts')

    addServerHandler({
      route: `${finalConfig.endpoint}/*`,
      handler: handlerPath,
    })

    addServerHandler({
      route: '/api/auth/**',
      handler: handlerPathAuth,
    })
  },
})
