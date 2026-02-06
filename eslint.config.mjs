// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt()
  .override('nuxt/stylistic', {
    rules: {
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    },
  })
