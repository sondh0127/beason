import { fileURLToPath } from 'url'
import { addAutoImport, addPlugin, addServerHandler, addTemplate, defineNuxtModule } from '@nuxt/kit'
import { join, resolve } from 'pathe'
import { defu } from 'defu'
import dedent from 'dedent'

export interface ModuleOptions {
  addPlugin: boolean
  baseURL: string
  endpoint: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@sondh0127/trpc-query',
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
      // { name: 'useClient', from: join(runtimeDir, 'client') },
      { name: 'useQuery', from: join(runtimeDir, 'client') },
      // { name: 'useClientHeaders', from: join(runtimeDir, 'client') },
      // { name: 'getQueryKey', from: join(runtimeDir, 'client') },
    ])

    // add server handler endpoint for trpc
    // const handlerPath = join(nuxt.options.buildDir, 'trpc-handler.ts')
    const handlerPath = join(runtimeDir, 'trpc-handler.ts')

    const trpcOptionsPath = join(nuxt.options.srcDir, 'server/trpc')

    addServerHandler({
      route: `${finalConfig.endpoint}/*`,
      handler: handlerPath,
    })

    // addTemplate({
    //   filename: 'trpc-handler.ts',
    //   write: true,
    //   getContents() {
    //     // return dedent`
    //     //   import { createTRPCHandler } from 'trpc-query/api'
    //     //   import * as functions from '${trpcOptionsPath}'

    //     //   export default createTRPCHandler({
    //     //     ...functions,
    //     //     endpoint: '${finalConfig.endpoint}'
    //     //   })
    //     // `
    //   },
    // })
  },
})
