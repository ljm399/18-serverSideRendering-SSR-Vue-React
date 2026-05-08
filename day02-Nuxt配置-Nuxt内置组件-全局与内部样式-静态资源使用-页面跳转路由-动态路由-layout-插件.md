# 一。Nuxt的配置

## 即nuxt.config.js里面

## day01 里面讲了运行时的配置即runtimeConfig



## 1.appConfig

- 使用场景

  - **全局常量配置**：站点标题、主题色、默认分页大小、UI 相关常量等（不会在运行时变化）。
  - **给业务组件提供默认值**：例如接口前缀、默认语言、功能开关（非敏感）。
  - **需要在服务端 + 客户端都能读取**，并且希望在代码里有统一入口（`useAppConfig()`）。

- 作用

  - `appConfig` 用来放“应用级的静态配置”。它会被打包到客户端代码中，所以**不要放密钥、密码**。
  - 在任意组件/页面通过 `useAppConfig()` 读取，类型推导友好。

  对比：

  - `runtimeConfig`：偏“运行时配置”，可以被环境变量覆盖；包含私有/公开两部分。
  - `appConfig`：偏“构建时/静态配置”，通常写死在代码里（适合常量、主题、文案等）。
    - 简述
    - appConfig定义**环境变量**
    - runtimeConfig则是**全局变量**

- 使用

  - nuxt.config.ts

    ```ts
    // nuxt.config.ts
    export default defineNuxtConfig({
      appConfig: {
        title: 'Nuxt App',
        theme: {
          primary: '#42b883'
        },
        api: {
          prefix: '/api'
        }
      }
    })
    ```

  - app.vue

    ```vue
    <template>
      <div>
        <div>title: {{ appConfig.title }}</div>
        <div>theme.primary: {{ appConfig.theme.primary }}</div>
        <div>api.prefix: {{ appConfig.api.prefix }}</div>
      </div>
    </template>

    <script setup lang="ts">
    const appConfig = useAppConfig()
    </script>
    ```

  - appConfig可以提取出来

    - app.config.ts

      ```ts
      // app.config.ts
      export default defineAppConfig({
        title: 'Nuxt App (from app.config.ts)',
        theme: {
          primary: '#4f46e5'
        },
        api: {
          prefix: '/api'
        }
      })
      ```

      - 如果 `nuxt.config.ts` 里也写了 `appConfig`，会进行合并；同名字段以app.config.ts的配置为准





## 2.app.head

- 作用

  - 配置**全站通用**的 `<head>` 内容：`title`、`meta`、`link`、`script`、`htmlAttrs`、`bodyAttrs` 等。
  - 常用于：SEO（标题/描述/关键词/OG）、favicon、全局引入第三方脚本（统计、监控）、全局 `lang` 等。

- 使用场景
  - seo优化
  - 全局 favicon / manifest
  - 全局引入第三方脚本（例如埋点 SDK）
  - 全局设置 `html` / `body` 的属性（如 `lang`、`class`）

- 使用方式
  
  - 方式一：nuxt.config.ts
  
  
  ```ts
  // nuxt.config.ts
  export default defineNuxtConfig({
    app: {
      head: {
        title: 'Nuxt App',
        meta: [
          { charset: 'utf-8' },
          { name: 'viewport', content: 'width=device-width, initial-scale=1' },
          { name: 'description', content: 'My Nuxt App description' }
        ],
        link: [
          { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ],
        htmlAttrs: {
          lang: 'zh-CN'
        }
      }
    }
  })
  ```
  
  - 方式二：app.vue里面的script的useHead
  
  
  ```vue
  <script setup lang="ts">
  useHead({
    title: 'Home - Nuxt App',
    meta: [
      { name: 'description', content: 'Home page description' }
    ]
  })
  </script>
  ```
  
  
  
  - 方式三 ：app.vue的template的< Head>或者引入的标签大写就行
  
  ```vue
  <template>
    <div>
      <Head>
        <Title>Home - Nuxt App</Title>
        <Meta name="description" content="Home page description" />
      </Head> 
      <NuxtPage />
    </div>
  </template>
  ```
  
  - 可以不需要Head来包裹，直接
  
    ```vue
    <template>
      <NuxtPage />
      <Title>mjlcode - Nuxt App</Title>
      <Meta name="description" content="Home page description hymjlcode" />
    </template>
    ```
  
- 测试方式
  - f12->element->会看到你添加的属性在head

    - 有时你会觉得“没在 head 里看到”，常见原因：
      - 你改的是 `bodyAttrs` / `noscript` 等配置，本来就会出现在 body。
      - 如果想判断是否 **SSR 输出**了 head：
        - 打开 Network -> 找到 Document（返回的 html）-> Preview/Response，看源码里是否已有对应的 `<title>`/`<meta>`。

- 优先级

  - 一般理解：越“局部”的优先级越高。
  - 常见覆盖顺序（从低到高）：
    - `nuxt.config.ts` 里的 `app.head`（全局默认）
    - `app.vue` / `layouts/*` 里的 `useHead` / `<Head>`
    - `pages/*`（单页）里的 `useHead` / `<Head>`（最常见的“单页 SEO”）



- 上面的都是应用到每个页面的
  - 要是想应用单个页面方法

    - 在 `pages/xxx.vue` 里写 `useHead()` 或 `<Head>` 即可，只影响当前页面。
      - 注意这里不是app.vue里面，而是pages/里面



## 3.ssr

- true（默认）
  - 使用场景

    - SSR（服务端渲染）：首屏 HTML 由服务端生成，再在浏览器进行 hydration。
    - 适合：
      - SEO 要求高（内容型站点）
      - 首屏性能要求高（需要更快看到内容）
      - 需要服务端能力（鉴权、BFF、数据预取）

- false是
  - 使用场景

    - SPA（纯客户端渲染）：首次返回的 HTML 基本是壳子，数据/页面主要靠浏览器 JS 渲染。
    - 适合：
      - 后台管理系统（SEO 不重要）
      - 页面主要依赖浏览器能力，且希望部署更简单（纯静态托管也能跑）

  配置方式（写在 nuxt.config.ts）：

  ```ts
  export default defineNuxtConfig({
    ssr: true
  })
  ```

  怎么测试是否 SSR：

  - Network -> Document -> Response/Preview：
    - 如果 HTML 里已经有你的页面内容（不是只有一个空 div），说明 SSR 生效。
    - 如果 HTML 基本没有内容，主要靠 JS 运行后才出现，说明更偏 CSR。



