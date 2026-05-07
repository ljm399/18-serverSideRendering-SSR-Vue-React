# 一。邂逅SSR

## 1.SPA渲染原理

#### “单页面”的核心特征

“单页面应用（SPA）”强调的是：

- 页面跳转多数由**前端路由**完成
- 跳转时通常**不整页刷新**，而是局部内容更新

它经常与 CSR（Client Side Rendering，客户端渲染）一起出现，但两者关注点不同：

- SPA：应用形态（路由与页面切换方式）
- CSR：渲染发生在客户端（HTML 初始内容少，靠 JS 渲染）

### 1.2 优化版口述（更顺一些）

SPA/CSR 的大致过程是：浏览器先请求页面，服务器先返回一个基础的 HTML（里面通常只有挂载容器和静态资源引用）。然后浏览器继续下载并执行 JS（以及 CSS 等静态资源），前端框架启动后再按需去请求接口数据，拿到数据后在浏览器里生成页面结构并渲染出来。后续在站内跳转时，多数情况下通过前端路由切换视图，不需要整页刷新。

### 1.3 SPA（CSR）渲染流程

#### 1) 首次进入

- 请求 HTML
- 返回基础 HTML（挂载点 + 资源引用）
- 下载 JS/CSS 等静态资源
- 执行 JS：框架初始化、创建应用、挂载
- 请求接口数据（如果需要）
- 客户端生成 DOM 并渲染

#### 2) 后续跳转

- 通过前端路由更新 URL/组件
- 可能再次请求接口数据
- 局部更新视图（一般不触发整页刷新）



### 优势

#### 1) 页面切换体验更顺滑（少整页刷新）

- 通过前端路由切换视图，一般不会像多页应用（MPA）那样每次跳转都整页刷新
- 视觉上更“像 App”，交互更连续

#### 2) 公共资源复用，后续跳转成本更低

- 框架运行时代码、公共组件、样式等通常在首次进入时就加载并缓存
- 后续切换页面更多是“复用已有资源 + 按需请求接口数据”，减少重复加载

#### 3) 更适合做复杂交互与前端状态管理

- 复杂页面之间共享状态更自然（例如登录态、购物车、主题等）
- 更容易做局部更新、组件化开发与工程化拆分

### 劣势

#### 1) 首屏性能压力更大（可能出现白屏/首屏慢）

- 初始 HTML 内容少，首屏依赖 JS 下载与执行完成
- 当 JS 包体积较大、网络较慢或设备性能较弱时，容易出现首屏等待、白屏时间变长

#### 2) SEO 天生不友好（纯 CSR 场景）

- 传统爬虫/部分搜索引擎在只拿到“HTML 壳”时，抓取不到完整内容
- 实际工程中通常需要 SSR/预渲染（Prerender）等方案来改善

#### 3) 资源体积与性能治理要求更高

- SPA 不一定“请求更少”：虽然减少整页刷新，但 JS/CSS 等静态资源可能更大
- 需要配合：代码分割（按路由懒加载）、缓存策略、CDN、压缩、预加载等优化手段

#### 4) 为什么不把所有静态资源都“塞进一个 JS 里”

- 浏览器要运行 SPA，通常需要一个**启动入口**（常见是 HTML 壳里通过 `script src` 引入入口 JS），否则浏览器无法知道从哪里开始加载与执行
- 即使工程上可以把部分资源打包进 JS（例如小图转 base64、用 JS 注入 CSS），但会带来：
  - 缓存粒度变差：JS 一改动会导致整个包的 hash 变化，连带资源都要重新下载
  - 首屏更慢：JS 变大 + 解析/执行更重，CSS 也更晚生效，可能加剧白屏/样式闪烁
  - 并行与优先级更难：通过 HTML 声明的 `link/script` 更利于浏览器并行加载与资源调度
- 常见折中：
  - JS 做代码分割（路由懒加载/按需加载 chunk）
  - CSS 独立成文件并合理拆分，必要时内联少量 critical CSS
  - 小资源按需内联，大资源走 CDN/缓存









## 2.SSR渲染原理（上面有）

- Server-Side Rendering





## SSR,SPA,CSR有什么区别吗


### 1) 先分别定义（它们不是同一维度）

#### SSR（Server-Side Rendering，服务端渲染）

- 关注点：**HTML 在哪里生成**
- 含义：首屏 HTML 主要由服务端生成并返回给浏览器
- 结果：首屏可见更快、对爬虫更友好，但实现复杂度更高

#### CSR（Client-Side Rendering，客户端渲染）

- 关注点：**HTML 在哪里生成**
- 含义：首屏返回 HTML 壳，主要内容由浏览器下载 JS 后在客户端生成
- 结果：开发体验/交互能力强，但首屏依赖 JS，SEO/首屏性能要额外优化

#### SPA（Single Page Application，单页面应用）

- 关注点：**页面切换方式/路由形态**
- 含义：站内跳转多数通过前端路由切换视图，通常不整页刷新
- 结果：切换流畅、体验像 App，但首屏与 SEO 常常需要额外方案

### 2) 它们之间的关系（常见组合）

- 最常见：**SPA + CSR**
  - 首次加载：HTML 壳 + JS 渲染
  - 后续切换：前端路由更新视图
- 另一种：**SPA + SSR（首屏 SSR） + Hydration（客户端激活）**
  - 首次加载：服务端返回带内容的 HTML
  - 浏览器端：加载 JS 后接管页面（绑定事件/恢复响应式）
  - 后续切换：仍然是 SPA 的前端路由
- 也可以不是 SPA：**MPA + SSR**（传统多页：每次跳转都请求新 HTML）

### 3) 一句话对照表

