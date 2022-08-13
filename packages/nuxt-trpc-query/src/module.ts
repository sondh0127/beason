import { fileURLToPath } from 'url'
import { addAutoImportDir, addPlugin, addServerHandler, addTemplate, defineNuxtModule, resolveFiles } from '@nuxt/kit'
import { join, resolve } from 'pathe'
import { defu } from 'defu'
import dedent from 'dedent'

export interface ModuleOptions {
  baseURL: string
  endpoint: string
}

const rPath = (p: string) => fileURLToPath(new URL(p, import.meta.url).toString())

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'trpcQuery',
    configKey: 'trpcQuery',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  defaults: {
    baseURL: 'http://localhost:3000',
    endpoint: '/trpc',
  },
  setup(options, nuxt) {
    // Final resolved configuration
    const finalConfig
    = nuxt.options.runtimeConfig.public.trpcQuery
    = defu(nuxt.options.runtimeConfig.public.trpcQuery, {
        baseURL: options.baseURL,
        endpoint: options.endpoint,
      })

    // Register runtime folder
    const runtimeDir = rPath('./runtime')
    nuxt.options.build.transpile.push(runtimeDir)

    // TRPC Server
    const handlerPath = join(nuxt.options.buildDir, 'trpc-handler.ts')
    const trpcOptionsPath = join(nuxt.options.srcDir, 'server/trpc')

    addTemplate({
      filename: 'trpc-handler.ts',
      write: true,
      getContents() {
        const devPath = join(nuxt.options.rootDir, 'dist/runtime/trpc-handler.ts')
        const isDev = true
        const path = isDev ? devPath : 'nuxt-trpc-query/trpc'
        return dedent`
          import { createTRPCHandler } from '${path}'
          import * as functions from '${trpcOptionsPath}'

          export default createTRPCHandler({
            ...functions,
            endpoint: '${finalConfig.endpoint}'
          })
        `
      },
    })

    addServerHandler({
      route: `${finalConfig.endpoint}/*`,
      handler: handlerPath,
    })

    // Nuxt Auth module
    const authHandlerPath = join(nuxt.options.buildDir, 'next-auth-handler.ts')
    // TODO add Warning Error message
    const nextAuthOptionsPath = resolve(nuxt.options.srcDir, 'server/next-auth')

    addServerHandler({
      route: '/api/auth/**',
      handler: authHandlerPath,
    })

    addTemplate({
      filename: 'next-auth-handler.ts',
      write: true,
      getContents() {
        const devPath = join(nuxt.options.rootDir, 'dist/runtime/next-auth/next-auth.ts')
        const isDev = true
        const path = isDev ? devPath : 'nuxt-trpc-query/next-auth'
        return dedent`
          import { createNextAuthHandler } from '${path}'
          import options from '${nextAuthOptionsPath}'

          export default createNextAuthHandler(options)
        `
      },
    })

    addServerHandler({
      route: '/api/session',
      handler: join(runtimeDir, 'next-auth/session'),
    })

    // Register all plugins for TRPC - VueQuery - NextAuth
    addPlugin(join(runtimeDir, 'plugin'))

    addAutoImportDir(join(runtimeDir, 'client'))
  },
})