## 4.router

- 使用场景

  - 配置路由行为：滚动行为、激活 class、strict、hash 模式等。
  - 需要自定义 Vue Router 的 `scrollBehavior`。
  - 想给 `NuxtLink` 统一设置 active class。

使用

- `app/router.options.ts`

  ```ts
  import type { RouterConfig } from '@nuxt/schema'
  
  export default <RouterConfig>{
    // 作用：使具有跳转功能的比如有to=“/”的nuxtLink的样式突显，注意单纯个<NuxtLink>是没效果的
    linkActiveClass: 'active',
    linkExactActiveClass: 'exact-active',
     
    // 自定义滚动（通过改变url，来跳转）
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) return savedPosition // 后退/前进回到原位置，点击左上角返回触发
      if (to.hash) { // 滚动到对应锚点元素（可 smooth，如下放to="/#bottom"是到id='bottom'）
        return {
          el: to.hash,
          behavior: 'smooth'
        }
      }
      return { top: 0 }// 否则返回顶部
    }
  }
  ```

- ```vue
  <template>
    <div>
      <div style="display: flex; gap: 12px; padding: 12px; border: 1px solid #ddd; border-radius: 8px; margin-top: 12px;">
        <NuxtLink to="/#bottom">To Bottom</NuxtLink>
      </div>
      <NuxtLink>占位Home</NuxtLink> // 没效果，因为没有路由功能比如to
  
      <div style="height: 1200px;"></div>
      <div id="bottom">Bottom
        <NuxtLink to="/">Home</NuxtLink>
      </div>
    </div>
  </template>
  
  <style>
  .active {
    color: #fff;
    background: #333;
    padding: 2px 6px;
    border-radius: 4px;
  }
  
  .exact-active {
    outline: 2px solid #333;
  }
  </style>
  ```



## 5.userHead



# 二。Nuxt3的内置组件

- comps是component的缩写

## 1.SEO相关的内置组件：Head MeteLink。。



## 2.NuxtLayout



## 3.NuxtPage

- 使用方式

  - `NuxtPage` 通常放在 `app.vue` 或 `layouts/default.vue` 里，用来渲染当前路由匹配到的页面组件。
  - 页面路由来源于 `pages/` 目录的文件结构（约定式路由）。

- 使用代码

  - app/app.vue

    ```vue
    <template>
      <div>
        <header style="padding: 12px; border-bottom: 1px solid #ddd;">
          <NuxtLink to="/">Home</NuxtLink>
          <span style="margin: 0 8px;">|</span>
          <NuxtLink to="/about">About</NuxtLink>
        </header>

        <main style="padding: 12px;">
          <NuxtPage />
        </main>
      </div>
    </template>
    ```

  - pages/index.vue

    ```vue
    <template>
      <div>
        <h1>Index Page</h1>
        <div>time: {{ new Date().toLocaleString() }}</div>
      </div>
    </template>
    ```
  
  - pages/about.vue（补充一个页面，便于测试路由切换）

    ```vue
    <template>
      <div>
        <h1>About Page</h1>
      </div>
    </template>
    ```
  
    



## 4.ClientOnly

- 作用：内部的标签只能客户端渲染

  - 常用在：
    - 依赖浏览器 API 的组件（`window`/`document`/`localStorage`）
    - 只在客户端可用的第三方库（图表、富文本、地图等）
    - 与 SSR 不兼容的组件（会导致 hydration mismatch）

### 怎么判读是客户端渲染还是服务器渲染

#### 方式 A（最推荐）：直接看 “查看网页源代码”（查看源代码就是服务器返回的代码）

1. 浏览器打开 `http://localhost:3000/client-only`（**在地址栏输入并回车**，不要只点页面里的 NuxtLink）
2. 右键空白处
3. 点 **查看网页源代码 / View page source**
4. 搜索 `loading...`

**预期：**

- 能搜到 `loading...`（SSR 输出的 fallback）
- 搜不到 `只在客户端显示：...`（slot 内容只在客户端渲染）

> 这个方式不受 devtools 过滤条件影响，也不会被 HMR/模块请求干扰。

#### 方式 B：Network 里抓 Document（关键是“强制整页刷新到该路由”）

1. 地址栏直接输入：`http://localhost:3000/client-only` 并回车
2. 打开 DevTools -> Network
3. 勾选 **Disable cache**
4. **按住刷新按钮**（Chrome）选择 **Empty cache and hard reload（清空缓存并硬性重新加载）**
5. 这次你会看到一条：
   - **Type = document**
   - Name 通常是 `(index)` 或 `client-only` 或者就是 `localhost`
6. 点进去看 Response，搜索 `loading...`





### 使用代码

```vue
<template>
  <ClientOnly fallback-tag="h3" fallback="loading...">
    <div>
      只在客户端显示：{{ new Date().toLocaleString() }}
    </div>
  </ClientOnly>
</template>
```

- fallback作用

  - `fallback` / `fallback-tag`：在 SSR 阶段或客户端组件未挂载前显示的占位内容。
  - 这样可以避免 SSR 输出为空导致页面闪烁，或避免 SSR 直接执行不兼容代码。







# 三。全局样式和局部样式

## 全局样式设置的2种方式

1. app/app.vue的style里面设置
   - 使用代码

      ```vue
      <template>
        <div>
          <NuxtPage />
        </div>
      </template>
      
      <style>
      /* 这里不写 scoped，就是全局样式 */
      body {
        margin: 0;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
      }
      
      a {
        color: #4f46e5;
      }
      </style>
      ```

