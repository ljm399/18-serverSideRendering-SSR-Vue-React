const { createWebHistory } = require('vue-router')
const createApp = require("../app")
const createRouter = require("../router").default

const app = createApp()
const router = createRouter(createWebHistory())
app.use(router)

router.isReady().then(() => {
  app.mount('#app')
})
