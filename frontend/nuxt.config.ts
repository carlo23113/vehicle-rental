// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css',
    '~/assets/css/animations.css',
  ],

  build: {
    transpile: ['vuetify'],
  },

  vite: {
    resolve: {
      alias: {
        '~': resolve(__dirname, './'),
        '@': resolve(__dirname, './'),
        '~~': resolve(__dirname, './'),
        '@@': resolve(__dirname, './'),
      },
    },
    build: {
      // Enable code splitting for better lazy loading
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor chunks for better caching
            'vuetify': ['vuetify'],
            'vue-vendor': ['vue', 'vue-router'],
          }
        }
      }
    }
  },

  imports: {
    dirs: ['stores', 'composables', 'utils']
  },

  alias: {
    '~': './',
    '@': './',
    '~~': './',
    '@@': './'
  },

  // Enable component lazy loading with path prefixes to avoid naming conflicts
  components: [
    {
      path: '~/components/common',
      prefix: 'Common',
      pathPrefix: true,
    },
    {
      path: '~/components/layout',
      pathPrefix: false,
    },
    {
      path: '~/components/dashboard',
      pathPrefix: false,
    },
    {
      path: '~/components',
      pathPrefix: false,
    }
  ],

  // Optimize chunk loading
  experimental: {
    payloadExtraction: true,
  },

  // Performance optimizations
  nitro: {
    compressPublicAssets: true,
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  }
})