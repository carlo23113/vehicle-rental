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
    define: {
      'process.versions.node': JSON.stringify(undefined),
    },
    optimizeDeps: {
      exclude: ['xlsx'],
    },
    ssr: {
      noExternal: ['xlsx'],
    },
    build: {
      // Enable code splitting for better lazy loading
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Split vendor chunks for better caching
            if (id.includes('node_modules')) {
              if (id.includes('vuetify')) {
                return 'vuetify'
              }
              if (id.includes('vue-router')) {
                return 'vue-router'
              }
              if (id.includes('@vue') || id.includes('vue')) {
                return 'vue'
              }
              if (id.includes('pinia')) {
                return 'pinia'
              }
              if (id.includes('chart.js')) {
                return 'charts'
              }
              if (id.includes('@tiptap')) {
                return 'tiptap'
              }
              if (id.includes('xlsx')) {
                return 'xlsx'
              }
              return 'vendor'
            }

            // Split by feature/module
            if (id.includes('/components/dashboard/')) {
              return 'dashboard'
            }
            if (id.includes('/components/reports/')) {
              return 'reports'
            }
            if (id.includes('/components/vehicles/')) {
              return 'vehicles'
            }
            if (id.includes('/components/customers/')) {
              return 'customers'
            }
            if (id.includes('/components/rentals/')) {
              return 'rentals'
            }
            if (id.includes('/components/payments/')) {
              return 'payments'
            }
            if (id.includes('/components/contract/')) {
              return 'contract'
            }
            if (id.includes('/components/maintenance/')) {
              return 'maintenance'
            }
            if (id.includes('/components/locations/')) {
              return 'locations'
            }
            if (id.includes('/components/users/')) {
              return 'users'
            }
            if (id.includes('/components/roles/')) {
              return 'roles'
            }
            if (id.includes('/components/landing/')) {
              return 'landing'
            }
            if (id.includes('/components/admin/')) {
              return 'admin'
            }
          }
        }
      },
      chunkSizeWarningLimit: 600,
      cssCodeSplit: true,
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
      path: '~/components/reports',
      pathPrefix: false,
      // Lazy load report components (heavy tables/charts)
      global: false,
    },
    {
      path: '~/components/contract',
      pathPrefix: false,
      global: false,
    },
    {
      path: '~/components/payments',
      pathPrefix: false,
      global: false,
    },
    {
      path: '~/components/maintenance',
      pathPrefix: false,
      global: false,
    },
    {
      path: '~/components',
      pathPrefix: false,
    }
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
  }
})