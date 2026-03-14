// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  devtools: {
    enabled: false,
  },
  app: {
    head: {
      titleTemplate: '%s | TFM Client',
    },
  },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  nitro: {
    typescript: {
      tsConfig: {
        compilerOptions: {
          lib: ['dom'],
        },
      },
    },
  },
})
