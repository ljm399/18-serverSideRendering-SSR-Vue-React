import express from 'express'
import path from 'path'
import React from 'react'
import { fileURLToPath } from 'url'
import { renderToString } from 'react-dom/server'

import App from '../app.jsx'

const __filename = fileURLToPath(import.meta.url)//当前模块文件的 file://... URL
const __dirname = path.dirname(__filename)//把 file://... 转成 Windows 的真实文件路径（例如 C:\xxx\index.js）

const server = express()

server.use(express.static(path.resolve(__dirname, '../../dist')))//拿到当前文件所在目录

server.get('/', (req, res) => {
  const appHtml = renderToString(React.createElement(App))

  res.status(200)
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.end(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>02 React SSR + Hydration</title>
      </head>
      <body>
        <div id="root">${appHtml}</div>
        <script src="/client.bundle.js"></script>
      </body>
    </html>
  `)
})

server.listen(3000, () => {
  console.log('02-react18-ssr-server-hydration running at http://localhost:3000')
})
