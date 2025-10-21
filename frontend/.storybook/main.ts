import type { StorybookConfig } from '@storybook/vue3-vite'
import { mergeConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials'
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },
  docs: {},
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [vue()],
      resolve: {
        alias: {
          'storybook/actions/decorator': '@storybook/core/preview-api',
          '~': path.resolve(__dirname, '..'),
          '@': path.resolve(__dirname, '..'),
          '~~': path.resolve(__dirname, '..'),
          '@@': path.resolve(__dirname, '..')
        }
      }
    })
  }
}

export default config
