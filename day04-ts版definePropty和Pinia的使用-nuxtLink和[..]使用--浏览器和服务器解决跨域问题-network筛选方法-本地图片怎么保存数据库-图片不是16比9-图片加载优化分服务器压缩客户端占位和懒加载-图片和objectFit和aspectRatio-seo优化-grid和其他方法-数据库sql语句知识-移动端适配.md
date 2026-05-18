# 知识补充（h3）

### h3可以跨平台容易

# 一。OPPO手机商城

## 1.NavBar

### 右边图标（是个svg，位置xx）下还有设置了个title，为seo优化

- 点击跳转到首页即“/”

### 左边搜索框再封装为组件，位置：components/search/index.vue

![](C:\Users\MJL\Desktop\javascript\18-后端渲染-SSR-Vue-React\2nav-bar.png)





## 2.网络请求的封装

### 先找到封装好的文件 （server/index.ts)

### server/home.ts 组件写好

### 自己尝试使用，培养自己喜欢上ts







## 3.Pinia的集成

- store的action存放网络请求罗技
- 首页面加载，触发action，使store初始化的变量具有值
  - 变量还要设置类型标注（因为是ts）
- 其他页面需要就从store里面拿就行



## 补充

### 拿到navbar后在navbar的列表中遍历，而不是固定数据（也就是动态数据）

### navbar数据添加

- 数据库添加值
  - 4个插入语句，type和title要和和红木相关，link那个字段用nuxt官网就行
- 选中样式凸显，而且跳转对应页面

### 实现方法的学习

```ts
// components/navbar/index.vue 
<nav class="nav-bar__menu">
    <NuxtLink
      v-for="item in navbars"
		。。。。
      :to="`/nav/${item.type}`" // 触发去到对应路由
    >
      {{ item.title }}
    </NuxtLink>
  </nav>
```

- 疑问解答：只要是pages/nav.vue 或pages/nav/index.vue 则路由路径就是pages/nav或pages/nav/index.vue，不用自己导入

  - 这里pages/nav/[type].vue这一个路由就可以接受上面的:to="`/nav/${item.type}`" 来的不同来的点击

    - 条件是你跳转的页面都一样，只有数据不同

      ```ts
      pages/nav/[type].vue
      <template>
        <div style="padding: 24px;">
          {{ type }}
        </div>
      </template>
      
      <script setup lang="ts">
      const route = useRoute()
      const type = computed(() => String(route.params.type || ''))
      </script>
      ```

      - 这里不是（每个页面不是只有数据不一样，而是页面都不一样），所以不能使用pages/nav/[type].vue







## 问题：浏览器访问有跨域问题

### 解决：浏览器里做跨域问题的处理 或者服务器做

#### 浏览器做

##### 一般使用后端来处理，要是让前端来处理，则其框架如vite，webpack需要有proxy的功能

##### 开发

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    server: {
      proxy: {
        '/api': { 
          target: 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '') 
        }
      }
    }
  }
})

上面代码解释
proxy: { '/api': { target: 'http://localhost:8000', ... } }
那么你请求必须写成：
/api/oppo/info 才能被代理，代理转发的url是/oppo/info（api没了，因为rewrite: (path) => path.replace(/^\/api/, '') ）


例 2：你改成 /oppo
配置：
ts
proxy: { '/oppo': { target: 'http://localhost:8000', ... } }
那么你请求就要写：
/oppo/info
        
rewrite的作用就是避免和页面路由冲突（比如你有页面路由 /oppo、/login）
一眼看出这是“接口请求
```

- 为什么上面代码只能开发中使用原因

  - **构建并部署**（`nuxt build` / `nuxt start` 或部署到服务器）时：

    - **Vite Dev Server 不存在了**
    - 线上运行的是 **Nitro 服务器**（或静态托管），自然也就没有 `vite.server.proxy` 这一层可以帮你转发

    所以它“只能开发用”，不是 Nuxt 限制，是 **你代理所在的那个服务器（Vite）只在开发启动**

##### 生成环境

- server/api/oppo/[...path].ts

```ts
import { proxyRequest, getRequestURL } from 'h3'

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const upstream = 'http://localhost:8000'
  const target = new URL(`/oppo${url.pathname.replace(/^\/api\/oppo/, '')}${url.search}`, upstream)
  console.log(url,'我的url');
  /* 
    URL { href: 'http://localhost:3001/api/oppo/info',                              20:58:17
    origin: 'http://localhost:3001',
    protocol: 'http:',
    username: '',
    password: '',
    host: 'localhost:3001',
    hostname: 'localhost',
    port: '3001',
    pathname: '/api/oppo/info',
    search: '',
    searchParams: URLSearchParams {},
    hash: '' } 我的url
  */
  
  return proxyRequest(event, target.toString())
})

