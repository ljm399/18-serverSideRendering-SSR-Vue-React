const Koa = require('koa')
const Router = require('@koa/router')
const serve = require('koa-static')
const path = require('path')
const { renderToString } = require('@vue/server-renderer')
const { createMemoryHistory } = require('vue-router')
const { createPinia } = require('pinia')

const createApp = require('../app').default
const createRouter = require('../router').default

const app = new Koa()
const router = new Router()

app.use(serve(path.resolve(__dirname, '../../build')))

router.get(/.*/, async (ctx) => {
  const vueApp = createApp()

  const appRouter = createRouter(createMemoryHistory())
  vueApp.use(appRouter)
  await appRouter.push(ctx.url || '/')
  await appRouter.isReady()

  const pinia = createPinia()
  vueApp.use(pinia)

  const appStringHtml = await renderToString(vueApp)
  const state = JSON.stringify(pinia.state.value)

  ctx.type = 'text/html'
  ctx.body = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <div id="app">${appStringHtml}</div>
        <script>window.__INITIAL_STATE__ = ${state}</script>
        <script src="/client/client_bundle.js"></script>
      </body>
    </html>
  `
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000)