2. nuxt.config.ts里面设置

   - 使用代码

     ```ts
     export default defineNuxtConfig({
         css:["@css的文件路径","@css的文件路径"]
     })
     ```

     - 比如

       ```css
       // 建议放在：assets/styles/main.css
       // nuxt.config.ts 里写：css: ['~/assets/styles/main.css']
       ```

       `assets/styles/main.css` 示例：

       ```css
       :root {
         --primary: #4f46e5;
       }
       
       html,
       body {
         height: 100%;
       }
       
       body {
         margin: 0;
         font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
         background: #fff;
         color: #111827;
       }
       
       a {
         color: var(--primary);
         text-decoration: none;
       }
       
       a:hover {
         text-decoration: underline;
       }
       ```

       ```scss
       // 建议放在：assets/styles/global.scss
       // nuxt.config.ts 里写：css: ['~/assets/styles/global.scss']
       ```

       `assets/styles/global.scss` 示例：

       ```scss
       /* 变量 */
       $container-max: 960px;
       $border: #e5e7eb;
       $radius: 8px;
       $space-2: 8px;
       $space-3: 12px;
       $btn-bg: #f9fafb;
       $btn-bg-hover: #f3f4f6;
       
       /* 函数：px -> rem */
       @function rem($px, $base: 16px) {
         @return ($px / $base) * 1rem;
       }
       
       /* mixin：复用样式块 */
       @mixin flex-center($gap: 0) {
         display: inline-flex;
         align-items: center;
         gap: $gap;
       }
       
       @mixin button-base {
         border: 1px solid $border;
         border-radius: $radius;
         cursor: pointer;
       }
       
       /* 使用 */
       .container {
         max-width: $container-max;
         margin: 0 auto;
         padding: rem($space-3);
       }
       
       .btn {
         @include flex-center($space-2);
         @include button-base;
       
         padding: rem($space-2) rem($space-3);
         background: $btn-bg;
       }
       
       .btn:hover {
         background: $btn-bg-hover;
       }
       ```

      补充：

      - `assets/` 下的样式会被 Vite 处理（支持 sass/less 等预处理）。
      - `public/` 下的文件不会被打包处理，适合纯静态资源。
   
     
   
     
   

###   scss解释

- 安装

  - pnpm i scss -d

  - 为什么是-d

  - #### 1) 需要 sass 的阶段：**编译阶段（build time）**

    - 你的 `.scss` 要在 **构建时** 被 Vite/Nuxt 编译成 `.css`
    - 这个编译发生在：
      - 本地 `pnpm run dev`
      - CI/CD `pnpm run build`
    - 也就是说：`sass` 是 **构建工具链依赖**，不是运行时依赖

    所以从依赖语义上，`sass` 属于 **devDependencies** 很合理。

    #### 2) 运行阶段（runtime）不需要 sass

    - 真正线上跑起来（`node .output/server/index.mjs` 或 `nuxt preview`）时
    - 浏览器加载的已经是编译后的 CSS
    - **不会在服务器上再去解析 SCSS** 因此 runtime 不需要 `sass`。

- 作用

  - SCSS 是 Sass 的一种语法，属于 CSS 预处理器。
  - 提供变量、嵌套、混入、函数、模块等能力，适合维护大型样式。

- 优势

  - 变量复用（颜色/间距统一管理）
  - 嵌套结构更贴近组件结构（但不建议嵌套太深）
  - mixin / function 抽象重复样式逻辑

- 使用要导入对应loader

  - 在 Nuxt(Vite) 下使用 SCSS，一般只需要安装 `sass`。
  - 不需要手动配置 webpack loader（除非你做了很深的自定义构建）。


## 局部样式的设置

- 直接 vue 单文件组件的 `<style scoped>` 里设置（只影响当前组件）

  ```vue
  <template>
    <div class="box">scoped box</div>
  </template>
  
  <style scoped>
  .box {
    padding: 12px;
    border: 1px solid #ddd;
  }
  </style>
  ```

  补充：

  - `scoped` 是通过给当前组件 DOM 节点打上 data-attr 来实现“样式隔离”，并不是真正的 CSS 沙箱。
  - 如果你要“局部但可穿透子组件”，可以用 `:deep()`（例如 `:deep(.child)`）。

#### 知识点：导入局部样式

##### 手动导入

```vue
<style scoped lang="scss">
	@use "~/assets/styles/variables.scss" as *;

	/* 旧写法（不推荐） */
	/* @import "~/assets/styles/variables.scss"; */

	.box {
	  color: $primary;
	}
    或
    @use "~/assets/styles/variables.scss" as * 或 as vb
</style>
```

- as * 和 as vb的作用和区别

  - `as *`：把模块里的变量/混入直接“摊平”到当前文件作用域，例如直接用 `$primary`。
  - `as vb`（自定义命名空间）：需要通过命名空间访问，例如 `vb.$primary`。
  - 建议：多人协作/大项目用命名空间（`as vb`）更安全，避免变量名冲突；小项目用 `as *` 更省事。

- @use和@import，推荐@use的理由

  - `@import`：旧语法，容易造成重复引入、全局污染、难以追踪变量来源。
  - `@use`：新语法（Dart Sass 推荐），有命名空间、更明确的模块化机制。



##### 自动导入

先配置nuxt.config.ts

```ts
export default defineNuxtConfig({
    css:['~/assets/styles/main.css','~/assets/styles/global.scss'],
    vite:{
     css:{
		preprocessorOptions:{
                scss:{
                    additionalData: '@use "~/assets/styles/variables.scss" as *;'
                }
            }
	}
    }
})
```

- 作用

  - 相当于在每一个 `lang="scss"` 的 `<style>` 顶部自动注入一段 scss（比如变量/混入），这样每个组件里都能直接使用 `$primary` 等。
    ```vue
    <style scoped lang="scss">
        // @use "~/assets/styles/variables.scss" as * 或 as vb这段注释就行，因为自动就有
    </style>
    ```
  
  
  注意：
  
  - 这要求你已经安装了 `sass`（Dart Sass）。
  - 如果没装，编译会报错，需要安装依赖（例如 `pnpm add -D sass`）.





# 四。静态资源的导入和使用

## 比如图片

### 图片在public文件下

- 使用

  - 假设文件在：`public/images/logo.png`

  ```vue
  <template>
    <div>
      <img src="/images/logo.png" alt="logo" width="120" />
    </div>
  </template>
  ```



### 图片在assets下

- 使用

  - 假设文件在：`assets/images/logo.png`
  - 说明：`assets/` 下资源会被构建工具处理（hash、压缩等），适合参与打包的资源。

  ```vue
  <template>
    <div>
      <img :src="~/assets/images/logo.png" alt="logo" width="120" />
    </div>
  </template>
  ```
  
  

### 图片作为模块导出

- 使用

  - 场景：你想把静态资源统一管理（例如 `assets/images/index.ts` 集中导出）。

  - `assets/images/index.ts`

    ```ts
    import logoUrl from './logo.png'

    export { logoUrl }
    ```

  - 页面/组件中使用

    ```vue
    <template>
      <img :src="logoUrl" alt="logo" width="120" />
    </template>
    
    <script setup lang="ts">
    import { logoUrl } from '~/assets/images'
    </script>
    ```



## 字体icon那些

### 先去下载源码，拿到下载后文件夹中的ttf和css文件就行

### 然后在nuxt.config.ts里面注册为全局css

假设你下载的字体图标库文件结构类似：

