import { resolve } from 'path'
import { defineNuxtConfig } from 'nuxt'
import MyModule from '..'

export default defineNuxtConfig({
  srcDir: __dirname,
  rootDir: resolve(__dirname, '..'),
  modules: [
    MyModule,
  ],
  myModule: {
    addPlugin: true,
  },
  typescript: {
    strict: true,
  },
})
