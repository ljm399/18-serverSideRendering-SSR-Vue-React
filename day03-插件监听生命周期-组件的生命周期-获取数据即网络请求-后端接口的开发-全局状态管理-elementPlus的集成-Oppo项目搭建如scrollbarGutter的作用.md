# 一。应用的生命周期

 ## plugins来监听

### 文件路径plugins/

- 常用的生命周期

  ```ts
  // plugins/lifecycle-logger.ts
  export default defineNuxtPlugin((nuxtApp) => {
    const log = (name: string, payload?: any) => {
      const side = process.server ? 'server' : 'client'
      // server: node 终端输出；client: 浏览器控制台输出
      console.log(`[${side}] ${name}`, payload ?? '')
    }

    // Nuxt 应用级 hooks（常用）
    nuxtApp.hook('app:created', () => log('app:created')) // 
    nuxtApp.hook('app:beforeMount', () => log('app:beforeMount'))
    nuxtApp.hook('app:mounted', () => log('app:mounted'))
    nuxtApp.hook('app:rendered', () => log('app:rendered'))
    nuxtApp.hook('app:redirected', (to) => log('app:redirected', to))

    // 页面切换（路由变化）相关
    nuxtApp.hook('page:start', () => log('page:start'))
    nuxtApp.hook('page:finish', () => log('page:finish'))
    nuxtApp.hook('page:transition:finish', () => log('page:transition:finish'))

    // 全局错误捕获（包括 SSR / CSR）
    nuxtApp.hook('app:error', (err) => log('app:error', err))
  })
  ```

- 常见 hooks 速查（按“应用/页面”维度）

  - **app:created**：Nuxt app 创建完成（server/client 都会触发）
  - **app:beforeMount**：仅 client，Vue 挂载前
  - **app:mounted**：仅 client，Vue 挂载后
  - **app:rendered**：渲染完成（SSR 完成 HTML 输出时也会触发）
  - **app:redirected**：发生重定向时触发
  - **page:start / page:finish**：页面导航开始/结束
  - **app:error**：全局错误捕获

- 注意点

  - **插件会同时在 server/client 运行**：如果你只想在某一端运行，可以把文件命名为
    - `plugins/xxx.server.ts`（仅服务端）
    - `plugins/xxx.client.ts`（仅客户端）
  - **Nuxt3 会自动扫描 `plugins/`**：一般不需要手动在 `nuxt.config.ts` 里注册（除非你做了自定义配置）
  - **输出位置**：
    - `process.server === true`：Node 终端（启动 Nuxt 的控制台）
    - `process.client === true`：浏览器 DevTools Console

- 补充：`<script setup>` 里为什么“created 之类的生命周期”不会被调用

  - `<script setup>` 是 **Composition API 的语法糖**，组件的入口是 `setup()`。
  - `created / beforeCreate` 属于 **Options API**（`export default { created() {} }` 那种写法）。在 `<script setup>` 中你不能再写 `created(){}` 这种选项，因此也就不存在“触发 created”。
  

# 二。组件的生命周期

## 1.组件在客户端的生命周期

- 客户端渲染时（浏览器）组件生命周期（Options API -> Composition API 对照）

  - `beforeCreate` -> `setup()`
  - `created` -> `setup()`
  - `beforeMount` -> `onBeforeMount`
  - `mounted` -> `onMounted`
  - `beforeUpdate` -> `onBeforeUpdate`
  - `updated` -> `onUpdated`
  - `beforeDestroy` -> `onBeforeUnmount`
  - `destroyed` -> `onUnmounted`
  - `errorCaptured` -> `onErrorCaptured`

- 说明

  - `<script setup>` 本质就是在写 `setup()`,所以 `beforeCreate/created` 这两个阶段可以理解为“都被折叠到 setup 中了”。
  - `onMounted/onUpdated` 等只在浏览器 DOM 存在时才有意义，因此属于客户端生命周期。

## 2.组件在服务器端生命周期 

- 服务端渲染（SSR）期间，组件不会真正挂载到 DOM，也不会发生交互导致的更新。

- SSR 期间会执行的（核心）

  - `beforeCreate` -> `setup()`
  - `created` -> `setup()`
    
    -  即`<script setup>` 只有一个生命周期，vue2有两个即beforeCreate和created
      
      - 注意
      - 在 **SSR 首屏**时：这段代码会在 **服务器端**执行一次（日志出现在启动 Nuxt 的终端）。
      - 随后浏览器进行 **hydration**：这段代码还会在 **客户端**再执行一次（日志出现在浏览器控制台）。
      
      ```vue
      <script setup>
      console.log('setup 执行了')
      </script>
      ```

- SSR 期间不会执行的（因此不要指望在 server 触发）

  - `mounted` / `updated` 这一类钩子（对应 `onMounted/onUpdated`）不会在 SSR 阶段调用，只会在客户端 hydration 之后执行。

