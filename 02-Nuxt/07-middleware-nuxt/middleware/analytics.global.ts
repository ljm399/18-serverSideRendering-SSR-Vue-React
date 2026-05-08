export default defineNuxtRouteMiddleware((to, from) => {
  console.log('[analytics]', { from: from.fullPath, to: to.fullPath })
})
