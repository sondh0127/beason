import { fileURLToPath } from 'url'
import { addAutoImportDir, addPlugin, addServerHandler, defineNuxtModule } from '@nuxt/kit'
import { join } from 'pathe'
import { defu } from 'defu'

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
    const finalConfig = nuxt.options.runtimeConfig.public.trpcQuery = defu(nuxt.options.runtimeConfig.public.trpcQuery, {
      baseURL: options.baseURL,
      endpoint: options.endpoint,
    })

    // Register runtime folder
    const runtimeDir = rPath('./runtime')
    nuxt.options.build.transpile.push(runtimeDir)

    // TRPC Server
    // const handlerPath = join(nuxt.options.buildDir, 'trpc-handler.ts')
    addServerHandler({
      route: `${finalConfig.endpoint}/*`,
      handler: join(runtimeDir, 'trpc-handler.ts'),
    })

    // Nuxt Auth module
    addServerHandler({
      route: '/api/auth/**',
      handler: join(runtimeDir, 'next-auth/next-auth.ts'),
    })

    addServerHandler({
      route: '/api/session',
      handler: join(runtimeDir, 'next-auth/session.ts'),
    })

    // Register all plugins for TRPC - VueQuery - NextAuth
    addPlugin(join(runtimeDir, 'plugin.ts'))

    addAutoImportDir(join(runtimeDir, 'client'))
  },
})