- 重要注意点（副作用代码放哪里）

  - 尽量避免在 `beforeCreate/created`（也就是 `setup()`）里写需要“清理”的副作用代码（例如 `setInterval`、事件监听、操作 `window/document`）。
  - 原因：SSR 阶段不会执行 `unmounted`（对应 `onUnmounted`）去清理，可能导致副作用一直存在或在 server 端报错。
  - 建议：
    - 需要访问浏览器对象/DOM 的逻辑放到 `onMounted`.
    - 必须只在客户端执行时，用 `process.client` / `import.meta.client` 做保护。


# 三。获取数据

## 1.$fetch

- 使用场景

  - `$fetch` 可以理解为 Nuxt 内置的、加强版的 `fetch`。
  - 适合在**事件里主动请求数据**，例如：点击按钮、提交表单、登录、删除、分页加载更多等。
  - 如果直接在 `<script setup>` 顶层使用 `$fetch`，**SSR** 阶段会**在服务器请求一次**，**客户端** hydration 时可能还会**再请求一次**，所以首屏数据更推荐用 `useAsyncData` / `useFetch`。

- 使用

  ```vue
  <script setup lang="ts">
  // 1. 使用 $fetch 来发起网络请求
  // server and client
  const BASE_URL = 'http://localhost:3000/api'
  
  $fetch(BASE_URL + '/homeInfo', {
    method: 'GET'
  }).then((res) => {
    console.log(res)
  })
  </script>
  ```

## 2.useAsyncData

- 相对$fetch的优势

  - `useAsyncData` 更适合做 **SSR 首屏数据请求**。
  - 服务端请求到的数据会被 Nuxt 序列化到页面中，客户端 hydration 时可以直接复用，**避免重复请求**。
  - 返回的数据自带响应式状态：`data`、`pending`、`error`、`refresh`。
  - 可以自定义唯一 `key`，Nuxt 会根据这个 key 管理数据缓存。
    - `key` 写在哪里：`useAsyncData(key, handler)` 的**第一个参数**就是 key。
    - `key` 是干什么的：可以把它理解为这次异步数据的“缓存ID/标识”。
      - 同一个 `key`：Nuxt 会复用同一份数据状态（`data/pending/error`），并用于 SSR -> client 的数据复用。
        - 即两个key相同，但url不同所拿到的值相同（条件：刷新时，server端发送请求，而非客户端，且只有useAsyncData这个一种请求才有这情况）
      - 不同 `key`：Nuxt 会当成不同请求/不同缓存条目。
    - 什么时候需要你手动写清楚 key：
      - 有**多个不同接口/不同参数**的请求（避免 key 冲突导致拿到错误缓存）。
      - `key` 需要和参数绑定（例如详情页 `id`、列表页 `page`），常见写法：`detail:${id}`。
  - 适合包装任意异步函数，不只限于请求接口。

- 使用

  ```vue
  <script setup lang="ts">
  // 2. 使用官方提供的 hooks API（在刷新页面时，可以减少客户端发起的一次请求）
  type IResultData = {
    data: any
  }
  const BASE_URL = 'http://localhost:3000/api'
  
  const { data } = await useAsyncData<IResultData>('homeInfo', () => {
    return $fetch(BASE_URL + '/homeInfo', { method: 'GET' })
  })
  
  // 当homeInfo2是 homeInfo即和上面的一样，则data2和data一样，且有错误信息
  const data2 = await useAsyncData<IResultData>('homeInfo2', () => {
    return $fetch("http://localhost:8000" + '/moment?offset=0&size=10', { method: 'GET' })
  })
  
  console.log(data.value?.data)
  console.log(data2,'/moment?offset=0&size=10');
  </script>
  ```
  
- 和 `$fetch` 的关系

  - `useAsyncData` 里面通常还是会调用 `$fetch`。
  - `$fetch` 负责真正发请求。
  - `useAsyncData` 负责处理 SSR 数据复用、响应式状态、缓存和刷新。

## 3.useFetch

- 是 `useAsyncData` 的“快捷写法”（语义上可以理解为：`useAsyncData` + `$fetch` 的组合封装）

- options（包括拦截器）

  - 基础配置
    - `baseURL`：基础地址
    - `method`：请求方法（GET/POST...）
    - `params`：query 参数（一般用于 GET）
    - `body`：请求体（一般用于 POST）
    - `headers`：请求头
  - 拦截器 hooks（server and client）
    - `onRequest({ request, options })`：请求发出前（可改 `options.headers` 等）
    - `onRequestError({ request, options, error })`：请求发出前出错
    - `onResponse({ request, response, options })`：响应回来后（可统一处理/抽取数据）
    - `onResponseError({ request, response, options, error })`：响应错误

