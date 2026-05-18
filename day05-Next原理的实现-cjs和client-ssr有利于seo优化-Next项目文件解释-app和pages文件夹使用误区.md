# 一。从零搭建React SSR应用

## 1.React SSR静态页面的渲染

- 使用之前vue3图片来理解

  ![](C:\Users\MJL\Desktop\javascript\18-后端渲染-SSR-Vue-React\SSR流程图.png)



### 现在实现的是图片的第2步

这一小节先只做：**请求进来 -> 服务器用 React 把组件 render 成字符串 -> 拼到 HTML 模板里返回**。

### 1.2 安装依赖

- 运行依赖

  ```bash
  npm i express react react-dom
  ```

- 构建/开发依赖（做 jsx 转换 + 监听重启）

  ```bash
  npm i -D webpack webpack-cli nodemon @babel/core babel-loader @babel/preset-env @babel/preset-react cross-env
  ```

`cross-env` 是一个跨平台工具，用来**统一设置环境变量的写法**。

- 在 macOS/Linux 里常见写法：`NODE_ENV=development webpack ...`
- 在 Windows（cmd/powershell）里这写法不兼容（语法不同）

所以脚本里写成： 

- `cross-env NODE_ENV=development webpack ...`

就能在不同系统上都正常工作。

如果你只在 macOS/Linux 开发，也可以不装 `cross-env`，直接用 `NODE_ENV=...` 的写法。

- 如果你使用下面的 `dev` scripts（并行跑 `webpack -w` 和 `nodemon`），还需要安装：

  ```bash
  npm i -D npm-run-all
  ```

### 1.3 webpack 配置（只用于把 server 代码打包到 dist）

> 注意：这一步的目标是让 Node 能运行打包后的 `dist/server.bundle.js`，而不是做浏览器端资源。

`config/webpack.config.js`

```js
const path = require('path')

module.exports = {
  target: 'node',
  mode: process.env.NODE_ENV || 'development',
  entry: path.resolve(__dirname, '../src/server/index.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'server.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { node: 'current' } }],
              ['@babel/preset-react', { runtime: 'automatic' }]
            ]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
}
```

### 1.4 package.json scripts（webpack watch + nodemon）

```json
{
  "scripts": {
    "dev:build": "cross-env NODE_ENV=development webpack -c ./config/webpack.config.js -w",
    "dev:serve": "nodemon --watch dist --exec node dist/server.bundle.js",
    "dev": "npm-run-all -p dev:build dev:serve"
  }
}
```

- -c = config = 指定配置文件
- -w = watch mode = 监听依赖文件变化，自动重新打包（开发环境常用）

你需要再安装一个小工具：

```bash
pnpm i -D npm-run-all
```

如果你不想用 `npm-run-all`，也可以用 `concurrently`，二选一即可。

### 1.5 React 代码

`src/app.jsx`

```jsx
import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>React SSR</h1>
      <p>这段内容来自服务端 renderToString</p>
      <button onClick={() => setCount(count + 1)}>count: {count}</button>
    </div>
  )
}
```

注意：当前只做 SSR（静态 HTML）时，按钮会渲染出来，但点击不会生效；要实现真实交互需要下一节 hydration。

### 1.6 Express + React SSR（服务端返回完整 HTML）

`src/server/index.js`

```js
const express = require('express')
const React = require('react')
const { renderToString } = require('react-dom/server')

const App = require('../app').default

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
        <title>React SSR</title>
      </head>
      <body>
        <div id="root">${appHtml}</div>
      </body>
    </html>
  `)
})

server.listen(3000, () => {
  console.log('React SSR server running at http://localhost:3000')
})
```

### 1.7 启动

- `npm run dev`

然后访问：

- `http://localhost:3000/`

到这里就完成了流程图第2步：**SSR 输出静态 HTML 字符串**。



### 报错：ReferenceError: require is not defined in ES module scope, you can use import instead

### 让 server bundle 用 `.cjs` 输出（解决 `require` 报错）

- **解决**：`filename: 'server.bundle.js'` -> `filename: 'server.bundle.cjs'`

这样 Node 即使在 `type: module` 的项目里，也会把 `dist/server.bundle.cjs` 当 CommonJS 执行，`require()` 就合法了。





## 2.React SSR + hydration

### 即图片的4

目标：

- 服务器返回 SSR 的 HTML（第2步已经做了）
- 浏览器加载到 client bundle 后，对同一份 DOM 做 **hydrate（注水）**，让事件等交互生效

### 2.1 可能需要安装什么（没有就空着）

这一步一般不需要新增运行依赖（`hydrateRoot` 来自 `react-dom` 包内的 `react-dom/client`）。

### 2.2 配置 `config/client.config.js`

```js
const path = require('path')

module.exports = {
  target: 'web',
  mode: process.env.NODE_ENV || 'development',
  entry: path.resolve(__dirname, '../src/client/index.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'client.bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env'],
              ['@babel/preset-react', { runtime: 'automatic' }]
            ]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
}
```

### 2.3 `src/client/index.js`（hydration）

#### 代码

```js
import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import App from '../app'

hydrateRoot(document.getElementById('root'), <App />)
```

#### 作用

- SSR 负责把组件“变成 HTML 字符串”
- hydration 负责在浏览器端“给这份 HTML 绑定事件，让交互生效”

### 2.4 `src/server/index.js`（注入 client.bundle.js + 托管静态资源）

关键点：

- 用 `express.static` 托管 `dist`，让浏览器能访问到 `/client.bundle.js`
- HTML 中注入 `<script src="/client.bundle.js"></script>`，浏览器加载后执行 `hydrateRoot`

