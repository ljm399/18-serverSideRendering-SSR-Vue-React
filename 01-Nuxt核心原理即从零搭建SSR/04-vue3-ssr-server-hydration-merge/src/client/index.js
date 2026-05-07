// src/client/index.js
const createApp = require("../app.js")
// hydration：接管服务端已经渲染好的 DOM
const app = createApp()
app.mount('#app')
