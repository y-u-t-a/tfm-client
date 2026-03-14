// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt()
  .override('nuxt/stylistic', {
    rules: {
      // { ... } が1行に収まるブロックを許可。
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    },
  })