在上一节 server 代码基础上改：

```js
const express = require('express')
const path = require('path')
const React = require('react')
import { fileURLToPath } from 'url'
const { renderToString } = require('react-dom/server')

const App = require('../app').default


const __filename = fileURLToPath(import.meta.url)//拿到当前模块文件的 file://... URL
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
        <title>React SSR + Hydration</title>
      </head>
      <body>
        <div id="root">${appHtml}</div>  // 这里注意不要换行，容易报错
        <script src="/client.bundle.js"></script>
      </body>
    </html>
  `)
})

server.listen(3000, () => {
  console.log('React SSR server running at http://localhost:3000')
})
```

### 2.5 package.json 补充，修正和完善

增加 client 的 build/watch，并让 `dev` 同时跑 server/client 的 watch：

```json
{
  "scripts": {
    "build:server": "cross-env NODE_ENV=production webpack -c ./config/webpack.config.js",
    "build:client": "cross-env NODE_ENV=production webpack -c ./config/client.config.js",
    "build": "npm-run-all -s build:server build:client",
      
    // 上面和下面的区别就是上面是production，下面是development（NODE_ENV=production）
    "dev:build:server": "cross-env NODE_ENV=development webpack -c ./config/webpack.config.js -w",
    "dev:build:client": "cross-env NODE_ENV=development webpack -c ./config/client.config.js -w",
    "dev:serve": "nodemon --watch dist --exec node dist/server.bundle.js", 
    "dev": "npm-run-all -p dev:build:server dev:build:client dev:serve"
  }
}
```

验证：

- 页面首屏来自 SSR
- 点击按钮（`count + 1`）能生效（说明 hydration 成功）


###### "dev:serve": "nodemon --watch dist --exec node dist/server.bundle.js", 为什么不要 nodemon client.bundle.js

- 原因

`nodemon` 的职责是：**监听 Node 进程运行的文件变化，然后重启 Node 进程**。

- 我们的 server 进程实际跑的是 `node dist/server.bundle.js`
- `client.bundle.js` 是给浏览器加载的静态资源，它的变化**不会改变 Node 进程的运行逻辑**，因此一般不需要为了它去重启 Node 服务



## 3.merge的使用

- 安装

这里的 merge 指的是 `webpack-merge`：把多个 webpack 配置拆分成 base/server/client 三份再组合。

```bash
npm i -D webpack-merge
```

### 3.1 为什么要拆 base/server/client

- base：公共的 `babel-loader`、`resolve.extensions` 等
- server：`target: 'node'`、entry 指向 `src/server/index.js`、输出 `server.bundle.js`
- client：`target: 'web'`、entry 指向 `src/client/index.js`、输出 `client.bundle.js`

### 3.2 `config/base.config.js`

```js
const path = require('path')

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env'],
              ['@babel/preset-react', { runtime: 'automatic' }]
            ]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  output: {
    path: path.resolve(__dirname, '../dist')
  }
}
```

### 3.3 `config/server.config.js`

```js
const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./base.config')

module.exports = merge(baseConfig, {
  target: 'node',
  entry: path.resolve(__dirname, '../src/server/index.js'),
  output: {
    filename: 'server.bundle.cjs'
  }
})
```

### 3.4 `config/client.config.js`

```js
const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./base.config')

module.exports = merge(baseConfig, {
  target: 'web',
  entry: path.resolve(__dirname, '../src/client/index.js'),
  output: {
    filename: 'client.bundle.js',
    publicPath: '/'
  }
})
```

### 3.5 package.json

```json
  "scripts": {
    "build:server": "cross-env NODE_ENV=production webpack -c ./config/webpack.server.config.cjs",
    "build:client": "cross-env NODE_ENV=production webpack -c ./config/webpack.client.config.cjs",
    "build": "npm-run-all -s build:server build:client",
    "dev:build:server": "cross-env NODE_ENV=development webpack -c ./config/webpack.server.config.cjs -w",
    "dev:build:client": "cross-env NODE_ENV=development webpack -c ./config/webpack.client.config.cjs -w",
    "dev:serve": "nodemon --watch dist --exec node dist/server.bundle.cjs",
   "dev": "npm-run-all -p dev:build:server dev:build:client dev:serve"
```



### 解答：为什么 `client.bundle.js` 不要改成 `.cjs`（但 `server.bundle` 常常要改成 `.cjs`）

#### 1) 先搞清楚：`.cjs` 到底是给谁看的？

- `.cjs` 是 Node.js 的规则：告诉 Node “这个文件按 CommonJS 方式执行”（允许 `require` / `module.exports`）
- 浏览器并不认识 `.cjs` 的“CommonJS 语义”，浏览器只会把它当成一个普通脚本资源去下载并执行

所以：

- `server bundle` 是给 Node 跑的，`.cjs` 很有用
- `client bundle` 是给浏览器跑的，`.cjs` 没意义，反而可能添麻烦

#### 2) 为什么 server bundle 需要 `.cjs`（你遇到过的报错）

你的项目 `package.json` 里有：

```json
"type": "module"
```

含义是：

- 在 Node 环境里，`.js` 默认按 ESM 执行（支持 `import/export`）
- 但 webpack 打出来的 server bundle 默认通常是 CommonJS（内部会有 `require(...)`）

于是会出现经典报错：

- `ReferenceError: require is not defined in ES module scope`

解决思路之一就是：

- 把 server bundle 文件名改为 `.cjs`，例如 `server.bundle.cjs`
- Node 看到 `.cjs` 就会按 CommonJS 执行，`require()` 就合法了

#### 3) 为什么 client bundle 不能（也不推荐）用 `.cjs`

你页面里注入的是：

```html
<script src="/client.bundle.js"></script>
```

浏览器的逻辑是：

- 去请求 `/client.bundle.js`
- 返回 200 才执行；返回 404 就失败

你之前把 webpack client 输出改成了：

- `client.bundle.cjs`

结果就是：

- 浏览器请求 `/client.bundle.js` 找不到（404）
- Express 的 404 往往返回一段 HTML（`Content-Type: text/html`）
- 浏览器把 HTML 当 JS 执行 => 报错：MIME type 是 `text/html`，不能执行

注意：

- 这次报错的本质不是 “`.cjs` 在浏览器一定不能运行”
- 而是：你请求的文件名和实际输出的文件名不一致，导致拿到的是 HTML 404 页面







## 4.React + Router （只有有ssr，那多个页面才有优势因为可以用router）

- 安装

```bash
npm i react-router-dom
```

### 4.2 `src/pages/home.jsx` / `src/pages/about.jsx`

`src/pages/home.jsx`

```jsx
import { useState } from 'react'

export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h2>Home</h2>
      <button onClick={() => setCount(count + 1)}>count: {count}</button>
    </div>
  )
}
```

`src/pages/about.jsx`

```jsx
import { useState } from 'react'

