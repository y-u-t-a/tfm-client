import { defineConfig } from 'vite-plus'

export default defineConfig({
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
      denyWarnings: true,
    },
  },
  fmt: {
    semi: false,
    singleQuote: true,
    arrowParens: 'avoid',
    trailingComma: 'es5',
  },
})
