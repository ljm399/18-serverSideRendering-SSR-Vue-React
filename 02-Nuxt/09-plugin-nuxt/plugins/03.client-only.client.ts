export default defineNuxtPlugin(() => {
  console.log('[plugin] 03.client-only', { ua: window.navigator.userAgent })

  return {
    provide: {
      ua: window.navigator.userAgent
    }
  }
})
