export default defineNuxtRouteMiddleware((to, from) => {
  console.log('[logger]', { from: from.fullPath, to: to.fullPath })
})
