import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'

import App from '../app.jsx'

const server = express()

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
        <title>01 React SSR</title>
      </head>
      <body>
        <div id="root">${appHtml}</div>
      </body>
    </html>
  `)
})

server.listen(3000, () => {
  console.log('01-react18-ssr-server running at http://localhost:3000')
})
