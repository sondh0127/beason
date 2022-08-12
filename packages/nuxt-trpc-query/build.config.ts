import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    { input: 'src/module', format: 'esm' },
    // { input: 'src/unocss', format: 'esm' },
    // { input: 'src/composables/', outDir: 'dist/composables' },
    // { input: 'src/presets/', outDir: 'dist/presets' },
    // { input: 'src/assets/', outDir: 'dist/assets' },
    // { input: 'src/utils/', outDir: 'dist/utils' },
  ],
  externals: [
    '@nuxt/schema',
    // 'unocss.mjs',
  ],
})
