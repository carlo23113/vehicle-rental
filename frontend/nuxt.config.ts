// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],

  css: ['vuetify/styles', '@mdi/font/css/materialdesignicons.css', '~/assets/css/animations.css'],

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
    define: {
      'process.versions.node': JSON.stringify(undefined),
    },
    optimizeDeps: {
      exclude: ['xlsx'],
    },
    ssr: {
      noExternal: ['xlsx'],
    },
  },

  imports: {
    dirs: ['stores', 'composables', 'utils'],
  },

  alias: {
    '~': './',
    '@': './',
    '~~': './',
    '@@': './',
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
    // Owner components
    {
      path: '~/components/owner/dashboard',
      pathPrefix: false,
    },
    {
      path: '~/components/owner/customers',
      pathPrefix: false,
      global: false,
    },
    {
      path: '~/components/owner/rentals',
      pathPrefix: false,
      global: false,
    },
    {
      path: '~/components/owner/vehicles',
      pathPrefix: false,
      global: false,
    },
    {
      path: '~/components/owner/locations',
      pathPrefix: false,
      global: false,
    },
    {
      path: '~/components/owner/maintenance',
      pathPrefix: false,
      global: false,
    },
    {
      path: '~/components/owner/payments',
      pathPrefix: false,
      global: false,
    },
    {
      path: '~/components/owner/invoices',
      pathPrefix: false,
      global: false,
    },
    {
      path: '~/components/owner/roles',
      pathPrefix: false,
      global: false,
    },
    {
      path: '~/components/owner/users',
      pathPrefix: false,
      global: false,
    },
    {
      path: '~/components/owner/documents',
      pathPrefix: false,
      global: false,
    },
    {
      path: '~/components/owner/notifications',
      pathPrefix: false,
      global: false,
    },
    {
      path: '~/components/owner/reports',
      pathPrefix: false,
      global: false,
    },
    // Admin components
    {
      path: '~/components/admin/tenants',
      pathPrefix: false,
      global: false,
    },
    {
      path: '~/components/admin/dashboard',
      pathPrefix: false,
      global: false,
    },
    {
      path: '~/components/contract',
      pathPrefix: false,
      global: false,
    },
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  // Optimize chunk loading
  experimental: {
    payloadExtraction: true,
    componentIslands: true, // Enable component islands for better hydration
  },

  // Performance optimizations
  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
    externals: {
      inline: ['xlsx'],
    },
  },

  // Route rules for optimization
  routeRules: {
    // Static pages - pre-render at build time
    '/': { prerender: true },

    // Cache static assets
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
