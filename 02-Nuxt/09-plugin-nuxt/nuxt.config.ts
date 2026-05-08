export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  plugins: [
    '~/plugins/01.init',
    '~/plugins/02.hello',
    { src: '~/plugins/03.client-only.client', mode: 'client' }
  ]
})