export default function About() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h2>About</h2>
      <button onClick={() => setCount(count + 1)}>count: {count}</button>
    </div>
  )
}
```

### 4.3 `src/router.js`

```jsx
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/home'
import About from './pages/about'

export default function AppRouter() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        {' | '}
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  )
}
```

### 4.4 `src/app.jsx`（只负责“页面壳”）

> 这里不要在 `App` 内直接写 `BrowserRouter`，因为 SSR 时服务端没有浏览器环境。

```jsx
import { useState } from 'react'
import AppRouter from './router'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>React SSR</h1>
      <p>这段内容来自服务端 renderToString</p>
      <button onClick={() => setCount(count + 1)}>count: {count}</button>

      <hr />
      <AppRouter />
    </div>
  )
}
```

### 4.5 `src/client/index.js`（BrowserRouter）

```js
import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from '../app'

hydrateRoot(
  document.getElementById('root'),
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
```

### 4.6 `src/server/index.js`（StaticRouter）

> 核心：服务端渲染时要用 `StaticRouter`，并把当前请求的 `req.url` 传进去。

```js
const express = require('express')
const path = require('path')
const React = require('react')
const { renderToString } = require('react-dom/server')
const { StaticRouter } = require('react-router-dom/server')

const App = require('../app').default

const server = express()
server.use(express.static(path.resolve(__dirname, '../../dist')))

server.get('*', (req, res) => {
  const appHtml = renderToString(
    React.createElement(
      StaticRouter,
      { location: req.url },
      React.createElement(App)
    )
  )

  res.status(200)
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.end(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>React SSR + Router</title>
      </head>
      <body>
        <div id="root">${appHtml}</div>
        <script src="/client.bundle.js"></script>
      </body>
    </html>
  `)
})

server.listen(3000, () => {
  console.log('React SSR server running at http://localhost:3000')
})
```

验证：

- 访问 `/` 和 `/about` 都能拿到 SSR 的 HTML
- hydration 后点击导航能跳转（client 路由接管）



## 5.React SSR + Redux

Redux 在 SSR 场景的核心问题：

- 服务端渲染时要有一份 store（而且**每个请求都要创建自己的 store**，避免串数据）
- 服务端把当次请求的 state 注入到 HTML
- 客户端用这份 state 创建 store，然后再 hydration，保证首屏一致

### 5.1 安装

```bash
npm i react-redux @reduxjs/toolkit
```

### redux toolkit 和 combineReducers 的区别

这两个**不是同一个维度的东西**：

- `Redux Toolkit(RTK)`：一整套官方推荐的工具链/最佳实践集合，用来更简单、更少样板代码地写 Redux
  - 常用：`configureStore`、`createSlice`、`createAsyncThunk`
  - 默认集成：`redux-thunk`、DevTools、更合理的默认配置等
  
- `combineReducers`：Redux 的一个核心 API，用来把多个小 reducer 合并成一个大的 reducer

  - 这是“怎么组合 reducer”的问题
  - 无论你用不用 RTK，都可能用到 `combineReducers`

在 RTK 里最常见的组合方式是直接在 `configureStore` 里写：

```js
configureStore({
  reducer: {
    user: userSlice.reducer,
    counter: counterSlice.reducer
  }
})
```

本质上这等价于你手动 `combineReducers({ user, counter })` 后再创建 store，只是 RTK 帮你把常用配置封装得更顺手。



### 5.2 `src/store/`

- module/counter.js

```js
const { createSlice } = require('@reduxjs/toolkit')

// 创建 counter 相关的 slice：包含 reducer + actions
const counterSlice = createSlice({
  name: 'counter', // 如同vue的pinia中第一个参数即模块的名字
  initialState: { value: 0 },
  reducers: {
    // reducer：处理自增（RTK 内部会用 immer 让你可以“写起来像修改”）
    increment(state) {
      state.value += 1
    }
  }
})

module.exports = {
  counterReducer: counterSlice.reducer,
  counterActions: counterSlice.actions
}
```

- index.js

```js
const { configureStore } = require('@reduxjs/toolkit')
const { counterReducer, counterActions } = require('./module/counter')

// 工厂函数：创建 store（SSR 场景下每个请求都要创建一份新的 store）
function createStore(preloadedState) {
  return configureStore({
    reducer: {
      counter: counterReducer
    },
    preloadedState
  })
}

module.exports = {
  createStore,
  counterActions
}
```

### 5.3 `src/pages/about.jsx` 和 `src/pages/home.jsx` 使用 Redux

> 下面两个页面写法类似：`useSelector` 读数据、`useDispatch` 派发 action。

`src/pages/home.jsx`

```jsx
import { useDispatch, useSelector } from 'react-redux'
import { counterActions } from '../store'

// Home 页面组件：读取 Redux state，并派发 increment action
export default function Home() {
  const value = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div>
      <h2>Home</h2>
      {/* 点击按钮派发 action，让 redux 的 counter +1 */}
      <button onClick={() => dispatch(counterActions.increment())}>
        redux count: {value}
      </button>
    </div>
  )
}
```

`src/pages/about.jsx`

```jsx
import { useDispatch, useSelector } from 'react-redux'
import { counterActions } from '../store'

// About 页面组件：读取 Redux state，并派发 increment action
export default function About() {
  const value = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div>
      <h2>About</h2>
      {/* 点击按钮派发 action，让 redux 的 counter +1 */}
      <button onClick={() => dispatch(counterActions.increment())}>
        redux count: {value}
      </button>
    </div>
  )
}
```

补充说明：

- `dispatch({ type: 'counter/increment' })` 里的 `type` 叫 **action type**，是 Redux 用来“告诉 reducer 要执行哪种更新”的字符串标识
- 用 RTK 时更推荐 `dispatch(counterActions.increment())`

  - 好处：不需要自己手写 `type`，避免拼错
  - `counterActions.increment()` 其实就是帮你生成 `{ type: 'counter/increment' }` 这种 action

action type 从哪里来：

- `createSlice({ name: 'counter', reducers: { increment() {} } })`
- RTK 会自动把 action type 拼出来：`name + '/' + reducerKey`

  - 所以这里就是：`'counter' + '/' + 'increment'` => `'counter/increment'`
- 也就是说：你不写 `type`，而是调用 `counterActions.increment()`，本质是让 RTK 按这个规则帮你生成 action

### 5.4 服务端 SSR：创建 store + Provider 包裹 + 注入 state

`src/server/index.js`（核心逻辑示意）：

```js
const { Provider } = require('react-redux')
const { createStore } = require('../store')

// 需要托管 dist：浏览器才能请求到 /client.bundle.js
// 否则 <script src="/client.bundle.js"></script> 会 404，hydration 就不会执行
server.use(express.static(path.resolve(__dirname, '../../dist')))

// 路由处理函数：每次请求进来都进行一次 SSR，并注入本次请求的 preloadedState
server.get('*', (req, res) => {
  // 为当前请求创建独立 store（避免多个请求共享 state）
  const store = createStore()

  // 使用 Provider 把 store 注入组件树；StaticRouter 用 req.url 决定渲染哪个路由
  // 这一段用 JSX 写可读性更高（前提：你的 server 代码也走 babel/webpack 转换）
  const appHtml = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url}>
        <App />
      </StaticRouter>
    </Provider>
  )

  // 拿到本次请求渲染后的最终 state，用于注入给客户端做 hydration
  const preloadedState = store.getState()

  // window.__PRELOADED_STATE__：把服务端的初始 state 注入到 HTML
  // 目的：客户端创建 store 时用这份 state，保证“首屏一致”，hydration 才不会报错
  // replace(/</g, '\u003c')：避免 JSON 里出现 "</script>" 等导致的 XSS 风险

  // 数据流：
  // 1) server: const preloadedState = store.getState()
  // 2) server: 注入到 window.__PRELOADED_STATE__
  // 3) client: const preloadedState = window.__PRELOADED_STATE__
  // 4) client: createStore(preloadedState)

  res.end(`
    <div id="root">${appHtml}</div>
    <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
    </script>
    <script src="/client.bundle.js"></script>
  `)
})
```

### 5.5 客户端 hydration：用 preloadedState 创建 store

`src/client/index.js`（核心逻辑示意）：

```js
import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from '../app'
import { createStore } from '../store'

// 读取服务端注入的初始 state
const preloadedState = window.__PRELOADED_STATE__
// 基于初始 state 创建客户端 store，让首屏内容与服务端一致
const store = createStore(preloadedState)

// hydration：复用服务端生成的 DOM，并绑定事件/恢复交互
hydrateRoot(
  document.getElementById('root'),
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)
```

### 5.6 其他（踩坑点）

- 服务端必须“每个请求一个 store”，不要把 store 放到模块全局复用
- 注入 `window.__PRELOADED_STATE__` 时要做基础转义（如把 `<` 转成 `\u003c`），避免 XSS
- SSR 输出的 HTML 与客户端首次渲染必须一致，否则会 hydration warning





## 6.redux中编写异步axios

- 安装axios

```bash
npm i axios
```

### 6.2 封装 axios（统一 baseURL/超时/拦截器）

`src/service/request.js`

```js
const axios = require('axios')

// 创建一个 axios 实例，统一配置
const request = axios.create({
  baseURL: 'http://coderbca.com:9060/juanpi/api',
  timeout: 8000
})

// 响应拦截：只返回 data，让调用方更干净
request.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err)
)

module.exports = request
```

### 6.3 用 RTK 编写异步 action（createAsyncThunk）

`src/store/module/home.js`

```js
const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit')
const request = require('../../service/request')

// 异步 thunk：负责发请求 + 返回结果
// 约定：返回值会成为 fulfilled 的 payload
const fetchHomeInfo = createAsyncThunk('home/fetchHomeInfo', async () => {
  const data = await request.get('/homeInfo')
  return data
})

const homeSlice = createSlice({
  name: 'home',
  initialState: {
    homeInfo: null,
    loading: false,
    error: null
  },
  reducers: {},
  // extraReducers：专门处理 createAsyncThunk 自动生成的三种状态
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeInfo.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchHomeInfo.fulfilled, (state, action) => {
        state.loading = false
        state.homeInfo = action.payload
      })
      .addCase(fetchHomeInfo.rejected, (state, action) => {
        state.loading = false
        state.error = action.error
      })
  }
})

module.exports = {
  homeReducer: homeSlice.reducer,
  homeActions: homeSlice.actions,
  fetchHomeInfo
}
```

### 6.4 把 homeReducer 合并进 store

`src/store/index.js`（示意：只展示新增部分）

```js
const { configureStore } = require('@reduxjs/toolkit')
const { counterReducer, counterActions } = require('./module/counter')
const { homeReducer, homeActions, fetchHomeInfo } = require('./module/home')

function createStore(preloadedState) {
  return configureStore({
    reducer: {
      counter: counterReducer,
      home: homeReducer
    },
    preloadedState
  })
}

module.exports = {
  createStore,
  counterActions,
  homeActions,
  fetchHomeInfo
}
```

### 6.5 页面中使用（更可读：只关心“触发 + 展示”）

`src/pages/home.jsx`（示意：只展示新增部分）

```jsx
import { useDispatch, useSelector } from 'react-redux'
import { fetchHomeInfo } from '../store'

export default function Home() {
  const { homeInfo, loading, error } = useSelector((state) => state.home)
  const dispatch = useDispatch()

  function handleLoad() {
    dispatch(fetchHomeInfo())
  }

  return (
    <div>
      <h2>Home</h2>
      <button onClick={handleLoad}>load homeInfo</button>
      {loading ? <p>loading...</p> : null}
      {error ? <p>error: {String(error.message || error)}</p> : null}
      {homeInfo ? <pre>{JSON.stringify(homeInfo, null, 2)}</pre> : null}
    </div>
  )
}
```

### 6.6 SSR 场景怎么“提前拿数据”（进阶但很重要）

如果你想让首屏 HTML 就带上接口数据（更像真正的 SSR），服务端需要在 `renderToString` 前：

- `await store.dispatch(fetchHomeInfo())`

示意：

```js
const { fetchHomeInfo } = require('../store')

server.get('*', async (req, res) => {
  const store = createStore()

  // 在 SSR 之前把数据请求完成（注意：这里是 async handler）
  await store.dispatch(fetchHomeInfo())

  const appHtml = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url}>
        <App />
      </StaticRouter>
    </Provider>
  )

  const preloadedState = store.getState()

  res.end(`
    <div id="root">${appHtml}</div>
    <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
    </script>
    <script src="/client.bundle.js"></script>
  `)
})
```

这样：

- SSR 返回的 HTML 就能直接渲染出 `homeInfo`
- 客户端 hydration 后继续复用同一份数据，不会闪烁/重复请求（是否重复请求取决于你的页面逻辑）



# SSR为什么有利于seo优化

### 本质：爬虫更容易拿到“首屏就有内容”的 HTML

- SSR（Server Side Rendering）：服务器先把页面内容渲染到 HTML 里再返回

  - 好处：搜索引擎爬虫拿到响应的 HTML 时，**就已经包含主要内容**，更容易抓取与建立索引
  - 对用户：首屏更快看到内容（更好的首屏体验）

- CSR（Client Side Rendering）：服务器先返回一个壳（通常 `div#root`）+ JS，内容要等浏览器执行 JS 后才出现

  - 风险：某些爬虫或某些抓取策略下，**不一定会完整执行 JS** 或执行成本高，导致抓取不到核心内容

### 不是“爬虫完全爬不到 CSR”

现在主流搜索引擎（例如 Google）有能力执行部分 JS，但：

- 执行 JS 的成本更高，抓取可能延迟
- 对 SPA 的抓取效果在不同引擎/不同场景不稳定

所以 SSR/SSG 仍然是更稳的 SEO 方案。

### 补充：SSR/SSG/CSR 怎么选

- SSG（Static Site Generation）：构建时把页面生成成静态 HTML

  - SEO 很强、性能也好
  - 适合：内容变化不频繁（文档、博客、营销页）

- SSR：请求时生成 HTML

  - SEO 强
  - 适合：内容需要实时性（个性化、强动态）

- CSR：完全在浏览器渲染

  - 适合：后台管理系统、对 SEO 不敏感的应用

### SSR 也有代价

- 服务器渲染开销更大（CPU/内存）
- 开发复杂度更高（需要处理 hydration、路由、数据预取等）
- 仍然要配合：合理的 `title/description`、结构化数据、站点地图、性能优化等



# 二。邂逅Next.js框架

## 和Nuxt的区别是什么

Next.js 和 Nuxt 的关系可以类比为：

- Next.js：React 生态的全栈框架
- Nuxt：Vue 生态的全栈框架

它们都能做：SSR/SSG/CSR（以及近年的 Hybrid 渲染）。主要区别在生态与“默认最佳实践”。

### 2.路由与约定

- Next.js

  - 约定式路由（`pages/` 或 `app/` 体系）
  - 近年推荐 `app/`（Server Components、Layouts、Streaming 等能力）

- Nuxt

  - 约定式路由（`pages/`）
  - Vue 文件组件（SFC）体验更“开箱即用”

### 3.数据获取/渲染模型

- Next.js

  - `pages` 时代常见：`getServerSideProps/getStaticProps`
  - `app` 时代常见：Server Components + `fetch` + Route Handlers

- Nuxt

  - 常用：`useAsyncData/useFetch` 等组合式数据获取
  - 更强调“在组件里声明数据依赖”的写法

### 4.部署与平台

- Next.js

  - Vercel 官方一体化体验最好（边缘、缓存、函数等）

- Nuxt

  - NuxtLabs + Nitro，适配多种部署目标（Node/Serverless/Edge）
  - 也可部署到 Vercel/Netlify/自建服务器

### 5.Next.js 和 Nuxt3 的相同点

- 都是为“首屏/SEO”而生的框架：SSR 能提升首屏可用内容的输出速度，利于搜索引擎抓取
- 都提供开箱即用的工程化能力（零/少配置也能启动项目）
- 都支持约定式目录结构路由，并且都能做数据获取
- 都支持 TypeScript
- 都能实现：

  - 服务器端渲染（SSR）
  - 静态网站生成（SSG）
  - 客户端渲染（CSR）

- 都是“全栈开发”框架：最终都需要运行在某个服务端环境（Node/Serverless/Edge），不仅仅是前端 SPA

### 6.Next.js 和 Nuxt3 的差别

- Next.js 更偏 React 体系的组合：React +（webpack/turbopack）+ Node（以及各种自选的服务端方案）

  - 实际项目里你可能会看到：React、webpack、Node（以及 express/fastify 等）

- Nuxt3 更偏 Vue 体系的一体化：Vue + Vite + Nitro

  - Nitro 内置服务端运行时，常见会接触到：h3、Nitro、Node（以及多种部署适配）

- Nuxt3 默认提供更强的“自动导入/约定能力”

  - 例如组件、组合式 API、一些工具函数的自动导入（减少手动 import）
  - Next.js 默认不会给到同等级别的自动导入体验（更多依赖你选择的工程方案/第三方库）

- 生态和资料量

  - Next.js 在社区规模、教程、可复用方案方面通常更丰富
  - Nuxt3 在 Vue 生态里体验更统一，尤其是配合组合式 API 的心智模型更顺滑



## 安装next（ts）

- 命令

创建 Next.js 项目（推荐方式，等价于“脚手架”初始化）：

```bash
npx create-next-app@latest
```

### 为什么用 npx？npx 是什么？

- `npx` 是 npm（Node.js）自带的一个工具，可以理解成“临时执行 npm 包里的命令”。
- 它会优先使用：

  - 当前项目 `node_modules/.bin` 里的命令（如果存在）
  - 如果本地没有，就临时下载对应包，执行完后再退出（不需要你全局安装）

所以 `npx create-next-app@latest` 的含义就是：

- 临时下载并执行 `create-next-app@latest` 这个脚手架

使用 `npx` 的原因：

- **不用全局安装**：避免 `npm i -g create-next-app` 带来的全局环境污染
- **版本更可控**：

  - `@latest` 表示使用最新版本
  - 也可以指定版本（例如 `npx create-next-app@14`）

- **减少“版本过旧”问题**：脚手架更新很快，用 `npx` 更容易拿到最新模板/最佳实践

也可以直接指定项目名：

```bash
npx create-next-app@latest my-next-app
```

如果你用 pnpm/yarn：

```bash
pnpm create next-app@latest
```

```bash
yarn create next-app
```

### next 是脚手架吗？是不是安装的是脚手架？

- **create-next-app 是脚手架**：它负责帮你把项目模板（目录结构、依赖、ts/eslint 等可选项）生成出来。
- **next 不是脚手架，它是框架本体**：真正运行 SSR/SSG、路由、构建打包等能力来自 `next` 这个包。



# 三。Next.js项目配置

## 脚手架安装下来各种配置文件的解释

### 1.`.next` 目录是做什么的(你开发不用管)

- `.next` 是 **Next.js 的构建产物/缓存目录**（开发和构建都会生成）。
- 里面通常包含：

  - 编译后的页面代码、运行时代码
  - 路由清单（manifest）
  - 静态资源/代码分割后的 chunk
  - 开发模式下的增量编译缓存

- 一般规则：

  - **不要手动修改** `.next`
  - `.next` **不需要提交 git**（通常在 `.gitignore`）
  - 删除 `.next` 往往可以解决一些“缓存导致的诡异问题”（相当于清一次构建缓存）

### 2.`pages/_app.tsx` 的作用（全局 App 外壳）

- `_app.tsx` 用来 **自定义“所有页面的最外层 React 组件”**。
- 它会包裹每一个页面组件（例如 `pages/index.tsx`、`pages/about.tsx` 等）。
- 常见用途：

  - 注入全局状态（Redux、MobX、Zustand Provider 等）
  - 注入 UI 框架 Provider（如 Antd/Chakra/MUI 的主题）
  - 引入全局样式（如 `styles/globals.css`）
  - 做全局布局（Header/Footer）或路由切换的 loading

注意：

- `_app.tsx` 负责的是“React 组件树”层面的包装，不负责 `<html>`/`<body>` 结构。



### 3.`pages/_document.tsx` 的作用（HTML 文档模板，仅服务端）

- `_document.tsx` 用来 **自定义服务端渲染时输出的 HTML 文档结构**。
- 你可以在这里控制：

  - `<html>`、`<head>`、`<body>` 的结构
  - 额外的 meta/link（比如字体预加载、第三方脚本的放置策略）
  - SSR 相关的样式注入（一些 CSS-in-JS 方案会用到）

关键点：

- `_document.tsx` **只在服务端执行**，不会在浏览器里作为普通组件运行。
- 一般不要在这里写业务逻辑/事件绑定。



### 4.`pages/index.tsx` 的作用（页面入口）

- `index.tsx` 是一个普通的页面组件。
- 在 `pages` 路由体系里：

  - `pages/index.tsx` 对应路由 `/`

类比 Nuxt（Vue）更好理解：

- Next：`pages/index.tsx` => `/`
- Nuxt：`pages/index.vue` => `/`

### 5.现在 Next 目录结构的变化

从 Next.js 13 开始，除了 `pages/` 体系，还新增并推荐使用 `app/` 体系（App Router）：

- `app/page.tsx`：类似 `pages/index.tsx`，**对应 `/`**
  - 所以app/page.tsx和pages/index.tsx不要同时存在，会报错
    - 加了"use client"的前者 效果和后者差不多

- `app/layout.tsx`：类似“全局外壳”，在很多场景下承担过去 `_app.tsx` 的部分职责
- `app/route.ts`：Route Handlers（类似后端接口处理），在很多场景下替代过去 `pages/api/*`

实际项目中 `pages/` 和 `app/` 可以并存，但建议新项目优先按官方推荐使用 `app/` 体系。



### 6.public下的静态资源不会参与打包，直接放到打包文件夹中





## ts.config

- 配置导包的别名

  在 `tsconfig.json` 里配置（核心是 `baseUrl` + `paths`）：

  ```json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"],
        "@components/*": ["src/components/*"],
        "@utils/*": ["src/utils/*"]
      }
    }
  }
  ```

  使用示例：

  ```ts
  import Header from '@/components/Header'
  import { formatDate } from '@utils/date'
  ```

- 原因

  - 你不用写一堆 `../../../` 这种相对路径
  - 项目目录一旦调整，相对路径很容易全线崩；别名更稳定
  - IDE/TS 能更好地跳转、提示、自动补全

- 作用

  - **让 TypeScript（以及 IDE）知道**：`@/xxx` 实际对应哪个真实路径
  - 让 TS 的类型检查、路径跳转、自动导入等能力在别名下仍然正常

- 和webpack.config.js里面配置别名的区别

  - `tsconfig.json` 的 `paths`
  - 主要影响：**TypeScript/IDE 的“类型检查 + 路径解析”**
    - 本质：告诉 TS “这个 import 该去哪里找源码/声明文件”
    
- `webpack.config.js` 的 `resolve.alias`
  
  - 主要影响：**打包时（运行时）模块怎么被解析**
    - 本质：告诉 webpack “这个 import 该打包成哪个真实文件”
  
- 结论：
  
  - 只配 `tsconfig paths`：你在 IDE 里可能不报错/能跳转，但打包/运行可能找不到模块
    - 只配 `webpack alias`：代码能打包运行，但 TS/IDE 可能报错“找不到模块”
  
**在 Next.js 里通常你只要在 `tsconfig.json` 配好别名就够了（Next 会读取 tsconfig/jsconfig 来做解析）**；



## 环境变量

### env	

```
NEXT_PUBLIC_BASE_URL=http://localhost:9999
PORT=9999
HY=MJL

注意
NEXT_PUBLIC_BASE_URL: 'http://localhost:9999',
PORT: '9999',
HY:'MJL' 没效果：
```

Next.js 支持通过 `.env*` 文件来定义环境变量（会被加载进 `process.env`）。

常见文件（按“通用 + 环境专用 + 本机私有”来理解）：

- `.env`

  - 所有环境都会加载（通用默认值）

- `.env.development`

  - 开发环境（`next dev`）加载

- `.env.production`

  - 生产环境（`next build` / `next start`）加载

- `.env.local`

  - 本机私有配置，所有环境都会加载
  - 通常放敏感信息（数据库密码、私有 key 等）
  - 一般要加入 `.gitignore`，不要提交仓库

补充（新版本也常见）：

- `.env.development.local`、`.env.production.local`：更细分的“环境 + 本机私有”

#### 变量命名规则（很关键）

- **默认情况下，只有服务端能拿到环境变量**
- 想要在浏览器端（客户端组件/页面）也能访问：变量名必须以 `NEXT_PUBLIC_` 开头

  - 例如：`NEXT_PUBLIC_BASE_URL=https://api.xxx.com`
  - 非 `NEXT_PUBLIC_` 的变量不要在客户端代码里用，否则要么拿不到，要么造成泄露风险
  
  

#### 如何使用

- 在代码里通过 `process.env.xxx` 访问：

  - `process.env.NEXT_PUBLIC_BASE_URL`
  - `process.env.DB_PASSWORD`（只在服务端用）
  
    ```
    if(typeof window ==='object') {
    	打印.env里面的配置文件会undefined
    } else {
    	终端会打印.env里面的配置文件
    }
    ```

- 在 `app/` 体系里默认是 **Server Components**：

  ```js
  app/pages.tsc 这样在app
  export default function Home() {
    if(typeof window !== 'undefined') { // 这里是false，因为app里面是server环境
      console.log(process.env.PORT,'ss'); // 不会打印
      console.log(process.env.HY);
    } else {
      console.log(process.env.NEXT_PUBLIC_BASE_URL);
      console.log(process.env.PORT);
      console.log(process.env.HY);
    }
    return (
      <div className="Home">
        测试hy
      </div>
    );
  }
  ```

  - 这让“只在**服务端**读取敏感环境变量”更自然（不会被打进客户端 bundle）
  - 但一旦文件写了 `'use client'` 变成 Client Component，就只能安全使用 `NEXT_PUBLIC_` 前缀的变量
  
  具体例子：
  
  - Server Component（默认，不写 `'use client'`）：可以读取敏感变量（只在服务端执行）
  
    ```tsx
    // app/page.tsx
    export default function Page() {
      const dbPassword = process.env.DB_PASSWORD
      return (
        <div>
          <div>server read ok: {dbPassword ? 'has value' : 'empty'}</div>
        </div>
      )
    }
    ```
  
  - Client Component（写了 `'use client'`）：只能用 `NEXT_PUBLIC_` 变量
  
    - 作用就和pages/xx.tsx的作用一样了
  
    ```tsx
    "use client"
    export default function AppHome() {
      if(typeof window !== 'undefined') {
        console.log(process.env.PORT,'ss');// undefined
        console.log(process.env.HY,'HY'); // undefined
        console.log(process.env.NEXT_PUBLIC_BASE_URL,'app');// 取到值
      } else {
        console.log(process.env.NEXT_PUBLIC_BASE_URL,'app');
        console.log(process.env.PORT,'app');
        console.log(process.env.HY);
      }
      return (
        <div className="Home">
          测试hy
        </div>
      );
    }
    
    ```
  
    结果：
  
    - 这个值在浏览器端通常是 `undefined`
    - 更重要的是：敏感信息不应该出现在客户端代码里（有泄露风险）





### next.config

`next.config.js`（或 `next.config.mjs`）里可以写：

```js
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BASE_URL: 'http://localhost:9999', 
    PORT: '9999'// 这里不用想.env里面一样PORT=9999
  }
}

module.exports = nextConfig
```

但是要注意：

- `next.config` 的 `env` 本质是“把值写进构建产物里”（偏向构建期注入）
- **修改后必须重启/重新构建**，否则不会生效
- `env属性` 里配置的变量会被 Next 注入到前端代码中（等价于“可能暴露给浏览器”），因此：
  - **不要在这里放敏感信息**
  - 更推荐把敏感信息放 `.env.local`（只在服务端使用）

#### env（.env*）和 next.config 里的 env：谁会覆盖谁？（后者会覆盖前面）

- `.env*`（以及你在系统/部署平台里配置的环境变量）属于“运行时环境变量”
- `next.config.js` 里的 `env` 更像“构建期写死的常量注入”（会被编译进构建产物）

所以它们不是同一个覆盖链条，最容易踩坑的是：**同一个 key 同时在两处定义**。

建议：

- **同名变量不要两边同时配**（避免你以为改了 `.env` 但页面仍读到构建期注入的旧值，因为next.config的env也会打入到process.env环境中）
- 通用做法：

  - `.env*` / 部署平台环境变量：放运行时配置（尤其是需要按环境变化的值）
  - `next.config env`：只放少量公开且不敏感的“构建期常量”





#### reactStrictMode（严格模式）是什么？要不要配？

- `reactStrictMode: true` 会在开发环境开启 React 的严格模式检查（production 不会有这些额外检查开销）。
- 它不是必须配置项：

  - 很多脚手架模板会默认帮你打开
  - 你也可以显式写出来，方便团队统一认知

严格模式下常见特点（初学者最容易遇到的现象）：

- **开发环境某些逻辑可能会执行两次**（例如组件 render、某些副作用初始化），用于帮助你发现“不纯的渲染/有副作用的代码”。
- 能更早暴露问题：

  - 不安全的副作用
  - 过时 API 的使用
  - 不符合并发渲染的写法

如果你看到“开发环境请求发了两次/日志打印两次”，先确认是不是严格模式导致的（production 通常不会这样）。



## 经典报错

你现在终端里最关键的错误是：

- `App Router and Pages Router both match path: /`
- `skipping / (conflict)`
- 浏览器端也会 `Uncaught Error: ./ App Router and Pages Router both match path: /`

意思是：

app/page.tsx 和 pages/index.tsx 都在抢同一个路由 `/`

在 Next.js 里，**不允许 App Router 和 Pages Router 同时匹配同一路径**，所以就会 500 / 报错。

------

#### 你要怎么改（两种选一个）

##### 方案 A：只验证 App Router（`app/`）

- **删掉或移走** 

  pages/index.tsx

- 然后访问 `/` 就只会走 

  app/page.tsx

##### 方案 B：只验证 Pages Router（`pages/`）

- **删掉或移走** 

  app/page.tsx

- 然后访问 `/` 就只会走 

  pages/index.tsx



### env 和 next.config区别

从“用途”和“安全性/生效时机”来区分更清晰：

- `.env*` 文件（推荐）

  - **用途**：管理不同环境（开发/生产/本机）的变量
  - **优势**：更符合部署习惯（CI/CD、服务器环境变量、容器环境变量都能对齐）
  - **安全**：可以把敏感信息放在 `.env.local` 且不提交仓库
  - **规则明确**：客户端只能用 `NEXT_PUBLIC_` 前缀，减少误泄露

- `next.config.js` 的 `env`

  - **用途**：少量“构建期常量”注入（更像写死配置）
  - **限制**：改了需要重新构建/重启
  - **风险**：容易把敏感信息注入到前端 bundle

所以在新版本 Next.js 的最佳实践里：

- 优先用 `.env*`（或部署平台的环境变量面板）
- `next.config.js` 的 `env` 只放“公开且不敏感”的构建期常量



