import { defineNuxtConfig } from 'nuxt'
import Inspector from 'vite-plugin-vue-inspector'
import NuxtTrpcQuery from '../nuxt-trpc-query'

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    NuxtTrpcQuery,
  ],
  experimental: {
    reactivityTransform: true,
    viteNode: false,
  },
  unocss: {
    preflight: true,
  },
  colorMode: {
    classSuffix: '',
  },
  runtimeConfig: {
    baseURL: 'http://localhost:3000',
  },
  trpcQuery: {
    baseURL: 'http://localhost:3000', // defaults to http://localhost:3000
    endpoint: '/trpc', // defaults to /trpc
  },
  typescript: {
    strict: true, // required to make input/output types work
  },
  vite: {
    plugins: [
      Inspector({ appendTo: 'entry.mjs' }),
    ],
  },
})
