export default defineNuxtPlugin((nuxtApp) => {
  const log = (name: string, payload?: any) => {
    const side = process.server ? 'server' : 'client'
    console.log(`[${side}] ${name}`, payload ?? '')
  }

  nuxtApp.hook('app:created', () => log('app:created'))
  nuxtApp.hook('app:beforeMount', () => log('app:beforeMount'))
  nuxtApp.hook('app:mounted', () => log('app:mounted'))
  nuxtApp.hook('app:rendered', () => log('app:rendered'))
  nuxtApp.hook('app:redirected', (to) => log('app:redirected', to))

  nuxtApp.hook('page:start', () => log('page:start'))
  nuxtApp.hook('page:finish', () => log('page:finish'))
  nuxtApp.hook('page:transition:finish', () => log('page:transition:finish'))

  nuxtApp.hook('app:error', (err) => log('app:error', err))
})
