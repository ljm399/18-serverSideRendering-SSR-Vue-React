import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'

import App from '../app.jsx'
import { createStore, fetchHomeInfo } from '../store/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const server = express()

server.use(express.static(path.resolve(__dirname, '../../dist')))

server.get('*', async (req, res) => {
  const store = createStore()

  await store.dispatch(fetchHomeInfo())

  const appHtml = renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  )

  const preloadedState = store.getState()

  res.status(200)
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.end(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>06 React SSR + Redux Async</title>
      </head>
      <body>
        <div id="root">${appHtml}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
        </script>
        <script src="/client.bundle.js"></script>
      </body>
    </html>
  `)
})

server.listen(3000, () => {
  console.log('06-react18-ssr-redux-async running at http://localhost:3000')
})