#### 维度对比

- SSR vs CSR：回答“**内容是谁渲染出来的**（服务端还是客户端）”
- SPA vs MPA：回答“**跳转是整页刷新还是前端路由切换**”





## 3.爬虫的原理

### 3.1 爬虫在做什么

**三个阶段**

- 抓取（Crawler/Spider）：负责把网页内容“抓回来”
- 索引（Index）：负责把内容结构化并建立可检索的数据结构
- 检索/排序（Search/Rank）：用户搜索时，从索引里召回并按规则排序返回

### 3.2 搜索引擎的典型流程（抓取 -> 解析 -> 索引 -> 检索）

#### 1) 抓取（发现 URL 并下载页面）

- 从种子 URL 开始，下载页面
- 解析页面中的链接（站内/站外），继续扩展要抓取的 URL
- 这一步获取到的通常是：HTML、响应头、状态码等

#### 2) 解析与清洗（把页面变成“可理解的数据”）

- 解析 HTML 结构（标题、段落、链接、图片的描述等）
- 提取文本内容与重要字段（例如 `title`、`h1/h2`、正文等）
- 去重、反垃圾、质量评估（避免重复内容和低质量页面）

#### 3) 过滤与合规（“筛选”）

- 遵守站点规则：例如 `robots.txt`、`noindex/nofollow` 等指令
- 处理需要登录/授权、反爬策略、访问频控等
- 不可访问或不允许索引的页面，会被跳过或不进入索引

#### 4) 建立索引（把内容放进“索引库”）

- 把页面内容与关键词建立映射（可以理解为：关键词 -> 哪些页面包含它）
- 同时记录页面的各种特征（更新时间、链接关系、权威性、内容质量等）

#### 5) 用户检索与排序（你口述里的“返回数据”）

- 用户输入关键词后，从索引中召回候选页面
- 根据相关性与排序规则（权重/质量/时效/权威等）进行排序
- 返回给用户搜索结果列表

### 3.3 和 CSR/SSR 的关系

- 纯 CSR 往往返回“HTML 壳”，主要内容依赖 JS 执行后才生成
- 如果爬虫不执行 JS 或执行能力有限，抓取到的内容就不完整，导致收录与排序效果变差
- SSR/预渲染可以让首屏 HTML 就包含主要内容，更利于爬虫抓取与建立索引



## 4.SEO优化方案

### 4.1 先明确：搜索结果“排名”大致由什么决定

搜索引擎会综合很多信号来排序，常见包括：

- 页面内容与关键词的相关性（标题、正文、结构等）
- 内容质量与独特性（是否有价值、是否重复/采集）
- 链接关系（站内链接结构、外部网站指向你的链接等）
- 技术可抓取/可索引性（能否抓到、能否解析、是否被禁止收录）
- 页面体验（加载速度、移动端适配、稳定性等）

### 4.2 内容与结构优化

#### 1) 标题层级：不是 H1 越多越好

- 通常建议每个页面有一个清晰的 `h1` 表示页面主题
- 其余用 `h2/h3...` 表达层级结构，帮助搜索引擎理解内容大纲

#### 2) 语义化 HTML 让内容更“可理解”

- 合理使用 `header/nav/main/article/section/footer` 等语义标签
- 正文内容尽量是可直接抓取的文本，而不是只靠图片/Canvas

#### 3) 可读的 URL 与站内信息架构

- URL 结构清晰（层级/语义明确），避免无意义参数堆叠
- 做好面包屑、分类页、聚合页，提升站内可发现性

### 4.3 链接优化（站内链接 + 外链）

#### 1) 站内链接

- 用可点击的超链接把重要页面串起来，帮助爬虫发现与分配权重
- 链接文案（anchor text）尽量能表达目标页面主题

#### 2) 外链与引用

- 指向权威站点不一定直接“加分”，但合理引用能提升内容可信度
- 更重要的是：其他高质量网站指向你的外链，通常对权威性更有帮助

#### 3) 关于 a 标签

- `a` 标签当然可以用 `href` 指向站内/站外页面
- 但 SEO 不是“必须引用别的网站”，核心仍是内容质量与链接结构

### 4.4 页面元信息（meta）与结构化数据

#### 1) `title` / `meta description`

- `title`：很关键，影响展示与点击率，也参与相关性判断
- `meta description`：更多影响摘要展示与点击率（间接影响）

#### 2) `meta keywords`

- 现代搜索引擎通常对 `meta keywords` 权重很低甚至忽略
- 不建议把它当作主要优化手段

#### 3) 结构化数据（Schema.org）

- 可用于商品、文章、面包屑等富文本结果展示（取决于搜索引擎支持情况）

#### 使用案例

把结构化数据以 JSON-LD 的形式放到页面 HTML 中（通常放在 `head` 或 `body` 里都可以）：

```html
<!-- Schema.org JSON-LD 示例：文章页（Article） -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "SSR 与 CSR 的区别",
  "datePublished": "2026-05-06",
  "dateModified": "2026-05-06",
  "author": {
    "@type": "Person",
    "name": "MJL"
  }
}
</script>

<!-- Schema.org JSON-LD 示例：面包屑（BreadcrumbList） -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "首页",
      "item": "https://example.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "SSR",
      "item": "https://example.com/ssr"
    }
  ]
}
</script>
```



### 4.5 技术 SEO：

#### 1) `robots.txt`（放在站点根目录）

- 用来声明哪些路径允许/禁止抓取（例如只允许抓 20 个目录）
- 它主要影响“抓不抓”，不保证“收不收/怎么排”

#### 2) `sitemap.xml`（通常也放根目录）

- 告诉搜索引擎站点有哪些 URL、更新时间等，提升发现效率

