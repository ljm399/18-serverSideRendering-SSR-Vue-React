export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  ssr: true,
  routeRules: {
    '/admin/**': { ssr: false },
    '/landing': { prerender: true },
    '/blog': { isr: 60 },
    '/old-home': { redirect: { to: '/', statusCode: 301 } },
    '/profile': { headers: { 'x-page': 'profile' } }
  }
})