- 使用

  ```vue
  <script setup lang="ts">
  type IResultData = {
    data: any
  }
  
  const BASE_URL = 'http://localhost:3000/api'
  
  const { data } = await useFetch<IResultData>('/goods', {
    method: 'POST',
    baseURL: BASE_URL,
    body: {
      count: 6
    },
  
    // 请求拦截（server and client）
    onRequest({ request, options }) {
      console.log(options.method)
      options.headers = {
        token: 'xxxx'
      }
    },
    onRequestError({ request, options, error }) {
      console.log('onRequestError')
    },
  
    // 响应拦截
    onResponse({ request, response, options }) {
      console.log('onResponse')
      console.log(response._data.data.server_jsonstr)
      return response._data.data.server_jsonstr
    },
    onResponseError({ request, response, options, error }) {
      console.log('onResponseError')
    }
  })
  
  console.log(data.value?.data)
  </script>
  ```

- refresh来客户端请求 和  改变依赖的响应式数据来会触发 `useFetch` **自动重新请求**

  - `useFetch/useAsyncData` 返回的 `refresh()`：用于**手动重新请求**（例如点按钮重新拉取数据）。
  - `pending`：请求中的 loading 状态（`true` 表示正在请求）。
  - 通俗理解（结合 SSR）：
    - **刷新页面/首屏直出**：请求通常发生在 **server**（你会在 Nuxt 启动终端看到请求日志），**客户端** hydration 会复用这份数据，**不会再发一次同样请求**。
    - **页面已经在浏览器里运行时**（路由切换完成后）：你点击按钮调用 `refresh()`，这次请求会在 **client** 发起（浏览器 Network 能看到）。
    - 当你网页端切换路由，客户端发送网络请求，服务端不会发送
    
  - 例子
  
    - 改变依赖的响应式数据（如 `count.value++`），会触发 `useFetch` **自动重新请求**。
      - 更通俗的说法：
        - `data` / `pending` / `error` 这几个是 **Ref 响应式状态**（值变了模板会自动更新）。
        - `refresh` 是一个**函数**（不是 Ref），你调用它就会再请求一次。
      - 为什么 `count.value++` 会“自动重新请求”？
        - 因为你把 `count`（一个 ref）作为参数传进了 `body/params` 里，Nuxt 会监听这些依赖的变化；依赖变了就会重新发请求。
  
    - 也可以显式调用 `refresh()`，在客户端**再发起一次请求**。
    
    ```vue
    <script setup lang="ts">
    type IResultData = { data: any }
    
    const BASE_URL = 'http://localhost:3000/api'
    const count = ref(1)
    
    const { data, refresh, pending } = await useFetch<IResultData>(
      BASE_URL + '/goods',
      {
        method: 'POST',
        body: {
          count
        }
      }
    )
    
    watch(data,(newData)=>{
      console.log(newData,'我是newdata') // 必须要watch，因为下面的console.log(data.value?.data)只开始打印一次
    })
    
    
    console.log(data.value?.data)
    
    function refreshPage() {
      count.value++ // 客户端发送请求方式一： 依赖变化：会自动重新发起网络请求，服务端不会发送请求
      // refresh() //  方式二： 主动刷新：client 再发起一次请求，服务端一样不会发送请求（不要等同于点击左上角的刷新页面）
    }
    </script>
    ```
  
- 和axios对比

  - `useFetch/$fetch`（Nuxt 内置）
    - 更贴合 **SSR**：首屏可以在 server 发请求，并把结果带到客户端复用。
    - 更贴合 **Vue 响应式**：`data/pending/error` 这些状态直接就是 ref。
    - 更贴合 **Nuxt 生态**：支持 `refresh()`、`lazy`、以及请求/响应 hooks（`onRequest/onResponse...`）。
    - 更适合写在页面/组件里做“数据获取”（尤其是首屏/路由切换相关的数据）。

  - `axios`（通用 HTTP 库）
    - 只负责“发请求/收响应”，不关心 SSR 数据复用，也不会自动给你 `pending/error/refresh` 这种状态。
    - 在 Nuxt SSR 中也能用，但你需要自己处理：
      - server/client 两端的执行时机
      - 首屏数据注水（避免客户端重复请求）
      - loading、错误、缓存等状态管理
    - 更适合写在“独立请求层/封装层”（比如你习惯统一封装 axios 实例、统一拦截器、统一错误码处理）。

  - 简单结论
    - 做 Nuxt 页面首屏数据：优先 `useAsyncData/useFetch`。
    - 做通用接口封装或迁移老项目：可以用 axios，但要自己补齐 SSR/状态这些能力。



- 优势：

  - ##### `useFetch` 有缓存/去重（dedupe）

  ```
  async function rqt() {
    const data2 = await getHomeInfo()
    console.log(data.value.data, '我是data');
    
  }
  ```

  你 getHomeInfo() 内部用的是 `useFetch`。`useFetch` 在 Nuxt 里会对**相同 key/相同 URL**的请求做复用

  const { data } = await getHomeInfo()

  再调用一次同样的 getHomeInfo()，**直接复用第一次**的结果，Network 看起来就“没发新请求”,控制台有打印（因为复用了）。