#### 3) 规范化与重复内容控制

- 使用 `canonical` 处理重复页面/多 URL 同内容
- 对不希望被收录的页面可使用 `noindex`

## 4.6 CSR/SSR 场景下的 SEO 方案

- 纯 CSR 可能只返回 HTML 壳，爬虫抓取内容不完整
- 解决方案通常是：
  - SSR（服务端渲染）
  - 预渲染（Prerender，构建时生成静态 HTML）
  - 或对关键落地页做 SSR，其余页面保持 CSR



# 二。从零开始搭建SSR应用

## 里面也包括了csr

- **客户端入口**（Hydration + 后续 CSR）
  - `createApp()` 或 `createSSRApp()`（Nuxt/Vue SSR 场景多用 `createSSRApp` 来 hydration）
  - `app.mount('#app')` 这一步之后页面可交互
  - 后续页面行为就是 CSR（SPA runtime）



## 使用框架（或者使用php）

- react：Next.js

- vue3：Next3 || vue2：Next.js

- Angular：Angular universal

  

## createAPP 和 createSSRApp的区别


### 1) 结论先说

- `createApp`：用于 **CSR（浏览器端渲染）** 的应用创建
- `createSSRApp`：用于 **SSR 场景的客户端入口（Hydration/激活）**，让服务端吐出来的 HTML 在浏览器端“接管”并变成可交互

### 2) 它们各自解决的问题

#### `createApp`（典型 CSR）

- 浏览器拿到的 HTML 通常只是一个挂载容器（例如 `<div id="app"></div>`）
- 主要流程：运行 JS -> 创建应用 -> `mount('#app')` -> 在客户端生成 DOM

#### `createSSRApp`（典型 SSR + Hydration）

- 浏览器拿到的 HTML 已经包含服务端渲染出来的内容
- 主要流程：运行 JS -> 创建应用 -> `mount('#app')` -> **对已有 DOM 做 hydration**（复用现有 DOM、绑定事件、恢复响应式）

### 3) 为什么 SSR 场景更推荐用 `createSSRApp`

- SSR 客户端入口不是“从零渲染 DOM”，而是“接管现有 DOM”
- 使用 `createSSRApp` 可以让 Vue 走 hydration 的语义/路径，避免把已有 DOM 当成普通 CSR 重新渲染，从而减少不一致风险

### 4) 常见注意事项（SSR 场景更容易踩坑）

- 必须保证：服务端渲染出来的 HTML 与客户端首次渲染的结果一致（否则会出现 hydration mismatch）
- 避免在创建阶段直接读浏览器对象（`window`/`document`），这些在 Node 端不存在
- 涉及随机数、时间戳、与环境相关的分支逻辑时，要保证服务端与客户端输出一致

### 5) 最小使用示例

#### CSR 入口（浏览器）

```js
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

#### SSR 客户端入口（用于 hydration）

```js
import { createSSRApp } from 'vue'
import App from './App.vue'

