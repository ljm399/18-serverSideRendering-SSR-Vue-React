const { createWebHistory } = require('vue-router')
const { createPinia } = require('pinia')
const createApp = require('../app').default
const createRouter = require('../router').default

const app = createApp()

const router = createRouter(createWebHistory())
app.use(router)

const pinia = createPinia()
app.use(pinia)

if (window.__INITIAL_STATE__) {
  pinia.state.value = window.__INITIAL_STATE__
}

router.isReady().then(() => {
  app.mount('#app')
})