## 4.useLazyFetch

- 使用场景

  - 首屏不需要立即请求（不阻塞首屏渲染），等页面 mounted 后或你自己触发时再请求。
    - 没有lazy就会阻塞首屏渲染
  - 例如：某些非首屏关键数据、折叠面板展开后才需要的数据。

- 使用

  ```vue
  <script setup lang="ts">
  type IResultData = {
    data: any
  }
  
  const BASE_URL = 'http://localhost:3000/api'
  
  // 写法 1：useFetch + lazy: true
  const { data } = await useFetch<IResultData>(BASE_URL + '/homeInfo', {
    method: 'GET',
    lazy: true
  })
  console.log(data.value?.data)
  
  watch(data, (newData) => {
    console.log('data=>', newData)
  })
  
  onMounted(() => {
    console.log('onMounted')
  })
  
  // 写法 2：useLazyFetch（等价于 lazy 模式）
  // const { data } = await useLazyFetch<IResultData>(BASE_URL + '/homeInfo', {
  //   method: 'GET'
  // })
  </script>
  ```

  



## 5.请求的封装useFetch + TS

- TS的优势
  - 调用时有提示
  - 而且类型规范，减少之后可能报错的概率

- `UseFetchOptions` 和 `AsyncData` 的来源（类型导入）

  - 这两个都是 Nuxt 内置类型
  - 常见写法：

    ```ts
    import type { AsyncData, UseFetchOptions } from 'nuxt/app'
    // 或者（Nuxt 提供的别名，项目里常见）
    // import type { AsyncData, UseFetchOptions } from '#app'
    ```


- ts知识回忆，更好看下面知识

  - **泛型接口 `IResultData<T>`**

    ```ts
    export interface IResultData<T> { code: number; data: T }
    ```

    - `T` 是“数据部分的类型占位符”，不同接口返回的数据结构不同，用 `T` 能复用同一个返回结构。
    - 例如 `IResultData<User>` 表示 `data` 是 `User` 类型。

  - < IResultData< Home>>解释

    ```ts
    export interface IResultData<T> {
      code: number
      data: T
    }
    
    type Home = { server_jsonstr: string }
     
    const { data } = await hyRequest.get<IResultData<Home>>('/homeInfo')
    ```

    那么 TS 会推导出：

    - `data` 是一个 Ref（响应式）
    - `data.value` 的类型是 `IResultData<Home> | null`（大概这个意思，Nuxt 内部还会带 null/undefined）
    - 所以：
      - `data.value?.code` 有提示
      - `data.value?.data.server_jsonstr` 也有提示

- server/index.ts

  ```ts
  import type { AsyncData, UseFetchOptions } from 'nuxt/app'
  
  export type Methods = 'GET' | 'POST'
  
  export interface IResultData<T> {
    code: number
    data: T
  }
  
  class HYRequest {
    request<T = any>(
      url: string,
      method: Methods,
      data?: any,
      options?: UseFetchOptions<T>
    ): Promise<AsyncData<T, Error>> {
      return new Promise((resolve) => {
        const newOptions: UseFetchOptions<T> = {
          baseURL: BASE_URL,
          method
        }
  
        if (method === 'GET') {
          newOptions.query = data
        }
  
        if (method === 'POST') {
          newOptions.body = data
        }
  
        Object.assign(newOptions, options)
  
        resolve(useFetch(url, newOptions))
      })
    }
  
    get<T = any>(url: string, data?: any, options?: UseFetchOptions<T>) {
      return this.request<T>(url, 'GET', data, options)
    }
  
    post<T = any>(url: string, data?: any, options?: UseFetchOptions<T>) {
      return this.request<T>(url, 'POST', data, options)
    }
  }
  
  export default new HYRequest()
  ```

  - 问题：request<T = any>(    url: string,    method: Methods,    data?: any,    options?: UseFetchOptions<T>  ) 解释

    - ##### `(...)` 是什么

      - ##### 函数参数列表 + 每个参数的类型标注

    - 调用的get<IResultData<Home>>的IResultData<Home> 是request<T = any>(    url: string,    method: Methods,    data?: any,    options?: UseFetchOptions<T>  ) 还是 返回值Promise<AsyncData<T, Error>>

      - 对应的是 **`request<T = any>(...)` 这个泛型参数 `T`**。
      - 等价于把 `T` 指定为：
        - `T = IResultData<Home>`

  - 问题2：`UseFetchOptions<T>` 为什么需要 `T`

    - 因为 `UseFetchOptions` 这份配置里，有一些字段（尤其是 **拦截器 hooks**）会用到“**响应数据的类型**”
    - `UseFetchOptions<T>` 也要跟着 `T`，这样你在 options 里写拦截器、处理返回值时，TS 才能给你**正确的类型提示**

  - 问题3：`AsyncData<T, Error>` 是什么

    ```
    const { data, pending, error, refresh } = await useFetch<T>(...)
    ```

    其实就是在从 `AsyncData<T, Error>` 这个对象里解构。

    ------

    ####  `<T, Error>` 两个泛型分别代表什么？

    - `T`：这次请求最终成功拿到的**数据类型**
      - 例如 `T = IResultData<Home>`
    - `Error`：错误对象的类型
      - 这里写 `Error` 表示标准 JS 的错误对象类型（通常够用）

    所以：

    ```ts
    AsyncData<IResultData<Home>, Error>
    ```

    意思是：

    - `data` 里包着 `IResultData<Home>` 这种数据结构
    - `error` 里包着 `Error`

