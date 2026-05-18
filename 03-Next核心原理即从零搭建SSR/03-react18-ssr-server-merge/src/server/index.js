import express from 'express'
import path from 'path'
import React from 'react'
import { fileURLToPath } from 'url'
import { renderToString } from 'react-dom/server'

import App from '../app.jsx'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const server = express()

server.use(express.static(path.resolve(__dirname, '../../dist')))

server.get('/', (req, res) => {
  const appHtml = renderToString(<App />)

  res.status(200)
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.end(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>03 React SSR + Hydration (webpack-merge)</title>
      </head>
      <body>
        <div id="root">${appHtml}</div>
        <script src="/client.bundle.js"></script>
      </body>
    </html>
  `)
})

server.listen(3000, () => {
  console.log('03-react18-ssr-server-merge running at http://localhost:3000')
})
