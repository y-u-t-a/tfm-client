// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: false,
  },
  nitro: {
    typescript: {
      tsConfig: {
        compilerOptions: {
          lib: ["dom"]
        }
      }
    }
  },
  modules: ["@nuxt/ui"],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      titleTemplate: "%s | TFM Client",
    }
  }
})