- 使用

  - service/home.ts（与截图一致：把具体接口再封一层）

    ```ts
    import hyRequest from './index'
    import type { IResultData } from './index'
    
    export const fetchHomeInfoData = () => {
      return hyRequest.get<IResultData<any>>('/homeInfo')
    }
    ```

  ```vue
  <script setup lang="ts">
  import hyRequest from '@/service/index'
  import type { IResultData } from '@/service/index'
  
  // 方式 1：直接调用 hyRequest
  const { data } = await hyRequest.get<IResultData<any>>('/homeInfo')
  console.log(data.value?.data)
  
  // 方式 2：调用你封装好的业务函数
  // import { fetchHomeInfoData } from '@/service/home'
  // const { data } = await fetchHomeInfoData()
  </script>
  ```



### 应付面试

> 我在 Nuxt3 里封装 `useFetch + TS` 的目的，是把**请求逻辑统一**并且让**调用方有完整的类型提示**。
> 我会定义一个 `HYRequest` 类，核心是一个 `request<T>()` 泛型方法：
>
> - `T` 表示这次接口返回的数据类型（比如 `IResultData<Home>`），这样调用 `get<T>()` 之后，返回的 `data.value` 就能拿到强类型提示。
> - `request` 的参数统一为 `url / method / data / options`：
>   - 返回值时promise，方面后面调用的使用
>   - `GET` 时把 `data` 映射到 `query`
>   - `POST` 时把 `data` 映射到 `body`
>   - 并把 `baseURL`、`headers`、拦截器等公共配置合并到 `UseFetchOptions<T>` 里。
> - 返回值是 Nuxt 的 `AsyncData<T, Error>`（通常解构出 `data/pending/error/refresh`），这套返回结构天然支持 SSR 数据复用和响应式状态。
>   最后我再提供 `get/post` 两个便捷方法，本质都是对 `request` 的二次封装，这样业务侧写起来就很干净，比如 `hyRequest.get<IResultData<Home>>('/homeInfo')`。

如果面试官追问 **“为什么不用 axios？”** 

> *在 Nuxt 场景下* `useFetch/useAsyncData` *对 SSR 注**水、hydration* *复用、响应式状态（*`data/pending/error/refresh`*）支持更好；**axios 也能用，但**你**通常**需要自己**再封***
>
> ***层**来补**齐* **SSR 复用、状态管理、以及拦截器（token、错误码、统一解包）** *这些能力。*。







# 注意：刷新页面服务端就会发送请求（nuxt终端看到），但网页端路由切换则只有网页端发送请求（控制台的network可以看到）





# 四。后端接口的开发

## 注意

- Nuxt3 的后端接口（Nitro API）一般放在 `server/api/` 下，会自动生成路由。
  - `server/api/homeInfo.get.ts` -> `GET /api/homeInfo`
  - `server/api/login.post.ts` -> `POST /api/login`
  - 文件名里的 `.get/.post` 可以限制请求方法；不写也可以，但建议写清楚。

- 在接口里拿参数
  - query：`getQuery(event)`
  - body：`await readBody(event)`
  - `readRawBody(event)`：读取原始 body（string/buffer），常用于验签/webhook/需要原始文本的场景；普通 JSON 请求一般用 `readBody`。

- 返回结构建议统一（方便前端写 TS）
  - 例如：`{ code: 0, data: ... }`

- cookie
  - 服务端接口内设置 cookie：`setCookie(event, 'token', value, { maxAge })`
  - 客户端页面里读写 cookie：`useCookie('token')`

## 1.api/homeInfo

- server/api/homeInfo.get.ts

  ```ts
  export default defineEventHandler(() => {
    return {
      code: 0,
      data: {
        server_jsonstr: 'homeInfo from server'
      }
    }
  })
  ```

## 2.api/login

- server/api/login.post.ts

  ```ts
  export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const body = await readBody<{ username: string; password: number }>(event)
  
    if (body?.username === 'admin' && String(body?.password) === '123456') {
      const token = 'token_' + String(query.id ?? '')
  
      return {
        code: 0,
        data: {
          token
        }
      }
    }
  
    return {
      code: -1,
      data: null
    }
  })
  ```

## 使用

