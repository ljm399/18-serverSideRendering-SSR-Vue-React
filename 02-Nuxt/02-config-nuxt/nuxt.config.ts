// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  ssr: true,
  app: {
    head: {
      title: 'hy Nuxt App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'MJLCODE Nuxt App description' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
      htmlAttrs: {
        lang: 'zh-CN'
      }
    }
  },
  appConfig: {
    title: 'Nuxt App',
    theme: {
      primary: '#42b883'
    },
    api: {
      prefix: '/api'
    },
    fromNuxt:{
      mjl: 'code'
    }
  },
  runtimeConfig: {
    appKey: 'DEFAULT_APP_KEY',
    public: {
      baseURL: 'http://localhost:3000'
    }
  }
})
