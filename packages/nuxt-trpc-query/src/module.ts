import { fileURLToPath } from 'url'
import { addAutoImportDir, addPlugin, addServerHandler, addTemplate, defineNuxtModule } from '@nuxt/kit'
import { join } from 'pathe'
import { defu } from 'defu'
import type { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import LineProvider from 'next-auth/providers/line'
import dedent from 'dedent'
import { createNextAuthHandler } from './runtime/next-auth/next-auth'

export interface ModuleOptions {
  baseURL: string
  endpoint: string
  nextAuthOptions: NextAuthOptions
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
    nextAuthOptions: {
      providers: [
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        GithubProvider.default({
          // clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
          // clientSecret: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
          clientId: '381722ffda6d5d24f6b5',
          clientSecret: 'f299271f4191972ee2f15dbef06071f5e4fb7da4',
        }),
        LineProvider.default({
          clientId: '1657378767',
          clientSecret: '758311efbf38235a720642a15d9970e6',
        }),
      ],
    },
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
    // const handlerPath = join(nuxt.options.buildDir, 'trpc-handler.ts')
    addServerHandler({
      route: `${finalConfig.endpoint}/*`,
      handler: join(runtimeDir, 'trpc-handler'),
    })

    // Nuxt Auth module
    // addTemplate({
    //   filename: 'next-auth.ts',
    //   write: true,
    //   getContents() {
    //     return dedent`
    //       import handler from 'nuxt-trpc-query/next-auth'

    //       export default handler
    //     `
    //   },
    //   options: options.nextAuthOptions,
    // })

    addServerHandler({
      route: '/api/auth/**',
      handler: join(runtimeDir, 'next-auth/next-auth'),
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