- `assets/fonts/iconfont.ttf`
- `assets/fonts/iconfont.css`

在 `nuxt.config.ts` 里全局引入 css：

```ts
export default defineNuxtConfig({
  css: ['~/assets/fonts/iconfont.css']
})
```

在组件中直接用 class：

```vue
<template>
  <div>
    <i class="iconfont icon-home" />
  </div>
</template>
```

补充：

- 如果你的 `iconfont.css` 里用的是相对路径引用 ttf/woff，确保路径相对关系是正确的。





# 四。页面跳转

## 脚手架创建新nuxt项目命令

- 推荐（Nuxt 官方脚手架）：

  ```bash
  npx nuxi@latest init my-nuxt-app // 这里是npx，会向内找不会向外找，刚好满足你的要求
  cd my-nuxt-app
  pnpm install
  pnpm dev
  ```


## 1.新建页面的方式

- Nuxt 是**约定式路由**：在 `pages/` 目录下创建 `.vue` 文件即可自动生成路由。
- 例子：

  - `pages/index.vue` -> 路由 `/`
  - `pages/about.vue` -> 路由 `/about`
  - `pages/user/[id].vue` -> 动态路由 `/user/123`
- 而不用自己写router/index那些

### 使用

- `app.vue` 通常写全局布局骨架 + `<NuxtPage />`（渲染当前页面）。

  ```vue
  <template>
    <div>  
      <nav style="padding: 12px; border-bottom: 1px solid #ddd;">
        <NuxtLink to="/">Home</NuxtLink>
        <span style="margin: 0 8px;">|</span>
        <NuxtLink to="/about">About</NuxtLink>
      </nav>

      <main style="padding: 12px;">
        <NuxtPage />
      </main>
    </div>
  </template>
  ```

- `pages/index.vue` 示例：

  ```vue
  <template>
    <div>
      <h1>Index Page</h1>
    </div>
  </template>
  ```

- `pages/about.vue` 示例：

  ```vue
  <template>
    <div>
      <h1>About Page</h1>
    </div>
  </template>
  ```





## 2.组件的方式跳转

### NuxtLink

### NuxtLink组件的属性

- to

  - 作用：内部路由跳转（推荐用于站内页面）。

  - 类型：字符串 / 路由对象。

  - 示例：

    ```vue
    <template>
      <NuxtLink to="/about">About</NuxtLink>
      <NuxtLink :to="{ path: '/user/123', query: { from: 'home' } }">User</NuxtLink>
    </template>
    ```

- href

  - 作用：更偏向外部链接（或你想明确当成普通链接处理）。

  - 示例：

    ```vue
    <template>
      <NuxtLink href="https://nuxt.com" target="_blank">Nuxt 官网</NuxtLink>
    </template>
    ```

- replace

  - 作用：用 `history.replaceState` 替换当前记录（不会新增一条 history 记录）。
  - 使用场景：登录页跳到首页，不希望用户点返回回到登录页。

  ```vue
  <template>
    <NuxtLink to="/" replace>Go Home</NuxtLink>
  </template>
  ```

- activeClass

  - 作用：当前链接命中路由时，添加的 class（覆盖默认 active class）。

  - 示例：

    ```vue
    <template>
      <NuxtLink to="/about" active-class="link-active">About</NuxtLink>
    </template>
    ```

- target

  - 作用：同 `<a>` 的 `target`，常见：`_blank` 新窗口打开。

    - target值介绍

      - `_self`：默认值，在当前标签页打开。
      - `_blank`：在新标签页/新窗口打开。
      - `_parent`：在父级浏览上下文打开（主要用于 iframe 场景）。
      - `_top`：在最顶层浏览上下文打开（跳出所有 iframe）。
      - `frameName`：在指定 name 的 iframe 中打开（较少用）。

      注意：

      - 使用 `target="_blank"` 打开外部站点时，建议同时加 `rel="noopener noreferrer"`，避免被新窗口拿到 `window.opener`（安全风险）。

  - 示例：

    ```vue
    <template>
      <NuxtLink href="https://example.com" target="_blank">External</NuxtLink>
    </template>
    ```

- 使用

  - 站内页面跳转（推荐）：

    ```vue
    <template>
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/about">About</NuxtLink>
    </template>
    ```

  - 外部链接：

    ```vue
    <template>
      <a href="https://nuxt.com" target="_blank">（外部链接用 a 也可以）</a>
    </template>
    ```

### 为什么跳转不推荐用a标签

- 用 `<a href="/about">` 进行站内跳转，浏览器会发起一次完整的页面请求：

  - 会刷新页面（重新请求 HTML/CSS/JS）
  - 客户端状态会丢失（例如 pinia 状态、未保存的表单输入等）
  - 性能更差（整页刷新）

- 用 `<NuxtLink to="/about">`：

  - 走前端路由（SPA 导航），不整页刷新
  - Nuxt 还能做预取（prefetch，提升跳转体验）
  - 更符合 Nuxt 的路由体系（active class、replace、路由对象等）



## 3.使用编程方式跳转

### naviateTo

- 使用场景

  - 在 `script` 里根据条件跳转：登录成功后跳首页、没登录跳登录页。
  - 点击按钮/提交表单后跳转（不是用 `<NuxtLink>`）。
  - 需要携带 query / params。
  - 需要“替换历史记录”（`replace: true`）。

- 使用

  ```vue
  <template>
    <button @click="goAbout">去 About</button>
  </template>
  
  <script setup lang="ts">
  const goAbout = () => {
    navigateTo('/about')
  }
  
  const goUser = () => {
    navigateTo({ path: '/user/123', query: { from: 'home' } })
  }
  
  const goHomeReplace = () => {
    navigateTo('/', { replace: true })
  }
  
  const goExternal = () => {
    navigateTo('https://nuxt.com', { external: true })
  } // 外部链接要加 { external: true }，否则会被当成站内路由处理
  </script>
  ```

### useRouter

- 相对naviateTo的优势

  - `useRouter()` 是 Vue Router 实例，API 更底层、更完整。
  - 适合需要访问路由器能力的场景：
    - 自定义复杂导航逻辑
    - 手动控制历史记录（`back/forward/go`）
      - navigate没有回退这些
    - 注册全局导航守卫（`beforeEach/afterEach`）