```vue
<script setup lang="ts">
async function login() {
  const { data } = await useFetch('/api/login?id=100', {
    method: 'POST',
    body: {
      usename: 'admin',
      password: 123456
    }
  })

  console.log(data.value?.data)

  const cookie = useCookie('token', {
    maxAge: 10
  })

  cookie.value = data.value?.data?.token as string // 注意：as string 是 TS 类型断言，不会做运行时转换
  // 如果要运行时“转成字符串”，应该写：cookie.value = String(data.value?.data?.token ?? '')
  return navigateTo('/')
}
</script>
```

# 五。全局状态的管理

## 1.useState

- `useState`：Nuxt 提供的“全局响应式状态”（同一个 key 对应同一份状态）

- 特点

  - **跨组件/跨页面共享**：只要 key 相同（例如 `'counter'`），在任意页面/组件里拿到的都是同一个 ref。
  - **SSR + CSR 都能用**：
    - 刷新页面（SSR 首屏）：会在 server 执行一次，然后客户端 hydration 复用。
      - server只用来初始化值
    - 之后在浏览器里切换路由：**只**在 client 侧继续使用同一份状态。
  - **为什么刷新就“没有了”**：
    - 刷新页面会重新创建应用实例（server 重新渲染、client 重新启动），`useState` 会重新按初始化函数生成默认值。
    - 如果要刷新后也保留，需要自己做持久化（例如 localStorage/cookie）或用 pinia 持久化插件。

- useState 注意事项

  - `useState` 只能用在 `setup` 函数以及生命周期 hooks 中（本质都是在组件的 setup 上下文里执行）。
  - `useState` 不支持/不建议存放 `class`、`function`、`symbol` 这类数据。
    - 原因：SSR 需要把 state 序列化后注水到客户端，这些类型无法正常序列化。
      - 序列化是什么：把“内存里的数据”转换成“可以传输/保存的纯文本格式”（最常见就是 JSON 字符串）。
      - 能序列化的普通数据（number/string/boolean/plain object/array）可以被“打印并复原”；但 function/symbol/class 实例 这类信息在 JSON 里表达不了或表达不完整，复原后就不是原来的东西了。
        - **function**：JSON 里没有“函数”这种类型（无法表达函数体和闭包环境）
        - **symbol**：JSON 里也没有对应表示
        - **class 实例**：就算能把它的普通字段变成 JSON，反序列化回来也只是“普通对象”，**不会自动带回原来的原型方法**（除非你自己手动再 new 一次并恢复原型）

- **推荐**放在项目根目录的 `composables/` 下（比如 composables/useCounter.ts）

  - 因为 Nuxt 会对 `composables/` 做 **自动导入**：
    - 文件名 useCounter.ts 默认导出 => 你可以直接在页面写 const counter = useCounter()，不用手动 import

  - 如果不放在 `composables/` 会怎样？
    - **仍然能用**，但通常会变成：
      - 你需要手动 `import { useCounter } from '...'`（或你自己配置 auto-import 扫描目录）

- 案例

  - composables/useCounter.ts

    ```ts
    // 写法 1：默认导出（文件名 useCounter.ts，Nuxt 会自动按文件名生成 useCounter()）
    export default function () {
      return useState('counter', () => 100)
    }

    // 写法 2：具名导出（也能用，但需要你手动 import { useCounter } ...）
    // export const useCounter = () => {
    //   return useState('counter', () => 100)
    // }
    ```

  - `const counter = useCounter()` 的 counter 有响应式吗？

    - `useState` 的返回值是 `Ref<T>`，所以 `counter` 本质是一个 **ref（响应式）**。
    - 在 JS 里用：读写要通过 `counter.value`。
    - 在 template 里用：Vue 会对 ref **自动解包**，所以可以直接写 `{{ counter }}`。
    - 如果 `counter` 的值是对象（例如 `useState('user', () => ({ name: 'a' }))`）：
      - 对象内部字段也是响应式的（通过 `counter.value.name = 'b'` 修改，页面会更新）。

  - pages/a.vue

    ```vue
    <script setup lang="ts">
    const counter = useCounter() 
    console.log(process.server ? '[server] a.vue counter' : '[client] a.vue counter', counter.value)

    const add = () => {
      counter.value++
    }
    </script>

    <template>
      <div>A Page: {{ counter }}</div>
      <button @click="add">+1</button>
      <NuxtLink to="/b">去 B</NuxtLink>
    </template>
    ```

  - pages/b.vue

    ```vue
    <script setup lang="ts">
    const counter = useCounter()
    console.log(process.server ? '[server] b.vue counter' : '[client] b.vue counter', counter.value)
    
    const add = () => {
      counter.value++
    }
    </script>
    
    <template>
      <div>B Page: {{ counter }}</div>
      <button @click="add">+1</button>
      <NuxtLink to="/a">去 A</NuxtLink>
    </template>
    ```

  

## 2.pinia

### Pinia作用过程

#### 第一次只有服务端的pinia发送请求，数据同步到客户端，客户端不用发送请求（验证你会发现控制台打印了，但network没有网络请求）

