export default defineNuxtPlugin(() => {
  console.log('[plugin] 01.init', { server: process.server, client: process.client })
})