- 常用api
  - back

    - 返回上一页，相当于浏览器后退。

  - forward

    - 前进一页。

  - go

    - `router.go(n)`：`n` 为正前进、为负后退。

  - push（推荐用navigateTo，支持行更好）

    - `router.push(...)`：跳转并新增历史记录。

  - replace

    - `router.replace(...)`：跳转并替换当前历史记录。

  - beforeEach

    - 全局前置守卫：每次路由跳转前触发。

  - afterEach

    - 全局后置钩子：每次路由跳转后触发。

- 使用

  ```vue
  <template>
    <button @click="router.back()">返回</button>
    <button @click="goAbout">push 去 About</button>
    <button @click="goHomeReplace">replace 去 Home</button>
  </template>
  
  <script setup lang="ts">
  const router = useRouter()
  
  const goAbout = () => {
    router.push('/about')
  }
  
  const goHomeReplace = () => {
    router.replace('/')
  }
  </script>
  ```

  导航守卫建议写在哪：

  - 更推荐用 Nuxt 的路由中间件（`middleware/`）来做鉴权等逻辑。
  - 如果你确实要用 `router.beforeEach`，通常放在插件里（`plugins/router-guard.client.ts`）更合适，避免组件重复注册。



# 五。动态路由和嵌套路由

## 5.1 动态路由

- Nuxt3 和 Vue Router 一样支持动态路由。
- 在 Nuxt3 中，动态路由也是通过 `pages/` 目录结构 + 文件命名**自动生成**的。



### 传递动态路由参数（params）

#### 动态路由语法（[] 方括号）

- 页面组件目录或页面组件文件都支持 `[]` 语法。
- `[]` 里面写动态参数名。

常见写法：

- `pages/detail/[id].vue` -> `/detail/:id`
- `pages/detail/user-[id].vue` -> `/detail/user-:id`
- `pages/detail/[role]/[id].vue` -> `/detail/:role/:id`
  - 可以是pages/[role]/[id].vue 但pages一般里面有多个路由组件，你这样写辨识度太差，而且容易重叠和失效

- `pages/detail-[role]/[id].vue` -> `/detail-:role/:id`

#### 案例：`pages/detail-[role]/[id].vue` -> `/detail-:role/:id`

- 目录结构：

  ```txt
  pages/
    detail-[role]/
      [id].vue
  ```

- app.vue（提供几个入口链接，方便测试）

  - 通过 `NuxtLink` / `navigateTo` 传参：


  ```vue
  <template>
    <div>  
      <NuxtLink to="/detail-admin/10010">/detail-admin/10010</NuxtLink>
      <br />
      <NuxtLink :to="{ path: '/detail-user/10086', query: { name: 'liujun' } }">
        /detail-user/10086?name=liujun
      </NuxtLink>
      <NuxtPage />
    </div>
  </template>
  ```

- `pages/detail-[role]/[id].vue`

  ```vue
  <template>
    <div>
      <h2>detail-[role]/[id]</h2>
      <div>role: {{ String(route.params.role) }}</div>
      <!-- 访问 /detail-admin/10010 时：role = admin -->
      <div>id: {{ String(route.params.id) }}</div>
      <!-- 访问 /detail-admin/10010 时：id = 10010 -->
      <div>name(query): {{ route.query.name }}</div>
      <!-- 访问 /detail-user/10086?name=liujun 时：name = liujun -->
    </div>
  </template>
  
  <script setup lang="ts">
  const route = useRoute()
  </script>
  ```



### 查询字符串参数（query）

- 通过 URL `?key=value` 传参。
- 例如：`/detail/10010?name=liujun`

### 在目标页面获取 params / query

```vue
app.vue
<template>
  <NuxtLink to="/detail/10010">/detail/10010</NuxtLink>
  <NuxtLink :to="{ path: '/detail/10010', query: { name: 'liujun' } }">带 query</NuxtLink>
</template>


pages/[role]/[id].vue
<script setup lang="ts">
const route = useRoute()

// 当访问 /detail/10010 时
console.log(route.params.id) // "10010"

// 当访问 /detail/10010?name=liujun 时
console.log(route.query.name) // "liujun"
</script>
```

注意：

- `route.params` 用来拿动态路由参数（路径里的那段）。
- `route.query` 用来拿查询字符串参数（`?` 后面）。





## 5.2 slug

### 使用

#### 局部

- 局部捕获所有路由：在某个目录下使用 `pages/xxx/[...slug].vue`。
- 例子：
  - 文件：`pages/detail/[...slug].vue`
  - 匹配：
    - `/detail/1/2`
    - `/detail/a/b/c`
  - **不匹配**：`/detail`（因为 `[...slug]` 至少要有 1 段）

#### 全局

- 全局捕获所有路由：直接用 `pages/[...slug].vue`。
- 匹配：
  - `/a`
  - `/a/b`
  - `/detail/1/2`

案例404

- 常见做法：用全局捕获 `pages/[...slug].vue` 来做“兜底页面”（你也可以在这里展示 404）。
- 但 Nuxt 更标准的 404/错误页是 `error.vue`（或 `app/error.vue`），捕获路由只是其中一种实现方式。

补充：**可选捕获**

- `pages/detail/[[...slug]].vue`（双层中括号）表示 slug 可为空：
  - 匹配 `/detail`（slug 为空）
  - 也匹配 `/detail/a/b`

### 打印slug，是个数组

- 在 `[...slug].vue` 页面里：

  ```vue
  <template>
    <div>
      <div>slug: {{ slug }}</div>
    </div>
  </template>
  
  <script setup lang="ts">
  const route = useRoute()
  const slug = computed(() => route.params.slug)
  
  // 访问 /detail/a/b/c
  // route.params.slug -> ['a', 'b', 'c']
  console.log('slug:', route.params.slug)
  </script>
  ```



## 5.3 路由匹配规则

路由匹配需要注意的事项（优先级从高到低）：

1. 预定义路由（静态路由）优先于动态路由

   - `pages/detail/create.vue` 会匹配：`/detail/create`

2. 动态路由优先于捕获所有路由（slug）

   - `pages/detail/[id].vue` 会匹配：
     - `/detail/1`
     - `/detail/abc`
   - 但不会匹配：
     - `/detail/create`（会被上面的静态路由抢先匹配）
     - `/detail/1/1`（两段了，不符合 `[id]`）
     - `/detail/`（空段）

3. 捕获所有路由（`[...slug]`）最后兜底

   - `pages/detail/[...slug].vue` 会匹配：
     - `/detail/1/2`
     - `/detail/a/b/c`
   - 但不会匹配：
     - `/detail`（除非写成 `pages/detail/[[...slug]].vue`）
       - 目前[...slug]功能已具备[[...slug]]功能