- 安装

  ```bash
  npm i pinia @pinia/nuxt
  ```

- 配置

  - nuxt.config.ts

    ```ts
    export default defineNuxtConfig({
      modules: ['@pinia/nuxt']
    })
    ```

- 使用

  - stores/counter.ts

    ```ts
    export const useCounterStore = defineStore('counter', {
      state: () => ({
        count: 100
      }),
      actions: {
        add() {
          this.count++
        }
      }
    })
    ```

  - pages/a.vue（多个页面共享）

    ```vue
    <script setup lang="ts">
    const counterStore = useCounterStore()
    console.log(process.server ? '[server] a.vue pinia' : '[client] a.vue pinia', counterStore.count)
    </script>

    <template>
      <div>A Page: {{ counterStore.count }}</div>
      <button @click="counterStore.add()">+1</button>
      <NuxtLink to="/b">去 B</NuxtLink>
    </template>
    ```

  - pages/b.vue

    ```vue
    <script setup lang="ts">
    const counterStore = useCounterStore()
    console.log(process.server ? '[server] b.vue pinia' : '[client] b.vue pinia', counterStore.count)
    </script>
    
    <template>
      <div>B Page: {{ counterStore.count }}</div>
      <button @click="counterStore.add()">+1</button>
      <NuxtLink to="/a">去 A</NuxtLink>
    </template>
    ```

- 注意

  - pinia 和 `useState` 一样：默认都是**内存态**，刷新页面会回到初始值。
  - 如果想刷新后还保留，需要做**持久化**（例如 localStorage/cookie，或引入 pinia persistedstate 插件）。
  - store 建议放在 `stores/` 目录下，命名 `useXxxStore`，方便自动导入与识别。

  

## pinia和useState对比

- 共同点

  - 都支持**全局状态共享**，共享的数据都是响应式数据。
  - 都支持 **SSR（服务端）和 CSR（客户端）** 场景。

- Pinia 相对 useState 的优势（与截图一致）

  - 开发工具支持（Devtools）
    - 状态变化可追踪，更容易调试
    - store 可以在使用它的组件中直接查看
  - 模块热更新（HMR）
    - 开发时无需重新加载页面也可修改 store
    - 更容易在开发时保持已有状态
  - 插件生态
    - 可以用插件扩展 Pinia 功能（例如持久化、日志、订阅等）
  - TypeScript 支持更完整
    - 类型推导更舒服，自动补全更完善







# 六。Element Plus集成

- 安装

  ```bash
  npm i element-plus
  npm i -D unplugin-vue-components unplugin-auto-import
  ```

- 配置（集成）包括按需导入

  - nuxt.config.ts

    ```ts
    import AutoImport from 'unplugin-auto-import/vite'
    import Components from 'unplugin-vue-components/vite'
    import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
    
    export default defineNuxtConfig({
      compatibilityDate: '2025-07-15',
      devtools: { enabled: false },
      vite: {
        ssr: {
          noExternal: ['element-plus']//  SSR 运行时（Node ESM）直接去执行了 Element Plus 的 *.css 导入，Node 不认识 .css 扩展名，于是报 Unknown file extension ".css"。
            // 解决：Vite SSR 配置：让 element-plus 在 SSR 侧 不要 externalize（交给 Vite 打包处理 CSS）
        },
        plugins: [
          AutoImport({
            resolvers: [ElementPlusResolver()]
          }),
          Components({
            resolvers: [ElementPlusResolver()]
          })
        ]
      }
    })
    
    ```

  - 说明

    - 这种方式属于**按需导入**：你用到哪个组件/图标，它才会被打包进来。
    - 不需要手动 `import { ElButton } from 'element-plus'`，模板里直接写 `<el-button />` 即可。

- 使用

  ```vue
  <template>
    <el-button type="primary">按钮</el-button>
  </template>
  ```



# 七。OPPO项目的搭建

## 配置比如nuxt.config.ts报错

### 一般原因时你文件目录配置错误，下次把文件目录搞好在说

#### 解决：问ai文件目录有什么问题吗

## 创建项目

- 命令

  ```bash
  # 推荐：用 pnpm 创建 Nuxt 项目
  pnpm dlx nuxi@latest init oppo-nuxt
  
  # 进入项目目录
  cd oppo-nuxt
  
  # 安装依赖（你自己执行）
  pnpm i
  
  # 启动开发（默认 http://localhost:3000）
  pnpm dev
  
  # 如果需要改端口（可选）
  # pnpm dev -- --port 3001
  ```

### 把app/ 删了

#### 使用pages/就行

#### 注意layouts 有个s



## 安装normlize

- 安装命令

  ```bash
  npm i normalize.css
  ```