```

```ts
service.index.ts (作用就是访问服务器的ts+usefetch那个)
const BASE_URL = "/api/oppo"; // 原来是const BASE_URL = "http://localhost:8000/oppo";
// 修改原因就是让浏览器请求你的 Nuxt：`/api/oppo/**，`这样**浏览器永远同源请求**
```

- 原理：
  - 浏览器请求你的 Nuxt：`/api/oppo/**`
  - Nuxt 服务端（Nitro）转发到后端：`http://localhost:8000/oppo/**`
  - 这样**浏览器永远同源请求**，不会有 CORS 跨域问题（开发/生产都成立）

#### 服务器做（推荐）

##### 服务器里用 Nginx 反向代理（线上常用）

你写的这种配置：

```nginx
server {
  listen 80;
  server_name _;

  location / {
    proxy_pass http://127.0.0.1:3002;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

它的作用是：

- 用户访问 `http://你的域名/`
- Nginx 转发到你机器上的 Nuxt（例如 `127.0.0.1:3002`）

这个配置本身主要解决的是：

- 统一对外端口（80/443）
- HTTPS 终止（你后续配 443）
- 让 Nuxt 应用跑在内网端口，不直接暴露

###### 那它能不能“解决跨域”？

它可以帮助你解决跨域，但关键点是：**让浏览器只请求同源域名**。

例子：

- 页面地址（公网 IP）：`http://47.120.10.20/`
- 如果你在浏览器直接请求后端：`http://47.120.10.20:8000/oppo/info` -> 这就是跨域（端口不同）
- 如果你改成请求同源：`http://47.120.10.20/api/oppo/info` -> 这就不跨域

然后把 `/api` 这一段交给 Nginx 或 Nuxt 去转发到真实后端。

###### 域名/IP 为什么有时候不用写端口？

- `http://47.120.10.20` 等价于 `http://47.120.10.20:80`
- `https://47.120.10.20` 等价于 `https://47.120.10.20:443`

只有当你用的不是默认端口（比如 `8000`、`3002`）时，才需要写 `:8000`、`:3002`。

###### 一种常见写法：Nginx 同时代理 Nuxt 和后端 API

```nginx
server {
  listen 80;
  server_name 47.120.10.20;

  location / {
    proxy_pass http://127.0.0.1:3002;
  }

  location /api/oppo/ {
    proxy_pass http://127.0.0.1:8000/oppo/;
  }
}
```

这样浏览器永远请求 `http://47.120.10.20`（80 端口默认可省略），就不会触发 CORS。

###### 这时候浏览器会不会访问 8000 端口？

不会。

- 浏览器只会访问：
  - `http://47.120.10.20/`（页面）
  - `http://47.120.10.20/api/oppo/info`（接口）
- Nginx 收到 `47.120.10.20` 的请求后：
  - 看到路径是 `/` -> 转发给 Nuxt：`127.0.0.1:3002`
  - 看到路径是 `/api/oppo/` -> 转发给后端：`127.0.0.1:8000/oppo/`

也就是说：

- **对浏览器来说**：永远是同一个地址 `http://47.120.10.20`（同源）
- **8000 端口**：是服务器内网服务，给 Nginx/服务器内部访问的

###### 那还需要后端的 CORS 中间件（app.use...）吗？

看你“浏览器到底有没有跨域直连后端”。

- 如果你已经用 Nginx（或 Nuxt server/api）把接口做成同源：
  - 浏览器请求的是 `http://47.120.10.20/api/...`
  - **一般不需要**再在后端额外写 CORS（因为已经不跨域了）
- 如果你仍然让浏览器直接请求后端域名/端口：
  - 例如页面在 `http://47.120.10.20/`，接口请求写成 `http://47.120.10.20:8000/oppo/info`
  - 这就跨域了，**才需要**后端开启 CORS（或 Nginx 做同源代理）

下面这段 `app.use(...)` 属于“后端直接对外提供接口时”的通用 CORS 方案：

```js
app.use(async (ctx, next) => {
  // 1) 获取浏览器发来的 Origin（跨域请求来源）
  const requestOrigin = ctx.get("Origin");// 从浏览器发来的请求头里，拿到当前是谁在请求你接口（比如 http://47.120.10.20）。

  // 2) 设置允许跨域的来源
  // - 如果有 Origin：回显该 Origin（常用做法，便于后续支持 cookie）
  // - 如果没有 Origin：说明可能是同源/非浏览器请求，兜底允许所有
  if (requestOrigin) {
    ctx.set("Access-Control-Allow-Origin", requestOrigin);// 放行当前域名的跨域请求，让接口能正常返回数据。
    // 3) 告诉缓存：该响应会因 Origin 不同而不同，避免 CDN/代理缓存串数据
    ctx.set("Vary", "Origin");
  } else {
    ctx.set("Access-Control-Allow-Origin", "*");
  }

  // 4) 允许跨域请求使用哪些 HTTP 方法
  ctx.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");

  // 5) 允许跨域请求携带哪些请求头
  // - 优先使用浏览器预检请求带的 Access-Control-Request-Headers
  // - 否则兜底允许常用的 Content-Type / Authorization
  ctx.set(
    "Access-Control-Allow-Headers",
    ctx.get("Access-Control-Request-Headers") || "Content-Type, Authorization"
  );

  // 6) 处理预检请求（preflight）
  // - 浏览器在跨域且“非简单请求”时会先发 OPTIONS
  // - 这里直接返回 204，表示允许并结束请求
  if (ctx.method === "OPTIONS") {
    ctx.status = 204;
    return;
  }

  // 7) 继续执行后面的中间件/路由
  await next();
});
```





## 待解决：nuxt的控制台的network好多网络请求

### 一般控制台network中筛选xhr/fetch就可以







## 4.Swiper 和 Element Plus的集成

### 本地图片(非网络图片）怎么保存到数据库中，只能postman一一保存吗

- 不用postman，来保存本地图片，方法一

```js
// 静态资源托管：static 目录不带前缀
// 例如：static/pic1.png -> http://localhost:8000/pic1.png
const staticPath = path.resolve(__dirname, "../../static");
app.use(koaStatic(staticPath));
```

- 方法二：把图片变为网络地址，再保存



### 解决 图片不是16：9 

```js
算法（解决图片不是16：9 ）
const el = rootRef.value // 获取对应元素
if (!el) return
const width = el.clientWidth || 0 // 获取元素宽度
if (!width) return
const height = (width * 9) / 16 //强制让宽高转为16/9
```

全部过程

```ts
<!-- @load：图片加载成功时触发 -->
<!-- @error：图片加载失败时触发 -->
<img
  class="swper__img"
  :src="item.picStr"
  alt=""
  @load="index === 0 ? onFirstImgLoad() : undefined"
  @error="index === 0 ? onFirstImgLoad() : undefined"
/>

const rootRef = ref<HTMLElement | null>(null)
const carouselHeight = ref('0px')
let ro: ResizeObserver | null = null
function updateHeight() {
  const el = rootRef.value
  if (!el) return
  const width = el.clientWidth || 0
  if (!width) return
  const height = (width * 9) / 16
  carouselHeight.value = `${Math.round(height)}px`
}

function onFirstImgLoad() {
  firstImgLoaded.value = true
}

onMounted(() => {
  updateHeight()
  const el = rootRef.value
  if (!el) return

  // 监听容器尺寸变化（例如窗口缩放/布局变化），重新计算 16:9 高度
  ro = new ResizeObserver(() => updateHeight())
  // 开始观察该元素尺寸
  ro.observe(el)
})

onBeforeUnmount(() => {
  // 组件卸载时停止观察，避免内存泄漏/重复回调
  ro?.disconnect()
  ro = null
})

watch(
  () => banners.value[0]?.picStr,
  (url) => {
    if (!url) return
    if (!import.meta.client) return
    firstImgLoaded.value = false
    // 预加载第一张图：不插入 DOM，只为了更早知道图片是否可用
    const img = new Image()
    // 加载成功则隐藏占位
    img.onload = () => onFirstImgLoad()
    // 加载失败也隐藏占位：避免因为首图异常导致占位一直挡住页面
    img.onerror = () => onFirstImgLoad()
    img.src = url
  },
  { immediate: true }
)
```

###### 1) `ro = new ResizeObserver(() => updateHeight())`

- **`ResizeObserver`** 是浏览器提供的 API，用来监听某个 DOM 元素的**尺寸变化**（宽/高变化）。
- 这里的意思是：只要轮播容器尺寸变了，就执行 updateHeight()，重新计算 16:9 的高度。

###### 2) `ro.observe(el)`

- 把刚创建的 `ResizeObserver` **绑定到元素 `el` 上**，开始真正“观察”它。
- 没有这句，observer 只是创建了但不会生效。

###### 3) `ro?.disconnect()`

- `disconnect()` 表示 **停止观察**（解绑所有被观察的元素）。
- 之所以写 `ro?.disconnect()` 是为了安全：如果 `ro` 还没创建成功（为 `null`），不会报错。

###### 4) `ro = null`

- 把引用清空，方便 GC 回收，也避免后续误用旧的 observer。
- 这是配合 `disconnect()` 做的**清理**。

```ts
const img = new Image()
img.onload = () => onFirstImgLoad()
img.onerror = () => onFirstImgLoad()
```

- **`new Image()`**：在浏览器里创建一个“离屏图片对象”（不会插入 DOM），专门用来**预加载**图片资源。
- **[img.onload](cci:1://file:///c:/Users/MJL/Desktop/javascript/18-%E5%90%8E%E7%AB%AF%E6%B8%B2%E6%9F%93-SSR-Vue-React/02-Nuxt/14-oppo-nuxt/components/swper/index.vue:74:4-74:39)**：当图片 URL 成功下载并可用时触发。这里触发后调用 [onFirstImgLoad()](cci:1://file:///c:/Users/MJL/Desktop/javascript/18-%E5%90%8E%E7%AB%AF%E6%B8%B2%E6%9F%93-SSR-Vue-React/02-Nuxt/14-oppo-nuxt/components/swper/index.vue:37:0-39:1)，把 `firstImgLoaded` 置为 `true`，从而**隐藏占位 logo**。
- **[img.onerror](cci:1://file:///c:/Users/MJL/Desktop/javascript/18-%E5%90%8E%E7%AB%AF%E6%B8%B2%E6%9F%93-SSR-Vue-React/02-Nuxt/14-oppo-nuxt/components/swper/index.vue:75:4-75:40)**：当图片下载失败（404/网络错误/被拦截）时触发。这里也调用 [onFirstImgLoad()](cci:1://file:///c:/Users/MJL/Desktop/javascript/18-%E5%90%8E%E7%AB%AF%E6%B8%B2%E6%9F%93-SSR-Vue-React/02-Nuxt/14-oppo-nuxt/components/swper/index.vue:37:0-39:1)，目的不是“认为加载成功”，而是为了**避免占位一直卡住**——就算第一张图坏了，也要让页面继续展示轮播结构/后续图片。

这段整体的意图是：  
- **首张图能加载** -> 占位消失  
- **首张图加载失败** -> 占位也消失（不阻塞页面）



#### @load 和 Image 不冲突了吗

它们是一个**幂等操作**（重复执行也还是 true，不会产生副作用）。
所以哪一个先触发都行：

- 预加载先触发(image) -> 占位先关
- DOM 图后触发 -> 再执行一次也没影响

##### 那为什么两套都要？

严格来说不是必须“两套都要”，你可以只留一套。
我保留两套是为了更稳：

- **预加载**：让占位尽快消失（体验更好）
- **DOM 事件**：作为显示层的兜底（更直观）





###  解决 图片加载慢

###### 服务器



###### 前端：就是上面的占位符（使用resizeObserver 和 Image 方法）





### 服务器返回的图片宽高不同，但轮播图的每张图片都是一样的宽高了

#### 1) 轮播容器被固定成同一个高度（16:9）

轮播组件外层（`.swper`）被我们计算出一个固定的像素高度 `carouselHeight`，并传给 `ElCarousel`：

- 宽度来自页面布局（比如 `.wrapper` 的宽度）
- 高度按 `宽 * 9 / 16` 算出来

因此不管服务器返回图片原始比例是 1:1、4:3、3:4……
**轮播可视区域永远都是同一块 16:9 的“窗口”**。

#### 2) 图片被强制铺满这个窗口（`object-fit: cover`）

每张 `<img>` 被设置为：

- `width: 100%`
- `height: 100%`
- `object-fit: cover`

##### 缺点：你把 `cover` 换成 `contain`，你会看到“图片完整显示但出现留白

解决缺点：就是服务器返回的图片尽量是同一宽高比



## 5.Grid-view

### 实现catogory 

- 因为可能复用，所以component/tab-category

- 导入pages/index中

- 难点

  - ts版 tab-catogory把事件而且携带对应参数 传递 给 pages/index（只打印传来的数据就行）

    - 难道就是携带的参数要有类型
    - 而且还有个函数类型要标明

    ```ts
    组件内
      <button
        type="button"
        @click="onSelect(item)"
      >
    import { useHomeStore } from '~/store/home'
    import type { CategoryItem } from '~/store/home'
    
    const emit = defineEmits<{
      (e: 'select', item: CategoryItem): void
    }>()
    
    const homeStore = useHomeStore()
    const categorys = computed(() => homeStore.categorys)
    
    function onSelect(item: CategoryItem) {
      emit('select', item)
    }
    
    组件外
    <TabCategory @select="onSelect" />
    import type { CategoryItem } from '~/store/home'
    function onSelect(item: CategoryItem) {
      console.log(item)
    }
    ```

    

![](C:\Users\MJL\Desktop\javascript\18-后端渲染-SSR-Vue-React\04category.png)

#### 待确定：看ai对图片用的是什么方法使图片排列好

```vue
.tab-category__img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
```



### 实现grid-view

#### 数据库

##### 问题：外键作用是什么

​	外键就是数据库层面的“**引用关系约束**”，用来保证两张表之间的数据一致性。

以你这里为例：

- `oppo_productDetail.category_id` **引用** `oppo_category.id`

如果加了外键：

###### 1) **防止“脏数据”**

- **没有外键**：你可以插入一条商品明细 `category_id = 99999`，但分类表里根本没有 `id=99999`，数据库也不会拦你
- **有外键**：数据库会直接报错，阻止这条“找不到分类”的商品明细写入

###### 2) **联动删除（你写了 `ON DELETE CASCADE`）**

- 当你删除某个分类 `oppo_category.id = 1`：
  - **有外键 + CASCADE**：会自动把这个分类下的 `oppo_productDetail` 也删掉（活动表也能继续 cascade）
  - **没有外键**：分类删了，但商品明细还留在库里，变成“孤儿数据”，后续查询要靠你自己处理

###### 3) **让关系更明确**

数据库层就能看出“这张表属于谁”，后续维护和排查更直观。



##### 问题：oppo_product_activity（一对多） 为啥这个是一对多，而oppo_priceInfo是一对一，他们都是对应oppo_productDetail的 ext_id

为什么 `oppo_product_activity` 是“一对多”？

在你的前端类型里：

```ts
activityList?: IActivity[];
```

`activityList` 是 **数组**，含义就是：

- **一个** `IProductDetail`（一个商品）
- 可以有 **多条** `IActivity`（多条活动文案/标签）

所以数据库上自然是：

- `oppo_productDetail` 1 行
- 对应 `oppo_product_activity` 多行
  => **一对多**

------

为什么 `oppo_priceInfo` 是“一对一”？

在你的前端类型里：

```ts
priceInfo?: IPriceInfo;
```

`priceInfo` 是 **一个对象**（不是数组），含义就是：

- 一个商品只有一份价格信息（前缀/价格/币种）

所以数据库上：

- `oppo_productDetail` 1 行
- 对应 `oppo_priceInfo` 1 行
  => **一对一**



##### 问题：  sql语句：CONSTRAINT fk_oppo_productDetail_category    FOREIGN KEY (category_id) REFERENCES oppo_category(id)    ON DELETE CASCADE这是什么意思

1) `CONSTRAINT fk_oppo_productDetail_category`

- 只是给这条约束起个名字：`fk_oppo_productDetail_category`

- 方便你以后 `SHOW CREATE TABLE` 查看或 `ALTER TABLE ... DROP FOREIGN KEY ...` 删除它

  - 是删除这个外键约束（**不删表，只删约束**），用下面这条 SQL 就行：

    ```sql
    ALTER TABLE oppo_productDetail
      DROP FOREIGN KEY fk_oppo_productDetail_category;
    ```

    ## 注意点（避免你执行时报错）

    - **约束名必须完全一致**。如果你不确定名字，先查一下真实名字：

    ```sql
    SHOW CREATE TABLE oppo_productDetail;
    ```

    或者：

    ```sql
    SELECT CONSTRAINT_NAME
    FROM information_schema.REFERENTIAL_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
      AND TABLE_NAME = 'oppo_productDetail';
    ```

    ## 可能还会留下一个索引（可选删除）

    MySQL 建外键时通常会在 `category_id` 上建索引。删了外键后索引可能还在（不影响使用）。如果你也想删索引，需要先 `SHOW INDEX FROM oppo_productDetail;` 看索引名再删：

    ```sql
    ALTER TABLE oppo_productDetail
      DROP INDEX idx_name_here;
    ```

2) `FOREIGN KEY (category_id) REFERENCES oppo_category(id)`

- 声明：`oppo_productDetail.category_id` 是外键
- 它引用（references）`oppo_category` 表的 `id`
- **效果**：你插入/更新 productDetail 时，如果 `category_id` 在 `oppo_category.id` 里不存在，数据库会拒绝（报错）

3) `ON DELETE CASCADE`

- 当你删除一条分类 `oppo_category.id = 1`：
  - 数据库会**自动删除**所有 `oppo_productDetail.category_id = 1` 的记录
  - 这叫“级联删除”（cascade）



##### 问题：数据库中3个id各自作用

表本身的id，ext_id,和关联另一张表的category_id

这里只解释ext_id的作用

**已经有 id + product_detail_id，为什么还要 ext_id？**

答案只有一句话：

**因为你要从外部爬虫 / 接口同步数据！**

------

例子（一看就懂）

你从 OPPO 官网爬一个商品：

```
外部接口给你：
商品编号：12345
名称：OPPO Find X7
```

你存进数据库：

```
数据库自己生成 id：1
外部编号 ext_id：12345
名称：OPPO Find X7
```

第二天，你又爬了一次！

外部接口又给你：

```
商品编号：12345
名称：OPPO Find X7（新版）
```

问题来了：

你怎么知道这是**同一条商品**，不是新商品？

靠 **id=1** 吗？

不行！因为外部系统**不知道你内部的 id**！

只能靠 **ext_id=12345**！

------

 ext_id 唯一的 3 个作用

1. **去重**：不重复插入同一条外部数据
2. **更新**：外部数据变了，能找到库里对应的那条
3. **溯源**：知道这条数据来自外部哪条记录

没有 ext_id 会怎样？

你每次爬数据，都会**重复插入一堆一模一样的商品**！



##### sql语句知识补充(设置变量)

```sql
SET @pd1 = (SELECT id FROM oppo_productDetail WHERE url='http://localhost:8000/prddt1.webp' ORDER BY id DESC LIMIT 1); // 把对应id赋值给@pd1 
SET @pd2 = (SELECT id FROM oppo_productDetail WHERE url='http://localhost:8000/prddt2.webp' ORDER BY id DESC LIMIT 1);
```



#### sql语句知识补充

```sql
SELECT JSON_OBJECT(
  'navbars', (
    SELECT COALESCE( // 第一个参数为null则取第二个参数
      JSON_ARRAYAGG(t.j),//这里是.不是，
      JSON_ARRAY()
    )
    FROM (
      SELECT JSON_OBJECT(
        'id', id,
        'title', title,
        'type', type,
        'link', link,
        'seq', seq
      ) AS j
      FROM oppo_navbar
      ORDER BY seq
    ) t
  ),
```

- **t** = 里面那层查询结果的**临时表名**

  - **SQL 语法强制要求：**

    只要你把**一段查询结果当成表来用**，

    就**必须给它起一个别名**（随便叫什么，t 最简单）

- **j** = 里面每一行的 **JSON 对象别名**

- **t.j** = 这个临时表里的 JSON 数据





### 需求：实现前端具体效果1

![](C:\Users\MJL\Desktop\javascript\18-后端渲染-SSR-Vue-React\05_grid-view.png)

- 放置位置：整体放置于components/grid-view/index.vue里面遍历具体项目,每个具体项目放置于components/grid-view-item/index.vue中

- components/grid-view/index.vue导入pages/index.vue中显示

- 难点：一行5个项目，每个项目width：20%，那5个项目中间还要设置宽度怎么计算

  - 解决：设置padding-right，让它突出（然后设置margin-right为负值来抵消）

    ```css
    .grid-view__inner {
      display: flex;
      flex-wrap: wrap;
      margin-right: -20px;
    }
    
    .grid-view__cell {
      width: 20%;
      padding-right: 20px;
      box-sizing: border-box;
      margin-bottom: 20px;
    }
    ```

  

- 方式二：使用grid

  ```css
  .grid-view__inner {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 20px;
  }
  ```

  



## 知识：网络请求设置防炸属性

```ts
const { data, error } = await getHomeInfo()
if (error.value) {
    this.navbars = []
    this.banners = []
    this.categorys = []
    return
}

const payload = data.value?.data
const navbars = payload?.navbars ?? []
const banners = payload?.banners ?? []
const categorys = payload?.categorys ?? []
```



#### 问题：是图片一能占满grid-view-item，而且图片内容要显示全，然后我再浏览器对着宽高跳转才弄成这样，还有为什么你这使用的是article标签，然后@index.vue 是section标签呢

```css
.grid-view-item__img {
  width: 100%;
  aspect-ratio: 183 / 260;
  object-fit: cover;
  display: block;
}
```

-   aspect-ratio: 183 / 260;怎么得出

  原本是

  ```
  .grid-view-item__img-wrap {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  
  .grid-view-item__img {
    height：xxpx;
    width:xxpx;
    object-fit: cover;
    display: block;
  }
  ```

  - 怎么得出：方法直接对着height和width逐渐调整知道满足自己的两个需求

    1. 图片一能占满
    2. 图片内容要显示全

  - 为什么不直接使用width和height的具体值

    - **图片宽度跟随卡片**：`width: 100%`（别写死 183px）
    - **高度用比例锁定**（接近你现在的 183/260）：`aspect-ratio: 183 / 260`

    - 这样你仍然能得到“跟现在差不多的效果”，但当屏幕变化、列数变化时会更稳定。

  

#### 标签 `article` / `section`？

这是 HTML 语义化标签，不影响布局，本质和 `div` 一样（默认都是块级元素）。

- `section`：表示“页面里的一个**区块/章节**”
  - `grid-view` 是一整个模块（新品家具这一块），用 `section` 合理
- `article`：表示“一个**独立的条目**”
  - `grid-view-item` 每个商品卡片可以被当作独立条目，用 `article` 也合理

你如果不喜欢语义标签

完全可以都换成 `div`，不会影响样式和功能。我可以按你的偏好改。



#### 怎么看有无seo优化

- network选择locathost，找到preview哪里的文本就是爬虫可以获取的数据
  - **对一部分爬虫是对的**：如果爬虫像浏览器一样去请求页面 HTML（SSR/SSG 输出），那你在 `Network -> Doc -> Response/Preview` 里看到的 **初始 HTML**，通常就是它能直接抓到的内容。
  - **但不绝对**：不同爬虫能力不一样。
    - 有些只抓 **HTML 源码**（不执行 JS）
    - 有些会 **执行 JS**（比如 Googlebot 大多数情况下可以，但也不是“像真实浏览器一样 100%”）
- 或者查看网络源代码，里面的文本，爬虫也可以获取
  - 网页源代码（View Page Source / 或 Network 的 Response）就是服务器返回的 HTML。
  - 如果关键内容（标题、描述、H1、正文核心文本、链接）**已经在 HTML 里**，那对“不会跑 JS 的爬虫”也友好



### 需求：实现前端具体效果2

- 遍历效果一

  - componets/section-category/index.vue 来遍历 上面 grid-view

  - 里面有个字段firstItemPicStr（图片链接），他要传入到grid-view，且占据2个item位置

    - firstItemPicStr没有就正常显示

    ```css
    占据2个item位置
    方式一：使用grid
    .grid-view__inner {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 20px;
    }
    
    .grid-view__cell {
      min-width: 0;
    }
    
    .grid-view__cell--first {
      grid-column: span 2; // 这里
      padding: 6px 0;
    }
    
    // 方法二
    .grid-view__inner {
      display: flex;
      flex-wrap: wrap;
      margin-right: -20px;
    }
    
    .grid-view__cell {
      width: 20%;
      padding-right:  20px;
      box-sizing: border-box;
      margin-bottom: 20px;
      min-width: 0;
    }
    
    .grid-view__cell--first {
      width: 40%;
      // padding: 6px 0;
    }
    
    ```

    

- 前端修改代码

  - components里面数据都是pages里面获取stores然后再传入到components里面使用的

- 数据库添加对应数据





### 前端需求：点击navbar四个按钮，跳转到当前页面具体grip-view部分

实现方式

- 仍在首页，只滚动（即不改变路由）

- 还是希望路由变成类似 `/#hongmu-zone` 这种 hash（更像锚点）

  ```ts
  nav-bar.vue
  <NuxtLink
    v-for="item in navbars"
    。。。。。
    :to="{ path: '/', hash: `#${item.type}` }"
  >
    {{ item.title }}
  </NuxtLink>
  
  
  -----------------------
  .grip-view
  <div
    v-for="category in categorys"
    :key="category.id"
    class="section-category__item"
    :id="getAnchorId(category)"
  >
      
  function getAnchorId(category: CategoryItem) {
    if (!category.titleForGrid) return undefined
    const match = props.navbars.find((n) => n.title === category.titleForGrid)
    return match?.type
  }
  
  async function scrollToHash(hash: string | undefined | null) {
    if (!import.meta.client) return
    const id = String(hash || '').replace(/^#/, '')
    if (!id) return
    await nextTick()
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  
  const route = useRoute()
  watch(
    () => route.hash,
    (hash) => {
      scrollToHash(hash)
    },
    { immediate: true }
  )
  ```

  



## 6.详情页面



## 移动端适配

### 方案 1：纯 CSS 响应式（这里用这个）

核心思路：

- **不改路由、不搞多套页面**
- 用 `@media` + 弹性布局把 PC 样式“折叠”为移动端样式

#### 你项目里要改的点（思路）

- **[viewport]** 确保有：

  - `width=device-width, initial-scale=1`（你 

    nuxt.config.ts

     里已经有）

    

- **[wrapper]** `.wrapper` PC 固定宽度要在移动端变成 `width: 100%` + `padding`

- **[Header/Nav]**

  - PC 的多链接在移动端改成：
    - 只保留 Logo + 搜索图标/输入框
    - 菜单变成横向滑动（`overflow-x: auto`）或汉堡按钮

- **[轮播]**

  - 你现在轮播 16:9 是合理的，移动端也能直接复用

#### 适合场景

- 页面结构差不多，只是“排版变”
- 最省事、最稳、SSR 也最友好

------

### 方案 2：根据屏幕尺寸切换组件（响应式 + 组件分离）

核心思路：

- PC 用 `NavBarPc.vue`
- 移动端用 `NavBarMobile.vue`
- 在同一个页面里根据断点选择渲染哪一个

你可以用：

- CSS 隐藏/显示（最简单）
- 或者 JS 监听断点（`matchMedia` / composable）来切换

#### 适合场景

- 移动端交互差异很大（比如抽屉菜单、底部 TabBar）

------

### 方案 3：rem / vw 方案（更“设计稿驱动”）

核心思路：

- 以设计稿（比如 375）为基准
- 用 `rem` 或 `vw` 自动缩放所有尺寸

Nuxt 里常见做法是：

- `postcss-pxtorem`（px 自动转 rem）
- 或者手写 `vw` 方案

#### 适合场景

- UI 完全按设计稿走，尺寸要整体缩放
- 但对你现在这种“PC 布局”为主的项目，反而可能更绕



## 方案一

```css
@media (max-width: 768px) {
  .nav-bar__inner {
    height: auto; // 让高度自动适应内容
    flex-wrap: wrap; // 允许换行
  }
```

##### flex 里面 order

- 设置排列顺序：比如包裹3个元素，order越小排越前面

##### flex：x x x;

- 1. 第一个参数：**flex-grow**

  **意思：有多余空间时，我分多少**

  - 数字越大，分得越多
  - 默认是 **0** → 不抢空间
  - 写 **1** → 自动占满剩余空间

  **大白话：我要占满剩下的地方！**

  ------

  ###### 2. 第二个参数：**flex-shrink**

  **意思：空间不够时，我缩不缩**

  - 默认 **1** → 会压缩
  - 写 **0** → 绝不压缩（固定宽度）

  **大白话：空间不够时，我别被挤扁！**

  ------

  ##### 3. 第三个参数：**flex-basis**

  **意思：我的基础宽度 / 高度是多少**

  - 可以写 `px`、`%`、`auto`
  - 默认 **auto** → 看内容大小
  - 写 **0** → 完全按比例分配（最常用



##### 元素多出可以滚动,而且图片不会压缩那些

```css
@media (max-width: 768px) {
  .tab-category__inner {
    justify-content: flex-start;
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: 6px;
  }

  .tab-category__inner::-webkit-scrollbar {
    display: none; //隐藏横向滚动条（只隐藏“滚动条 UI”，不影响滚动功能）。
  }

  .tab-category__item {
    flex: 0 0 auto;
  }
}
```

##### 要是移动端突然又不行了，浏览器原因，多刷新几次又可以了



## 那个服务器压缩图片还没看

- 核心就这些，其他代码都是获取输入和输出的文件路径

```js
const inputStat = fs.statSync(inPath);

await sharp(inPath)
  .resize({ width, withoutEnlargement: true })
  .webp({ quality })
  .toFile(outPath);

const outputStat = fs.statSync(outPath);
```

- 上面代码解释



## 上面项目相对单纯vue项目的优势

### 结论：Nuxt = Vue + 一整套“生产级能力”的默认集成

你这个 `14-oppo-nuxt` 项目本质还是写 Vue 组件，但 Nuxt 帮你把「路由、SSR、接口层、SEO、构建部署」这些工程化问题直接打包成框架能力。

### 1) SSR/SSG/ISR：首屏更快 + SEO 更稳

- 单纯 Vue SPA（纯 Vue + Router）默认是 CSR：
  - 首屏通常返回一个空壳 HTML，真实内容靠 JS 跑完再渲染
  - 不跑 JS 的爬虫/分享卡片/首屏体验会受影响
- Nuxt 默认支持 SSR（也可配 SSG/ISR/按路由规则混合）：
  - 你在 `nuxt.config.ts -> app.head` 配的 `title/meta` 会在服务端输出到 HTML
  - Network 的 Document 里就能看到真实内容，更利于 SEO/首屏

### 2) 约定式路由：少写路由配置，目录即路由

- 单纯 Vue：一般要自己维护 `router/index.ts`，新增页面要手写路由表
- Nuxt：
  - `pages/` 自动生成路由
  - 动态路由（如 `[id].vue`）、嵌套路由等都有固定写法
  - 结构更统一，协作成本更低

### 3) 同源接口与跨域：生产环境也能用的“服务端中转”

- 单纯 Vue：
  - 开发时靠 Vite/webpack proxy 解决跨域
  - 上线后如果是纯静态托管，proxy 就没了，跨域需要你自己处理（后端开 CORS 或另起 BFF）
- Nuxt：
  - 可以用 `server/api/**` 写接口/代理，把浏览器请求变成同源（你文档里 `/api/oppo/**` 的方式）
  - 开发/生产都成立（上线后是 Nitro 在跑）

### 4) 数据获取与状态：SSR 友好的数据流

- 单纯 Vue：请求通常发生在浏览器，首屏需要等接口返回
- Nuxt：支持在服务端阶段就把数据准备好（例如 `useFetch` / `useAsyncData`），再把结果带到客户端 hydration
  - 对首屏体验、SEO、分享预览都更友好
  - 你项目里又结合了 `@pinia/nuxt`，初始化/复用状态更自然

### 5) 性能与策略：缓存/预渲染/按路由混合渲染更顺手

- Nuxt/Nitro 的缓存、`routeRules`、预渲染等能力，让你把“优化”从手工工程变成配置化/框架化。
- 对你这个商城类首页（banner/grid/category）更常见的收益：
  - 首屏更快
  - 更容易做页面级缓存策略
  - 更容易做静态化（landing 类页面）

### 6) 部署更统一：同一个产物包含前端 + Node 服务端

- 单纯 Vue SPA：常见是 build 出静态文件，后端另起项目
- Nuxt：`build` 后得到可部署产物（Node server / serverless / edge 多形态），更适合 SSR 项目的完整交付

### 什么时候“直接用 Vue”更合适？

- 后台系统、对 SEO 不敏感、页面不需要 SSR
- 希望部署到纯静态（CDN）且逻辑简单
- 团队不想引入 Node 服务端运行时

### 你这个 oppo 项目更适合 Nuxt 的原因

- 你已经在用 `app.head` 做 SEO
- 有跨域/代理的需求（你文档里已经写了 Nitro 中转方案）
- 首页内容模块（banner/grid/category）首屏价值高
- 后续要上缓存/预渲染/按路由策略时，Nuxt 会更顺手



# 二。部署（13里面有全过程）

## 1.服务器购买

## 2.连接服务器

## 3.服务器的环境搭建

## 4.打包和部署项目

- 打包的路径不能有中文路径

### 直接用node部署

### PM2来部署

### PM2 + 集群

- 服务器在对应文件夹执行pm2 init simple
  - 就会生成 ecosystem.config.js配置文件





# 三。从零搭建React18 SSR应用

## React SSR静态页面的渲染（内容在day05里面，但视频在day04这里）