## 5.4 路由的嵌套

编写嵌套路由步骤：

1. 创建一个一级路由页面，例如：`pages/parent.vue`
2. 创建一个与一级路由同名同级的文件夹，例如：`pages/parent/`
3. 在 `pages/parent/` 下创建二级路由页面

   - `pages/parent/child1.vue` -> `/parent/child1`
   - `pages/parent/child2.vue` -> `/parent/child2`
   - `pages/parent/index.vue` -> `/parent`（二级路由默认页面）

4. 需要在 `parent.vue` 中添加 `<NuxtPage />` 作为二级路由的占位

目录结构示例：

```txt
pages/
  parent.vue
  parent/
    index.vue
    child1.vue
    child2.vue
```

`pages/parent.vue` 示例：

```vue
<template>
  <div>
    <div>Page: Parent</div>
    <div>
      <NuxtLink to="/parent">
        <button>default child(index)</button>
      </NuxtLink>
      <NuxtLink to="/parent/child1">
        <button>child1</button>
      </NuxtLink>
      <NuxtLink to="/parent/child2">
        <button>child2</button>
      </NuxtLink>
    </div>

    <!-- 嵌套二级路由占位 -->
    <NuxtPage />
  </div>
</template>
```

`pages/parent/index.vue` 示例（默认二级路由页面）：

```vue
<template>
  <div>Parent Default Child (index.vue)</div>
</template>
```

`pages/parent/child1.vue` 示例：

```vue
<template>
  <div>Parent Child1</div>
</template>
```

`pages/parent/child2.vue` 示例：

```vue
<template>
  <div>Parent Child2</div>
</template>
```



## 5.5 中间件
### 作用
中间件（Route Middleware）用于在“进入某个页面/路由之前”执行一段逻辑，常见用途：

- 鉴权（未登录跳转到 login）
- 权限控制（role/菜单权限）
- 路由拦截/重定向（例如强制 https、老路径兼容）
- 埋点统计（每次路由变化上报）

Nuxt3 中间件函数签名：`(to, from) => {}`。

如何“终止”中间件（终止本次导航）：
- 方式1：`return navigateTo('/xxx')`（重定向，本次导航被中断，转而导航到目标页面）
- 方式2：`return abortNavigation()`（直接中断，不跳转；可选传 message）
- **注意**：`return null / return true / return ''`：不会终止导航（等价于不拦截，继续执行后续中间件/继续进入页面）

### 局部（命名中间件 / 页面级使用）

- 命名规范
  - 放到 `middleware/` 目录
  - 文件名就是中间件名，例如 `middleware/logger.ts` => 名字为 `logger`

- 使用
  - 在页面里用 `definePageMeta({ middleware: 'logger' })`
  - 多个中间件：`definePageMeta({ middleware: ['logger', 'auth'] })`

示例：3个中间件（命名中间件 + 页面内联中间件 + 鉴权中间件）

`middleware/logger.ts`

```ts
export default defineNuxtRouteMiddleware((to, from) => {
  console.log('[logger]', { from: from.fullPath, to: to.fullPath })
})
```

`pages/about.vue`（第二个中间件直接写在页面里，并立刻生效）

```vue
<script setup lang="ts">
definePageMeta({
  middleware: [
    'logger',
    // 第二个：页面内联中间件（无需创建 middleware 文件）
    defineNuxtRouteMiddleware((to, from) => {
      console.log('[inline]', { from: from.fullPath, to: to.fullPath })

      if (to.query.block === '1') {
        return abortNavigation({ message: 'blocked by inline middleware' })
      }

      if (to.query.go === 'home') {
        return navigateTo('/home')
      }
    }),
    // 第三个：命名中间件
    'auth'
  ]
})
</script>

<template>
  <div>About</div>
</template>
```

测试：

- `/about?block=1`：会被 `abortNavigation()` 终止
  - 后面的中间件不会再执行
- `/about?go=home`：会被 `navigateTo('/home')` 重定向
- `/about`：正常通过，依次执行 `logger` -> `inline` -> `auth`

### 全局（全局中间件）

- 命名规范
  - 文件名以 `.global` 结尾：`middleware/xxx.global.ts`

- 使用
  - 放好文件即可自动生效，无需在页面 `definePageMeta` 声明

示例：`middleware/analytics.global.ts`

```ts
export default defineNuxtRouteMiddleware((to, from) => {
  console.log('[analytics]', { from: from.fullPath, to: to.fullPath })
})
```

目标：访问需要登录的页面时，如果没有 token，则跳转到 `/login`。

`middleware/auth.ts`

```ts
export default defineNuxtRouteMiddleware((to) => {
  // 如果 auth 中间件也作用在 /login 上，那么：
  // 访问 /login 时也会被判断“未登录”然后再次 navigateTo('/login')
  // 这就会导致无限循环重定向。
  // 因此要把 login 之类的“白名单路由”放行。
  if (to.path === '/login') return

  const token = useCookie('token')

  if (!token.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
})
```

`pages/profile.vue`（受保护页面）

```vue
<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div>Profile（需要登录）</div>
</template>
```

`pages/login.vue`（登录页：模拟设置 token，并跳回 redirect）

```vue
<script setup lang="ts">
const route = useRoute()
const token = useCookie('token')

const onLogin = async () => {
  token.value = 'mock-token'
  const redirect = (route.query.redirect as string) || '/'
  await navigateTo(redirect)
}
</script>

<template>
  <div>
    <h2>Login</h2>
    <button @click="onLogin">Login</button>
  </div>
</template>
```



## 5.6 路由验证

### 作用

用于在进入页面前校验路由参数是否合法。

- 常见场景：
  - 动态路由参数必须是数字（`/user/:id`）
  - id 不存在（例如后端查不到数据）直接返回 404
  - 需要先校验 query 参数格式

### 使用动态路由来验证（validate）

Nuxt 支持在页面里通过 `definePageMeta({ validate })` 做路由校验：

- `validate(route)` 返回 `true`：允许进入页面
- 返回 `false`：进入 Nuxt 内置错误页（通常表现为 404）

`pages/test/[id].vue`（只允许数字 id）

```vue
<script setup lang="ts">
definePageMeta({
  validate: (route) => {
    const id = String(route.params.id)
    return /^\d+$/.test(id)
  }
})

const route = useRoute()
</script>

<template>
  <div>Test id: {{ route.params.id }}</div>
</template>
```

访问效果：

- `/test/123`：通过校验，进入页面
- `/test/abc`：校验失败，进入 Nuxt 内置错误页

