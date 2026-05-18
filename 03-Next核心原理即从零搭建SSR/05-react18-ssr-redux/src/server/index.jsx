import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router-dom/server'

import App from '../app.jsx'
import { createStore } from '../store/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const server = express()

server.use(express.static(path.resolve(__dirname, '../../dist')))

server.get('*', (req, res) => {
  const store = createStore()

  const appHtml = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url}>
        <App />
      </StaticRouter>
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
        <title>05 React SSR + Redux</title>
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
  console.log('05-react18-ssr-redux running at http://localhost:3000')
})
