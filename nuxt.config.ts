// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/eslint'],
  ssr: false,
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
  eslint: {
    config: {
      stylistic: {
        indent: 2,
        quotes: 'single',
        semi: false,
      },
    },
  },
  icon: {
    /**
     * デフォルトの css モードは、クラス名の差し替え + 後追いの CSS 注入でアイコンを描画する。
     * ページを直接開いた（新しいタブなど）場合に初回未使用だったアイコンの CSS が入らず、
     * 再生/一時停止のように動的に切り替わるアイコンの表示が変わらないため svg モードにする
     */
    mode: 'svg',
  },
})