### 验证失败跳转 Nuxt 内置错误页面

- 当 `validate` 返回 `false`，Nuxt 会触发错误处理流程并显示默认错误页。
- 如果你想手动抛错，也可以：`throw createError({ statusCode: 404 })` 或者 `showError(...)`（更常见于数据请求后判断）。

### 自定义错误页面

- 新建 `error.vue`（或 `app/error.vue`），即可覆盖 Nuxt 默认错误页。

`error.vue` 示例：

```vue
<script setup lang="ts">
const error = useError()
</script>

<template>
  <div style="padding: 16px;">
    <h2>Error: {{ error?.statusCode }}</h2>
    <div>{{ error?.statusMessage }}</div>

    <button @click="clearError({ redirect: '/' })">回到首页</button>
  </div>
</template>
```

# 六。布局Layout

## 1.默认的布局

### 使用场景

- 全站页面共享相同的“壳”（Header / Footer / 侧边栏 / 统一背景）。
- 希望所有页面默认套一层结构，只在少数页面做特殊处理。

### 使用

- Nuxt3 默认会用 `layouts/default.vue` 作为“默认布局”。
- 如果你没有创建 `layouts/default.vue`，Nuxt 会使用内置的默认布局（本质上就是把页面渲染出来）。
- 页面内容会被渲染到布局里的 `<slot />`。

`layouts/default.vue`

```vue
<template>
  <div>
    <header style="padding: 12px; border-bottom: 1px solid #eee;">Header</header>
    <main style="padding: 12px;">
      <slot />
    </main>
    <footer style="padding: 12px; border-top: 1px solid #eee;">Footer</footer>
  </div>
</template>
```

补充：通常你不需要手写 `app.vue`，但如果你创建了 `app.vue`，一般结构会是：

`app.vue`

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

## 2.自定义布局

### 使用场景

- 不同页面组使用不同“壳”。
  - 例如：后台管理 `admin` 布局（侧边栏 + 面包屑），登录页 `auth` 布局（居中卡片）。
- 某些页面不需要默认 Header/Footer（例如登录页、落地页）。

### 案例：login.vue

目标：给登录页单独套一个 `auth` 布局，让页面居中显示。

1) 新建 `layouts/auth.vue`

```vue
<template>
  <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f5f6f8;">
    <div style="width: 360px; padding: 16px; background: #fff; border: 1px solid #eee; border-radius: 8px;">
      <slot />
    </div>
  </div>
</template>
```

2) 在 `pages/login.vue` 指定使用该布局

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const route = useRoute()
const token = useCookie('token')

const onLogin = async () => {
  token.value = 'mock-token'
  const redirect = (route.query.redirect as string) || '/'
  await navigateTo(redirect)
}
</script>

<template>
  <div>
    <h2>Login</h2>
    <button @click="onLogin">Login</button>
  </div>
</template>
```

补充：如果某个页面希望“不要任何布局”，可以设置：

```ts
definePageMeta({ layout: false })
```



# 知识补充

### 浏览器控制台有控制网速的功能（即fast 3g ，4g那个），以来让你模拟用户要是网速慢加载页面慢的情况

### 控制台network->看是ssr还是csr->看preview就行，因为preview就是response的ui展示

- 空白则是csr，不是空白则ssr
- csr一般就是spa（但页面），**ssr一般不是**
  - **“CSR 一般就是 SPA”基本对**：CSR 的典型形态就是 SPA（首屏是壳 + JS 拉数据再渲染）。
  - **“SSR 一般不是”不准确**：Nuxt 的 SSR 应用**依然可以是 SPA 体验**（前进/后退、页面切换多数时候是客户端路由），只是**首屏/刷新时**由服务端先输出 HTML，再由客户端 hydration 接管。
    - 所以更准确表述是：
      - **CSR**：首屏主要靠浏览器跑 JS 渲染
      - **SSR**：首屏由服务端输出 HTML，客户端再 hydration，后续导航仍可能是 SPA 式体验



# 七。渲染模式

### nuxt.config.ts 里面配置

`nuxt.config.ts`

```ts
export default defineNuxtConfig({
  // ssr: true  => 服务端渲染（默认）
  // ssr: false => 全站 SPA（所有页面走客户端渲染）
  ssr: true
})
```

### ssr：true / false

#### 作用

- `ssr: true`（默认）
  - 首次访问/刷新时，服务端会输出 HTML（更利于首屏内容直出、SEO、分享爬虫）。
  - 浏览器端会进行 hydration（接管交互），后续路由跳转通常仍是 SPA 体验。

- `ssr: false`（即csr）
  - 输出的 HTML 基本是“壳”，页面内容主要靠浏览器下载 JS 后再渲染（典型 SPA）。
  - 优点是部署形态更接近纯前端（某些场景更简单），缺点是首屏/SEO 通常不如 SSR。

#### 使用场景

- 适合 `ssr: true`
  - 内容站 / 营销页 / 需要 SEO 的页面
  - 需要更好的首屏直出体验

- 适合 `ssr: false`
  - 纯后台系统（SEO 不重要）
  - 页面几乎全是登录后可见的交互内容、且你更希望简化服务端渲染相关心智负担

### routeRules 设置混合模式渲染

Nuxt（Nitro）支持通过 `routeRules` 对“不同路由”应用不同渲染/缓存/重定向策略，实现 **同项目混合 SSR / CSR / SSG / ISR**。

#### 常用属性

- `ssr`
  - **作用**：对某个路由（模式）强制开启/关闭 SSR。
  - **常见用法**：让某些页面变成 CSR（例如后台页面）。

- `prerender`
  - **作用**：把匹配路由在“构建阶段”直接生成静态 HTML 文件（更接近 SSG）。
  - **常见用法**：
    - 首页/活动页/帮助页等内容变化不频繁的页面
    - 希望部署到纯静态托管（CDN/对象存储）也能直接打开
  - **注意点**：
    - 预渲染时执行的是“构建时渲染”，页面里如果依赖请求数据，需要确保构建环境能拿到数据，否则可能构建失败或内容为空。
    - 对于“强个性化（登录后）内容”的页面通常不适合预渲染。

- `isr`
  - **作用**：增量静态再生成（Incremental Static Regeneration）。可以理解为“先静态化 + 到期后自动更新”。
  - **常见用法**：
    - 资讯列表/博客列表/商品详情等：需要比较快的访问速度，但允许一定时间的内容延迟
  - **常见写法**：`isr: 60`（单位秒，表示内容最多 60s 更新一次）。
  - **注意点**：
    - ISR 是否生效与部署运行时有关（Nitro/平台适配不同）。
    - ISR 的核心是“缓存 + 过期再生成”，并不是每次请求都重新渲染。

- `cache`
  - **作用**：对服务端响应设置缓存策略（提升吞吐和响应速度）。
  - 常见写法：`cache: { swr: true, maxAge: 60 }`
    - `maxAge: 60`：缓存 60 秒
    - `swr: true`：过期后允许“先返回旧缓存，同时后台更新”（stale-while-revalidate）
  - **典型场景**：
    - SSR 页面渲染成本高，但允许短时间内内容不完全实时（例如排行榜、资讯列表）
  - **注意点**：
    - 缓存策略的细节和命中效果与部署环境（Node/Serverless/边缘）有关。
    - 登录态/用户个性化页面不要随便缓存，否则可能造成“串数据”。

- `headers`
  - **作用**：给该路由响应添加自定义响应头。
  - **常见用法**：
    - 安全相关：`x-frame-options`、`content-security-policy`（按页面做差异化）
    - 缓存相关：通过 `cache-control` 精细控制某些页面的浏览器缓存
    - 调试/标记：自定义 `x-xxx` 头用于排查链路
  - 示例：

    ```ts
    routeRules: {
      '/profile': {
        headers: {
          'cache-control': 'no-store',
          'x-page': 'profile'
        }
      }
    }
    ```

  - 测试
  
    - #### 方式C：curl  -I http://localhost:3000/profile  
  
      - 它只打印：
  
        - `HTTP/1.1 200 OK`
        - `x-page: profile`
        - `content-type: ...`
        - 等等响应头
  
        不会打印页面 HTML。
  
        ------
  
        ## 如果不加 `-I`
  
        ```
        curl http://localhost:3000/profile
        ```
  
        会把 **HTML 内容**也输出出来（一般会很长）。
  
      
  
- `redirect`
  - **作用**：配置重定向。
  - 常见写法：`redirect: '/new-path'` 或 `redirect: { to: '/new-path', statusCode: 301 }`。

#### 具体使用

`nuxt.config.ts`

```ts
export default defineNuxtConfig({
  // 全局默认 SSR
  ssr: true,

  routeRules: {
    // 1) 让后台路由走 CSR（关闭 SSR）
    '/admin/**': { ssr: false },

    // 2) 静态活动页：构建时预渲染
    '/landing': { prerender: true },

    // 3) 博客列表：ISR，每 60s 允许后台更新一次静态内容
    '/blog': { isr: 60 },

    // 4) 旧路径重定向
    '/old-home': { redirect: { to: '/', statusCode: 301 } },

    // 5) 给某个页面加响应头
    '/profile': { headers: { 'x-page': 'profile' } }
  }
})
```



# 八。Nuxt3的插件

## 使用方式

### vue文件中注册和使用

这里更准确的说法是：**在组件/页面内直接引入并使用某个库**（不经过 Nuxt 插件系统）。适合“只在少数页面用到”的场景。

例如你要在某个页面里用 `dayjs`：

```vue
<script setup lang="ts">
import dayjs from 'dayjs'

