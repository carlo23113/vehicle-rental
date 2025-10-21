import { createConfigForNuxt } from '@nuxt/eslint'
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: false,
  },
}).append(
  eslintPluginPrettier,
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-multiple-template-root': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'prettier/prettier': [
        'error',
        {
          semi: false,
          singleQuote: true,
          trailingComma: 'es5',
          printWidth: 100,
          tabWidth: 2,
          arrowParens: 'avoid',
        },
      ],
    },
  }
)
