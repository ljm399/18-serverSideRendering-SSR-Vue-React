const { createRouter } = require('vue-router')

const routes = [
  {
    path: '/',
    component: () => import('../views/home.vue')
  },
  {
    path: '/about',
    component: () => import('../views/about.vue')
  }
]

function createAppRouter(history) {
  return createRouter({
    history,
    routes
  })
}

module.exports = createAppRouter
module.exports.default = createAppRouter
