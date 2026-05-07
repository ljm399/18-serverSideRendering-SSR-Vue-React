// import { createSSRApp } from 'vue'
// import App from './App.vue'
const { createSSRApp } = require("vue")
const App = require("./App.vue").default

module.exports = function createApp() {
  const app = createSSRApp(App)
  return app
}
