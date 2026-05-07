const { createSSRApp } = require('vue')
const App = require('./App.vue').default

function createApp() {
  const app = createSSRApp(App)
  return app
}

module.exports = createApp
module.exports.default = createApp
