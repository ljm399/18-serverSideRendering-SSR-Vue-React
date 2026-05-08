import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    return { top: 0 }
  }
}
