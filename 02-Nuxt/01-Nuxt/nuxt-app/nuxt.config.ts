// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  runtimeConfig: {
    appKey: 'DEFAULT_APP_KEY',
    public: {
      baseURL: 'http://localhost:3000'
    }
  }
})