const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
</script>

<template>
  <div>{{ now }}</div>
</template>
```

特点：

- 不会全局注入（不会有 `$xxx`）
- 只在哪些页面 `import`，哪些页面才会被打包/使用（更按需）

### 专有的plugins里面注册，vue文件使用

当你希望：

- 统一初始化某个库（例如挂载 axios 实例、埋点 SDK 初始化）
- 全局注入一个工具（例如 `$api`、`$dayjs`）

就使用 Nuxt 插件：`plugins/*.ts`，通过 `defineNuxtPlugin` 注册。

示例：注入一个 `$sayHello`

`plugins/hello.ts`

```ts
export default defineNuxtPlugin(() => {
  return {
    provide: {
      sayHello: (name: string) => `hello ${name}`
    }
  }
})
```

页面/组件中使用：

```vue
<script setup lang="ts">
const { $sayHello } = useNuxtApp()
</script>

<template>
  <div>{{ $sayHello('nuxt') }}</div>
</template>
```

## 如何让某个插件只在client才能使用

### 命令规范

Nuxt 对插件文件名有约定：

- `plugins/xxx.client.ts`：只在客户端运行
- `plugins/xxx.server.ts`：只在服务端运行

常见原因：插件内部使用了 `window` / `document` / `localStorage` 等浏览器对象。

### 具体使用

示例：一个依赖 `window` 的插件（只允许在 client 运行）

`plugins/client-only.client.ts`

```ts
export default defineNuxtPlugin(() => {
  const ua = window.navigator.userAgent
  return {
    provide: {
      ua
    }
  }
})
```

页面使用：

```vue
<script setup lang="ts">
const { $ua } = useNuxtApp()
</script>

<template>
      <ClientOnly fallback="(server render will be empty)">
        <div style="word-break: break-all;">{{ $ua }}</div>
      </ClientOnly> // 必须用clientOnly报错，否则报错
</template>
```

补充：也可以在 `nuxt.config.ts` 里显式声明插件并指定模式（更可控）：

```ts
export default defineNuxtConfig({
  plugins: [
    { src: '~/plugins/client-only', mode: 'client' }
  ]
})
```

## 怎么控制插件的注册顺序

默认情况下，`plugins/` 下插件会按一定顺序自动加载（你可以理解为：**按文件名排序**）。

实践建议：

- 如果你需要“确定的顺序”，可以用文件名前缀：
  - `plugins/01.init.ts`
  - `plugins/02.api.ts`
  - `plugins/03.analytics.client.ts`

如果你希望更强的可控性（而不是依赖文件名），用 `nuxt.config.ts` 的 `plugins` 数组显式声明：

```ts
export default defineNuxtConfig({
  plugins: [
    '~/plugins/01.init',
    '~/plugins/02.api',
    { src: '~/plugins/03.analytics', mode: 'client' }
  ]
})
```





## 报错标识：Hydration text content mismatch

- 说明只在client可以渲染

- 解决

  ```js
  <ClientOnly fallback="(server render will be empty)">
  	来包裹
  </ClientOnly>
  ```





# 知识补充：`style="word-break: break-all"` 是什么意思

- **允许在“任意字符之间”断行换行**
- 主要用来处理 **很长、没有空格的字符串**（比如 UA、token、长 URL、长 hash），避免把布局撑爆、出现横向滚动条。