createSSRApp(App).mount('#app')
```



## ssr流程图

![](C:\Users\MJL\Desktop\javascript\18-后端渲染-SSR-Vue-React\SSR流程图.png)



## 1.node server(实现图片的1)

- 安装依赖

  - koa

    - 命令

      ```bash
      npm i koa
      ```

  - nodemon

    - 命令

      ```bash
      npm i -D nodemon
      ```

  - webpack webpack-cli webpack-node-externals

    - 命令

      ```bash
      npm i -D webpack webpack-cli webpack-node-externals
      ```

- 配置webpack.config.js

  ```js
  const path = require('path')
  const nodeExternals = require('webpack-node-externals')
  
  module.exports = {
    target: 'node',
    mode: 'development',
    entry: './src/server/index.js',
    output: {
      filename: 'server_bundle.js',
      path: path.resolve(__dirname, '../build/server'),
      libraryTarget: 'commonjs2'//告诉node是commjs导出
      /* 
      commonjs vs commonjs2
      commonjs：偏向 exports.xxx = ...
      commonjs2：偏向 module.exports = ...
      */
    },
    externals: [nodeExternals()]
  }
  
  ```

- 配置koa(server.js)

  ```js
  const Koa = require('koa')
  
  const app = new Koa()
  
  app.use(async (ctx) => {
    ctx.body = `hello world`
  })
  
  app.listen(3000)
  ```





## 2.vue3+SSR（实现图片的2，代码在服务端）

- 安装依赖

  - 命令

    ```bash
    npm i vue @vue/server-renderer
    npm i koa @koa/router
    npm i -D webpack webpack-cli webpack-node-externals webpack-merge
    npm i -D vue-loader @vue/compiler-sfc
    npm i -D babel-loader @babel/core @babel/preset-env
    npm i -D nodemon
    ```

- 改wepak.config.js 为 server.config.js

  - 理由

    - 这个配置文件是专门给“服务端 bundle”用的，命名成 `server.config.js` 更清晰
    - 后面如果要做客户端 bundle（CSR/Hydration），一般还会再有一个 `client.config.js`

  - ```js
    // config/server.config.js
    const path = require('path')
    const { VueLoaderPlugin } = require('vue-loader')
    const nodeExternals = require('webpack-node-externals')
    
    module.exports = {
      target: 'node',
      mode: 'development',
      entry: './src/server/index.js',
      output: {
        filename: 'server_bundle.js',
        path: path.resolve(__dirname, '../build/server')
      },
      externals: [nodeExternals()],
      module: {
        rules: [
          {
            test: /\.vue$/,
            loader: 'vue-loader'
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
      },
      plugins: [new VueLoaderPlugin()]
    }
    ```
    
    - wp.config.js中target：node的作用
      - `target: 'node'` 的意思是：这份 bundle 运行在 Node.js 环境（服务端），不是浏览器
      - 主要影响：
        - webpack 生成的代码会更适配 Node 的模块/运行时（例如 `require`、`__dirname` 等）
        - 不会把一些 Node 内置模块（如 `fs`、`path`）当成浏览器需要 polyfill 的东西去处理
        - 配合 `webpack-node-externals` 时，能把 `node_modules` 里的依赖排除在 bundle 外，减少打包体积、加快构建

- App.vue

  - ```html
    <template>
      <div>
        <h1>Vue3 App</h1>
        <a href="/home">home</a> // 点击会not found
        <a href="/about">about</a>
        <div>App</div>
      </div>
    </template>
    ```

- 导入(main.js / app.js)来使用App.vue

  - ```js
    // src/app.js
    const { createSSRApp } = require('vue')
    const App = require('./App.vue').default
    
    module.exports = function createApp() {
      const app = createSSRApp(App)
      return app
    }
    ```

- 使用createApp封装的理由

  - SSR 场景下每次 HTTP 请求都应该创建一个“全新的 app 实例”
    - 避免跨请求共享状态导致数据串扰（例如 A 用户的状态跑到 B 用户页面上）

  - 把创建逻辑封装成 `createApp()`
    - 服务端渲染时：在路由处理函数里按请求调用 `createApp()`
    - 以后做 hydration/客户端入口时，也可以复用同一套创建逻辑（统一入口，方便扩展路由、store 等）


- server.js

  ```js
  // src/server/index.js
  const Koa = require('koa')
  const Router = require('@koa/router')
  const createApp = require('../app').default
  const { renderToString } = require('@vue/server-renderer')
  
  const app = new Koa()
  const router = new Router()
  
  router.get('/', async (ctx) => {
    const vueApp = createApp()
    const appStringHtml = await renderToString(vueApp)
  
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
        </body>
      </html>
    `
  })
  
  app.use(router.routes())
  app.use(router.allowedMethods())
  app.listen(3000)
  ```

- package.json

  ```json
  {
    "scripts": {
      "build:server": "webpack --config ./config/server.config.js --watch",
      "start": "nodemon ./build/server/server_bundle.js"
    }
  }
  ```

- 执行命令

  ```bash
  npm run build:server
  npm run start
  ```



### 报错：'import' and 'export' may appear only with 'sourceType: module' (1:0)

#### 解决

```js
app.js改为
const { createSSRApp } = require('vue')
const App = require('./App.vue').default

module.exports = function createApp() {
  const app = createSSRApp(App)
  return app
}

index.js
const createApp = require('../app') 
```



## 报错：Feature flag __VUE_PROD_HYDRATION_MISMATCH_DETAILS__ is not explicitly defined. 

```js
解决
  plugins: [
    new VueLoaderPlugin(),
    new DefinePlugin({
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
```







# 问题：库是 ESModule 导出，能不能用 CommonJS 导入？

## webpack 会帮你做模块转换

- webpack 对 ESM/CJS 的互操作也有一套处理逻辑，所以很多写法在工程里是“可混用”的。



# 问题：为什么const App = require('./App.vue').default有时有没有default

**取决于“你拿到的模块导出形态是不是 ESModule default 导出”。**

​	为什么 `.vue` 常常要 `.default`	

在 webpack + `vue-loader` 打包后，`App.vue` 通常会被编译成 **ESModule 的默认导出**：

```js
export default { ... }
```

- 所以要加default
- 因为拿到的往往是一个“模块对象”，默认导出挂在 `default` 上，所以要default

要是 module.export = xx （commjs默认导出）时就不用加default



# 问题：为什么const App = require('./App.vue').default 可以导入es，而有时又不行呢

- 归因就是webpack.config.js的rule解析

  ```js
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              sourceType: 'unambiguous',
              parserOpts: { sourceType: 'unambiguous' },
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        }
      ]
    },
  ```

  - 之前vue那个可以，是因为
    - `App.vue` 并不是浏览器/Node 能原生识别的文件
    - `vue-loader` 会把 `.vue` 编译成一个 **JS 模块**
    - 这个模块通常以 **ESModule 默认导出**的形式输出：`export default ...`
    - webpack 在打包时支持 **CJS/ESM 互操作**（interop）
  - 但js却不可以，因为babel.loader要设置才能接受混用es和commjs即设置 sourceType: 'unambiguous'
    - 但设置了也没效果
      - “ESM 解析”链路就是不稳定（可能是 babel-loader 对配置项识别/缓存/或解析路径导致的），继续纠结会一直卡进度
    - 所以推荐js全用commjs导入就行



# 提醒：解决问题后要重新打包（即要执行3段命令）才有效果

```js
pnpm run build:client
pnpm run build:server
pnpm run server
```





## 3.vue3 SSR + Hydration(水合) （激活，图片3和4，代码在客户端）

### 为什么要激活

- 因为注入的是string，是静态的，所以页面点击不会有效果

```js
  const vueApp = createApp()
  const appStringHtml = await renderToString(vueApp)
```



- 配置client/index.js(app.js里面是createSSRApp)

  ```js
  // src/client/index.js
  const createApp = require("../app.js")
  // hydration：接管服务端已经渲染好的 DOM
  const app = createApp()
  app.mount('#app')
  ```

- 修改server/index.js

  ```js
  // src/server/index.js
  const Koa = require('koa')
  const Router = require('@koa/router')
  const serve = require('koa-static')
  const path = require('path')

  const createApp = require('../app')
  const { renderToString } = require('@vue/server-renderer')

  const app = new Koa()
  const router = new Router()

  // 把客户端 bundle 暴露出去，让浏览器能下载到 client_bundle.js
  app.use(serve(path.resolve(__dirname, '../../build')))

  router.get('/', async (ctx) => {
    const vueApp = createApp()
    const appStringHtml = await renderToString(vueApp)

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
          <script src="/client/client_bundle.js"></script>// 导入了clinet的包，所以使用使先给client打包再运行
        </body>
      </html>
    `
  })

  app.use(router.routes())
  app.use(router.allowedMethods())
  app.listen(3000)
  ```

- 添加client.config.js

  ```js
  // config/client.config.js
  const path = require('path')
  const { VueLoaderPlugin } = require('vue-loader')

  module.exports = {
    target: 'web',
    mode: 'development',
    entry: './src/client/index.js',
    output: {
      filename: 'client_bundle.js',
      path: path.resolve(__dirname, '../build/client')
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        }
      ]
    },
    plugins: [new VueLoaderPlugin()]
  }
  ```

- package.config.js

  ```json
  {
    "scripts": {
      "build:server": "webpack --config ./config/server.config.js --watch",
      "build:client": "webpack --config ./config/client.config.js --watch",
      "start": "nodemon ./build/server/server_bundle.js"
    }
  }
  ```

  - 额外依赖（如果你用到了 `koa-static`）

    ```bash
    npm i koa-static
    ```

- 执行命令

  ```bash
  npm run build:server
  npm run build:client
  npm run start
  ```



### 为什么 server 和 client 都用 `createSSRApp`

## 1) Server 端：为了把组件渲染成 HTML 字符串

- 在 Node 里创建 app 实例
- `renderToString(app)` 得到 HTML
- 返回给浏览器

这一步用 `createSSRApp` 或 

createApp **都能生成 HTML**，但 SSR 官方推荐用 `createSSRApp` 来表达“这是 SSR 应用”，并与客户端保持一致（同构一致性更强）。



## 2) Client 端：为了对服务端 HTML 做 Hydration（最关键）

浏览器拿到的不是空壳，而是：

```html
<div id="app">...服务端渲染好的 DOM...</div>
```

客户端再次创建 app 并 `mount('#app')` 时：

- 用 **`createSSRApp`**：Vue 会尝试 **复用现有 DOM + 绑定事件 + 恢复响应式**（hydration）
- 用 createApp：更偏向“从零渲染”，可能导致：
  - hydration mismatch 警告
  - 直接重建 DOM（闪烁、性能差、事件绑定异常）

所以**客户端必须用 `createSSRApp`**（在 SSR + hydration 的模式下）。




## 跨请求污染

### 概念

- 跨请求污染（Cross-request state pollution）指的是：在 SSR 服务端渲染时，多个用户的请求在同一个 Node 进程里处理
- 如果把应用实例、路由、store 或者某些“可变状态”写成了**单例/模块级全局变量**，就可能被不同请求复用
- 结果：A 用户请求产生的状态，可能影响到 B 用户返回的 HTML（数据串了）

### 案例

- 反例（错误示意）：
  - 在模块顶层只创建一次 app/store：
    - `const app = createSSRApp(App)`
    - `const store = createStore()`
  - 之后每次请求都复用同一个实例
- 可能出现的现象：
  - A 用户登录后把用户名写进 store
  - B 用户访问时，服务端渲染出来的 HTML 里也带上了 A 的用户名
  - 或者路由/缓存数据被上一个请求“遗留”，导致页面内容错乱

### 解决办法

- 每个请求创建新实例（核心原则）
  - 用函数封装：`createApp()` 每次调用都返回新的 app
  - 如果有 router/store，也在 `createApp()` 里一并创建并返回（每请求一套）
- 避免模块级可变状态
  - 不要把会变的数据放在模块顶层（例如数组、对象缓存、计数器）并在请求间复用
  - 确实需要缓存时，要么做“只读缓存”，要么按请求隔离（例如挂到 `ctx` 上）
- 需要共享的只共享“无状态/只读”的东西
  - 例如组件定义、工具函数、常量配置等





## 4.先使用webpack-merge对两个配置文件合并

- 安装命令

  - 命令

    ```bash
    npm i -D webpack-merge
    ```

  - 命令-d 和 不加 -d区别

    - `-D`（或 `--save-dev`）表示把依赖安装到 `devDependencies`
    - 不加 `-D` 表示安装到 `dependencies`
    - 一般像 `webpack`、`webpack-merge`、`loader` 这类只在构建阶段使用的包放 `devDependencies`

- base.config.js

  ```js
  // config/base.config.js
  const { VueLoaderPlugin } = require('vue-loader')
  const { DefinePlugin } = require('webpack')

  module.exports = {
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      // 让 Vue 的编译开关在打包期就确定下来（有利于体积与性能）
      new DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false
      })
    ]
  }
  ```

- server.config.js

  ```js
  // config/server.config.js
  const path = require('path')
  const { merge } = require('webpack-merge')
  const nodeExternals = require('webpack-node-externals')
  const baseConfig = require('./base.config')

  module.exports = merge(baseConfig, {
    target: 'node',
    entry: './src/server/index.js',
    output: {
      filename: 'server_bundle.js',
      path: path.resolve(__dirname, '../build/server')
    },
    externals: [nodeExternals()]
  })
  ```

- client.config.js

  ```js
  // config/client.config.js
  const path = require('path')
  const { merge } = require('webpack-merge')
  const baseConfig = require('./base.config')

  module.exports = merge(baseConfig, {
    target: 'web',
    entry: './src/client/index.js',
    output: {
      filename: 'client_bundle.js',
      path: path.resolve(__dirname, '../build/client')
    }
  })
  ```

- package.json

  ```js
  {
    "scripts": {
      "build:server": "webpack --config ./config/server.config.js --watch",
      "build:client": "webpack --config ./config/client.config.js --watch",
      "start": "nodemon ./build/server/server_bundle.js"
    }
  }
  ```

- 执行命令

  ```bash
  npm run build:server
  npm run build:client
  npm run start
  ```

  



## 5.vue3 SSR集成Router

- 安装依赖

  - 命令

    ```bash
    npm i vue-router
    ```

- views/home.vue 和 view/about.vue

  ```vue
  <!-- src/views/home.vue -->
  <template>
    <div class="app" style="border: 1px solid green; margin: 10px">
      <h2>Home</h2>
      <div>{{ count }}</div>
      <button @click="addCounter">+1</button>
    </div>
  </template>

  <script setup>
  import { ref } from 'vue'

  const count = ref(100)
  function addCounter() {
    count.value++
  }
  </script>

  <!-- src/views/about.vue -->
  <template>
    <div class="app" style="border: 1px solid blue; margin: 10px">
      <h2>About</h2>
      <div>{{ count }}</div>
      <button @click="addCounter">+1</button>
    </div>
  </template>

  <script setup>
  import { ref } from 'vue'

  const count = ref(300)
  function addCounter() {
    count.value++
  }
  </script>
  ```

- App.vue 使用两个vue页面

  ```
  <template>
    <div class="app" style="border: 1px solid red">
      <h2>Vue3 App</h2>

      <div>
        <router-link to="/">
          <button>home</button>
        </router-link>
        <router-link to="/about">
          <button>about</button>
        </router-link>
      </div>

      <router-view />
    </div>
  </template>
  ```

- router/index.js

  ```js
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
  
  ```

- 修改server/index.js

  ```js
  // src/server/index.js（关键是 memory history + push + isReady）
  const { createMemoryHistory } = require('vue-router')
  const createRouter = require('../router').default

  router.get(/.*/, async (ctx) => {// (.*) 用来匹配所有路径，作为 SSR 的兜底路由
    const vueApp = createApp()
    const appRouter = createRouter(createMemoryHistory())
    vueApp.use(appRouter)

    await appRouter.push(ctx.url || '/')
    await appRouter.isReady()

    const appStringHtml = await renderToString(vueApp)

    ctx.type = 'text/html'
    ctx.body = `...<div id="app">${appStringHtml}</div>...`
  })
  ```

  - 这里用 `createMemoryHistory()` 是因为服务端没有浏览器环境（没有真正的地址栏）
  - `push + isReady` 是为了等路由把当前路径对应的组件解析/加载完，再进行 `renderToString`

- 修改client/index.js

  ```js
  // src/client/index.js（关键是 web history + isReady 后 mount）
  const { createWebHistory } = require('vue-router')
  const createApp = require("../app")
  const createRouter = require("../router").default
  
  const app = createApp()
  const router = createRouter(createWebHistory())
  app.use(router)
  
  router.isReady().then(() => {
    app.mount('#app')
  })
  
  ```

​	





## 6.vue3 SSR集成pinia

- 安装pinia

  - 命令

    ```bash
    npm i pinia
    ```

- 使用pinia

  - store/home.js

    ```js
    const { defineStore } = require('pinia')
    
    const useHomeStore = defineStore('home', {
      state() {
        return {
          count: 0
        }
      },
      actions: {
        increment() {
          this.count++
        },
        decrement() {
          this.count--
        }
      }
    })
    
    module.exports = {
      useHomeStore
    }
    
    module.exports.default = useHomeStore
    ```

  - 修改home.vue和about.vue

    - 这个不用改为commjs，因为vue文件使用vue-loader，js才使用babel-loader
    
    ```vue
    <script setup>
    import { storeToRefs } from 'pinia'
    import { useHomeStore } from '../store/home'
    
    const homeStore = useHomeStore()
    const { count } = storeToRefs(homeStore)
    
    function addCounter() {
      homeStore.increment()
    }
    </script>
    ```
    

- 引入pinia

  - server/index.js

    ```js
    // src/server/index.js（在渲染前安装 pinia）
    const { createPinia } = require('pinia')

    router.get('(.*)', async (ctx) => {
      const vueApp = createApp()

      const appRouter = createRouter(createMemoryHistory())
      vueApp.use(appRouter)
      await appRouter.push(ctx.url || '/')
      await appRouter.isReady()

      const pinia = createPinia()
      vueApp.use(pinia)

      const appStringHtml = await renderToString(vueApp)
      ctx.type = 'text/html'
      ctx.body = `...<div id="app">${appStringHtml}</div>...`
    })
    ```

  - client/index.js

    ```js
    // src/client/index.js（在 mount 前安装 pinia）
    import { createPinia } from 'pinia'
    
    const app = createApp()
    
    const router = createRouter(createWebHistory())
    app.use(router)
    
    const pinia = createPinia()
    app.use(pinia)
    
    router.isReady().then(() => {
      app.mount('#app')
    })
    ```

### 解释为什么server和client都要引入pinia

- 服务端引入 pinia：为了让 store 参与 SSR
  - SSR 渲染时会执行组件的渲染逻辑，如果组件里用到了 `useXxxStore()` / `storeToRefs()`，那么服务端必须先 `app.use(pinia)`，否则渲染阶段拿不到 store（或拿到的不是你预期的 store）
  - 服务端渲染出来的 HTML 会把“当时 store 的状态”体现在页面内容上

- 客户端引入 pinia：为了让页面在 hydration 后还能继续响应
  - 浏览器端接管页面后，点击、事件、状态更新都发生在客户端，同样需要 `app.use(pinia)` 才能正常读写 store
  - 如果只在服务端装 pinia，客户端没有装，页面会出现：初始内容有了，但交互/状态更新不工作或报错

- 同构一致性（完整 SSR 的关键点）
  - 理想情况下：客户端首次接管时的 store 初始状态应该和服务端渲染时一致
  
  -  hydration mismatch问题
  
    - 客户端 hydration 时会再次运行一遍组件渲染逻辑，如果客户端 store 初始 state 不同，就会出现：
      - 首屏 HTML 内容与客户端首次渲染结果不一致（hydration mismatch）
      - 轻则 Vue 警告 + 局部重渲染，重则页面闪烁/事件绑定异常
  
  - **hydration mismatch 的根因**：客户端 hydration 时的首次渲染结果与服务端 HTML 不一致（通常来自 state/数据不同步）
  
    - **解决**：服务端和客户端都应使用 `createSSRApp`，客户端才能对服务端 HTML 做 hydration 接管；如果客户端误用 createApp，可能导致 hydration mismatch问题

      



# 三。邂逅Nuxt3框架

### 相当于全栈了

## 1.认识Nuxt3

- 在「二。从零开始搭建SSR应用」里我们手写了：
  - Node 服务（Koa）接收请求
  - 服务端创建 Vue 应用实例（`createSSRApp`）
  - 结合 Router/Pinia，按 URL `push + isReady`
  - `renderToString` 生成 HTML 并返回
  - 客户端加载 `client_bundle.js` 做 Hydration 激活
- Nuxt3 做的事情就是：把上面这套 SSR/路由/数据获取/构建与部署流程“框架化/自动化”
  - 你仍然在写 Vue 组件和页面，但很多工程细节（打包、路由、SSR 入口、数据预取、约定式目录）由 Nuxt 帮你统一处理

### 作用

- 提供“开箱即用”的 SSR/SSG（预渲染）能力
  - 默认就能做首屏服务端渲染 + 客户端激活
- 约定式路由
  - 基于 `pages/` 自动生成路由，不用手写 `router/index.js`
- 更完整的工程化能力
  - 构建、代码分割、资源优化、运行时配置、部署形态（Node/Serverless/Edge 等）
- 更好的 SEO 与首屏体验（相对纯 CSR）



###  底层运行 / 渲染核心

- **Vue 3**：Nuxt 的基础引擎，所有组件、响应式、模板语法都基于 Vue 3 实现（这是 Nuxt 的 “骨架”）。
- **Nitro**：Nuxt 3 全新的服务引擎（也叫 Server Engine），负责处理服务端渲染、API 路由、跨平台部署（支持 Node.js、Serverless、Workers 等），替代了 Nuxt 2 的 `server-middleware` 体系，是 Nuxt 3 高性能的核心。
  - serverless就是不用你在服务器部署，cdn，域名解析那些，它自动帮你完成
- **Vue Router**：内置的路由引擎，自动根据 `pages/` 目录生成路由规则，无需手动配置。

###  构建 / 打包引擎

- **Vite**（默认）：Nuxt 3 首选的构建工具引擎，负责开发时的热更新、代码编译，生产环境的打包（速度比 Webpack 快很多）。
- **Webpack**（可选）：兼容传统的构建引擎，若项目需要兼容旧插件，可切换为 Webpack 构建。
- **esbuild**：底层代码转译引擎，用于快速编译 TypeScript/ES6+ 代码，提升构建速度。



### 渲染模式

- ssg（Static Site Generation，静态站点生成 / 预渲染）
  - 产出时机
    - 构建时就把每个页面渲染成静态 HTML 文件
  - 优点
    - 首屏很快（直接返回 HTML）
    - SEO 友好（内容在 HTML 里）
    - 部署简单（更像静态资源，可上 CDN）
  - 缺点
    - 内容更新需要重新构建/重新发布（不适合强实时内容）
  - 适用
    - 文档站、博客、活动页、内容更新频率不高的站点
  - Nuxt3 对应
    - `nuxi generate` / `npm run generate`

- ssr（Server Side Rendering，服务端渲染）
  - 产出时机
    - 每次请求（或缓存命中前）在服务端把页面渲染成 HTML 返回
  - 优点
    - 首屏快 + SEO 友好
    - 内容可实时（请求时渲染）
  - 缺点
    - 服务端压力更大（需要运行 SSR 服务）
    - 实现更复杂（同构、状态同步、缓存等）
  - 适用
    - 需要 SEO + 内容动态变化（电商、资讯、运营活动等）
  - Nuxt3 对应
    - 默认就是 SSR（除非你配置成纯 CSR 或 generate）

- csr（Client Side Rendering，客户端渲染）
  - 产出时机
    - 首屏通常返回 HTML 壳，主要内容由浏览器下载 JS 后渲染
  - 优点
    - 交互体验好（SPA 体验）
    - 服务端相对简单（可以只托管静态资源）
  - 缺点
    - 首屏依赖 JS（弱网下白屏更明显）
    - SEO 需要额外方案（SSR/预渲染）
  - 适用
    - 后台管理系统、对 SEO 不敏感的应用
  - Nuxt3 对应
    - 可以配置为纯 CSR（禁用 SSR），本质上退化成 SPA

- 常见组合
  - SSR + Hydration：首屏 SSR，客户端接管后变成 SPA 体验
  - SSG + Hydration：构建时预渲染，客户端接管后仍可交互





## 2.环境的搭建

- 安装Nuxt-脚手架

  - npm

    ```bash
    npx nuxi@latest init nuxt-app
    ```

  - pnpm

    ```bash
    pnpm dlx nuxi@latest init nuxt-app
    ```

  - **`minimal`**：最干净的 Nuxt 项目骨架（最适合你现在“从零理解 SSR/Nuxt 原理”这个目标）
  - **`content`**：带 `@nuxt/content` 的内容站点模板（偏文档/博客）
  - **`module`**：用来开发 Nuxt 模块的模板（不是做业务应用的）
  - **`ui`**：集成 Nuxt UI 的应用模板（会多一堆 UI 相关依赖）

  - 推荐**选 `minimal`**

  - 理由：

    - **依赖最少、结构最清晰**

    - 更适合你后面要对照 SSR 原理、逐步加 router/pinia/数据请求等内容

- 安装依赖

  - npm

    ```bash
    cd nuxt-app
    npm i
    ```

  - pnpm

    ```bash
    cd nuxt-app
    pnpm i
    ```

- 记得安装插件

  - volar，prettre，eslint


## 3.介绍目录结构

![](C:\Users\MJL\Desktop\javascript\18-后端渲染-SSR-Vue-React\nuxt目录结构分析.png)

- package.json里面script介绍

  - 常见 scripts（Nuxt3）
    - `dev`
      - 启动开发服务器（本地开发 + 热更新）
    - `build`
      - 生产构建（输出 `.output` 或构建产物，具体取决于 Nuxt 版本/配置）
    - `preview`
      - 用生产构建产物启动一个预览服务（用于本地验证 build 后的效果）
    - `generate`
      - 静态站点生成（SSG/预渲染，输出静态 HTML）

- 入库文件 app.vue

  - `app.vue` 是应用根组件
    - 类似传统 Vue 项目的根组件，但在 Nuxt 中它处于“应用壳”的位置
    - 页面内容通常由 Nuxt 的路由页面渲染出来（一般会在内部渲染 `NuxtPage`）
  - 常见用途
    - 放全局布局骨架（header/footer）
    - 放全局组件（例如 `NuxtLayout`、`NuxtPage` 的容器）
    - 放全局样式引入或一些全局逻辑（但要注意 SSR 环境差异）

- components目录

  - `components/` 用来放可复用组件
  - Nuxt 默认支持自动导入（Auto import）
    - 组件文件放在 `components/` 后，很多情况下可以在模板里直接使用组件名，不需要手动 `import`
  - 常见习惯
    - 页面级组件通常放 `pages/`
    - 复用型/通用组件放 `components/`
    - 如果组件只属于某个页面/模块，也可以在页面目录下就近放置，避免 `components/` 过度膨胀

- package-lock.json
  - 公司一般要锁定，否则某个版本更新，导致公司业务受到影响
- 其他用到就知道了

## 4.运行时的配置

#### 即配置全局变量

- nuxt.config.ts

  ```ts
  // nuxt.config.ts
  export default defineNuxtConfig({
    runtimeConfig: {
      appKey: 'DEFAULT_APP_KEY',
      public: {
        baseURL: 'http://localhost:3000'
      }
    }
  })
  ```

  - `runtimeConfig` 分两块
    - `runtimeConfig`（私有）：只在服务端可用（不要放到浏览器里）
    - `runtimeConfig.public`（公开）：服务端和客户端都可用

- 使用

  - app.vue

    ```vue
    <template>
      <div>
        <div style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; margin-top: 12px;">
          <div>public.baseURL: {{ runtimeConfig.public.baseURL }}</div>
        </div>
        <NuxtWelcome />
      </div>
    </template>
    
    <script setup>
    const runtimeConfig = useRuntimeConfig()
    console.log('runtimeConfig', runtimeConfig)
    if (process.server) {
      console.log('hy[server]的runtimeConfig.appKey:', runtimeConfig.appKey)
      console.log('hy[server]的runtimeConfig.public.baseURL:', runtimeConfig.public.baseURL)
    }
    
    // 判断是client方法一
    if (process.client) {
      console.log('hy方法一[client] runtimeConfig.public.baseURL:', runtimeConfig.public.baseURL)
    }
    
    // 判断是client方法二
    if (typeof window !== 'undefined') {
      console.log('hy方法二[client] runtimeConfig.public.baseURL:', runtimeConfig.public.baseURL)
    }
    </script>
    ```

- .env

  ```bash
  NUXT_APP_KEY=DDDDDD
  NUXT_PUBLIC_BASE_URL=http://localhost
  PORT=9090
  ```

  - Nuxt 会把环境变量映射到 `runtimeConfig`
    - `NUXT_APP_KEY` -> `runtimeConfig.appKey`
    - `NUXT_PUBLIC_BASE_URL` -> `runtimeConfig.public.baseURL`
  - 优先级（你这里理解成“覆盖”即可）
    - 运行时环境变量（例如 `.env` / 部署平台注入）会覆盖 `nuxt.config.ts` 里写的默认值
    - 所以 `.env` 里的值通常优先级更高

- script配置port

  ```json
    "scripts": {
      "build": "nuxt build",
      "dev": "nuxt dev",
      "dev:8080": "nuxt dev --port 8080",
      "dev:9090": "set PORT=9090&& nuxt dev",
      "generate": "nuxt generate",
      "preview": "nuxt preview",
      "postinstall": "nuxt prepare"
    },
  ```
  
  - `--port 8080`：通过 Nuxt CLI 参数指定端口
  - `PORT=9090 nuxt dev`：通过环境变量指定端口
  - Windows 注意
    - 在 Windows 上直接写 `PORT=9090 nuxt dev` 可能不生效，常见做法是用 `cross-env` 或者 `set PORT=9090&& nuxt dev`



### 测试client和server 执行 npm run preview

#### 控制台是client，终端是server