- 配置

  - 方式 1：在 `nuxt.config.ts` 全局引入（推荐）（使用这个）

    ```ts
    export default defineNuxtConfig({
      css: ['normalize.css/normalize.css']
    })
    ```

    - 不需要你手动 `import`。在 Nuxt 里：nuxt.config.ts的 css: [...]是 全局样式入口配置
      - 你写 `css: ['normalize.css/normalize.css']`，他会自动去node_modules下的包找normalize.css/normalize.css
    - 怎么测试
      - 看设置后元素有无改变
  
  - 方式 2：在入口样式中引入
  
    - `assets/styles/main.css`
  
      ```css
      @import 'normalize.css/normalize.css';
      ```
  
    - `nuxt.config.ts`
  
      ```ts
      export default defineNuxtConfig({
        css: ['~/assets/styles/main.css']
      })
      ```



## 安装scss

- 命令

  ```bash
  npm i -D sass
  ```

- 配置

  - 全局样式入口（可选）

    - `assets/styles/index.scss`

  - nuxt.config.ts（全局引入 + 全局变量/混入自动注入）

    ```ts
    export default defineNuxtConfig({
      css: ['normalize.css/normalize.css'],
      vite: {
        css: {
          preprocessorOptions: {
            scss: {
              loadPaths: ['assets/css'],
              additionalData: "@use '~/assets/styles/variables.scss' as *;"
            }
          }
        }
      }
    })
    ```

- 使用：初始化项目

  - 目录建议

    - `assets/styles/variables.scss`：变量（颜色、字号、间距）
    - `assets/styles/reset.scss`：reset/normalize 扩展
      - normalize全局引入，就必须要再引入到reset.scss
    - `assets/styles/index.scss`：聚合入口



### loadPaths: ['assets/css'],作用

Sass 会把 `assets/css` 也当成“可搜索目录”，所以你就可以在任何 scss 里写这种**更短的路径**：

```scss
@use "variables.scss" as *;
```

它会去 `assets/css/variables.scss` 找。

如果没有 `loadPaths`，你往往得写：

```scss
@use "@/assets/css/variables.scss" as *;
```



## 创建代码片段

- VSCode：配置用户代码片段

  - 打开： 选择 `vue.json`

  - 粘贴示例（触发前缀：`oppo-comp`）

    ```json
    {
      "oppo component": {
        "prefix": "oppo-comp",
        "body": [
          "<template>",
          "  <div class=\"app-$1\">app-$1</div>",
          "</template>",
          "",
          "<script setup lang=\"ts\">",
          "export interface IProps {",
          "  title: string",
          "}",
          "",
          "const props = withDefaults(defineProps<IProps>(), {",
          "  title: ''",
          "})",
          "</script>",
          "",
          "<style lang=\"scss\">",
          ".app-$1 {",
          "}",
          "</style>"
        ],
        "description": "Vue SFC (script setup ts + props default + scss)"
      }
    }
    ```
    
    - 注意
    
      ```ts
      export interface IProps {
        title?: string
      }
      
      const props = withDefaults(defineProps<IProps>(), {
        title: ''
      })
      ```
    
      - 要写？，否则会有错误提示

- 第二种写法（JS 版本，不写 interface）

  - 核心写法

    ```vue
    <script setup>
    const props = defineProps({
      title: {
        type: String,
        default: ''
      }
    })
    </script>
    ```

## 创建目录

- 目录约定

  - `components/app-header/index.vue`
  - `components/app-footer/index.vue`

- 好处

  - Nuxt 会自动扫描 `components/`，页面中通常可以直接使用：
  
    ```vue
    <template>
      <AppHeader />
      <AppFooter />
    </template>
    ```



##  实现app-header

- 已有wrapper，位置再global或variable.scss里面

### 告诉ai图片位置以及font字体位置

### 点击登录跳转到登录页面，注册页面同理

- 登录和注册页面都要使用layout/emtry-layout.vue



## 404页面

pages/[...slug].vue



## seo优化

复制粘贴到nuxt.config.js

```ts
  app: {
    // 给所有app所有的页面的head添加默认的meta和link标签。。。（SEO, 添加外部的资源）
    head: {
      title: "OPPO官网商城",
      meta: [
        {
          name: "description",
          content:
            "OPPO专区，官方正品，最新最全的OPPO手机产品以及配件在线抢购！",
        },
        {
          name: "keywords",
          content: "OPPO商城，OPPO专区, OPPO手机，OPPO配件，OPPO, OPPO官网商城",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        // { rel: "stylesheet", href: "https://liujun.css" }
      ],
      noscript: [{ children: "Javascript is required" }], // 如果用户禁用了js，显示的内容
    },
  },
```







##  scrollbar-gutter: stable;作用

### 让滚动条一直显示，而不是触发某些事件再显示，导致页面跳动





# 怎么用ai ，把效果图发给ai，自己审阅就行

### 注意先把框架比如variable.scss中的wrapper.scss以及bgcolor这些定好

- 如何告诉ai去里面拿基本样式配置







## https://github.com/chuckbiu/oppo-web-nuxt
