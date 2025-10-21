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
  },

  imports: {
    dirs: ['stores', 'composables', 'utils']
  },

  alias: {
    '~': './',
    '@': './',
    '~~': './',
    '@@': './'
  }
})