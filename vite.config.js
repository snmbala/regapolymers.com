import { defineConfig } from 'vite'
import { resolve } from 'path'
import inject from '@rollup/plugin-inject'

export default defineConfig({
  // Make jQuery available globally so Bootstrap 4 can find it
  plugins: [
    // Inject jQuery globally so Bootstrap 4 can find it — JS files only
    inject({
      $: 'jquery',
      jQuery: 'jquery',
      include: ['**/*.js'],
    }),
  ],

  build: {
    rollupOptions: {
      // Multi-page: index.html + copyright.html
      input: {
        main: resolve(__dirname, 'index.html'),
        copyright: resolve(__dirname, 'copyright.html'),
      },
    },
  },
})
