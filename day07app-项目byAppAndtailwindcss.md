## 只使用 App Router（app）

# 1.项目的搭建

### 安装命令

- 创建项目
  - pnpm create next-app@latest project-next-ts
  - 建议选择：TypeScript / ESLint / App Router

- 安装 normalize.css
  - pnpm add normalize.css

- 安装 scss（可选）
  - Tailwind 项目不强依赖 scss
  - 如果你仍然想用 scss：pnpm add -D sass

### 创建目录

- styles/
  - globals.scss
  - variables.scss
  
- 在 app 路由中引入全局样式（App Router）
  - app/layout.tsx 中：
    - import 'normalize.css/normalize.css'
    - import '@/styles/globals.scss'
  
- 配置tsconfig.json
  - 路径别名（让你可以用 @/xxx 引入）
    - tsconfig.json
      - compilerOptions.baseUrl: "."
      - compilerOptions.paths
        - "@/*": ["./*"]
        - "@/components/*": ["components/*"]
        - "@/styles/*": ["styles/*"]
        - "@/assets/*": ["assets/*"]
  
- assets 和 public
  
  图片等静态资源
  
  - 放在 public/：推荐（直接用 url，或配合 next/image）
  - 放在 src/assets/：一般用于被代码 import 的资源（具体是否支持取决于当前 Next 配置）
  - TypeScript 识别图片模块（如果你需要 import png/svg 等）
    - 新建 global.d.ts（或 types/images.d.ts）声明模块：
      - declare module '*.png'
      - declare module '*.jpg'
      - declare module '*.jpeg'
      - declare module '*.webp'
      - declare module '*.svg'



- 配置titile，icon，discricption那些

  - 文件位置：

    ```tsx
    app/layout.tsx
    export const metadata: Metadata = {
      title: "云音乐商城 - 音乐购有趣",
      description:
        "云音乐商城是专注于音乐场景打造的音乐购物平台，包含音乐人周边、3c影音数码、音乐市集等，和我们一起让音乐购有趣，给生活加点料",
      keywords: [
        "数码影音",
      ],
      icons: {
        icon: "/redwood.ico",
      },
    };
    ```



# 2.配置nav 和 实现nav界面

#### nav左侧logo图片的展示问题和tailwind的使用

- 需求是图片高度和外层元素的最大高度相同，而且图片左边对齐左边

- 问题：图片的显示和tailwind知识

  - 为什么h-full设置有时报错

    - ##### `h-full` 的真实含义

      - `h-full` = `height: 100%`
      - `100%` 需要一个“参照高度”
        - 父元素必须有 **确定的高度**（例如 `height: 73px`、`height: 100vh`、或者层层都有明确高度）
      - 报错原因：如果父元素高度是 `auto`（由内容撑开），那子元素 `height: 100%` 就没法计算，表现为：
        - 看起来没生效
        - 或者 Next/Image 还会提示你只改了一个维度导致潜在变形

- 实现方案

  - **不用 `fill`**：必须有 `width` + `height`（推荐，这样图片的宽度就自动得出）

    ```tsx
      <Link href="/" className="flex h-[73px] items-center gap-2">
        <Image
          src="/logo.png"
          alt="logo"
          width={73}
          height={73}
          className="h-[73px] w-auto object-contain object-left"
          priority
        />
    ```

    - `width` / `height`
    - Next 要求你必须提供 `width` 和 `height`
      - 这两个值的核心作用是给 Next/Image 提供 **图片的固有宽高比**（避免图片加载后布局抖动 CLS，并用于生成响应式图片）
      - 实际显示尺寸我们用 Tailwind 控制：`h-[73px] w-auto`
      - 注意：`width/height` 最好写 **原图真实宽高**（至少比例要对），否则最终“自动算出来的宽度”会按你写的比例去算

    - `object-contain`

      - 等价于 `object-fit: contain`
      - 让图片在容器内 **完整显示**、不裁剪，必要时会留白

    - `object-left`

      - 等价于 `object-position: left`
      - 当 `contain` 产生留白时，让图片 **贴左对齐**（而不是默认居中）

    - `priority`
      - 告诉 Next 这是首屏关键图片，优先加载（通常用于 Header/Logo/首屏大图）
      - 不要滥用：太多 `priority` 会影响整体加载调度
    - `className`
      - 在 React/Next 的 JSX 里，用 `className` 来写 CSS 类名（对应原生 HTML 的 `class`）
      - Tailwind 的核心使用方式就是：把“样式”写成一串工具类，拼在 `className` 里
      - 例如这里：`className="h-[73px] w-auto object-contain object-left"`
        - `h-[73px]`：把图片显示高度固定为 73px
        - `w-auto`：宽度自动按图片比例计算（配合 `width/height` 提供的固有比例）
        - `object-contain`：图片完整显示，不裁剪
        - `object-left`：有留白时贴左对齐
    
  - **用 `fill`**：不写 `width/height`，但父容器必须有明确尺寸（宽度要具体）
  
    ```tsx
      <Link href="/" className="flex h-[73px] items-center gap-2">
        <span className="relative h-[73px] w-[160px] shrink-0">
          <Image
            src="/logo.png"
            alt="logo"
            fill
            sizes="160px"
            className="object-contain object-left"
            priority
          />
        </span>
      </Link>
    ```
  
    - `fill`
  
      - 图片会绝对定位铺满父容器（相当于 `position: absolute; inset: 0`）
      - 父容器必须：
        - 有 `relative`
        - 同时有 **明确的宽度和高度**（否则图片会“没尺寸/消失”）
      - 建议补上 `sizes`，告诉浏览器这个图片在页面上大概会占多宽，避免下载过大的资源
  
    
    
    

#### 图标或字体大小tailwind调整方法 和 悬浮hover的tailwind实现

```tsx
<button className="flex items-center gap-1 text-xl text-zinc-700">
  <span className="hover:text-zinc-900">登录</span>
  <span>|</span>
  <span className="hover:text-zinc-900">注册</span>
</button>
```

- `text-*`（字号）
  - 本质是 `font-size`
  - 常用档位：`text-sm`/`text-base`/`text-lg`/`text-xl`/`text-2xl`...
  - 如果你需要精确像素值：用任意值写法 `text-[24px]`
  - 对 emoji / 图标来说，调“大/小”最直接就是改 `text-*`
  
- `leading-none`（行高）
  - 本质是 `line-height: 1`
  - 用途：
    - emoji/箭头这类字符如果行高太大，会出现“看起来上下不居中/占位太高”
    - 配合父容器 `flex items-center` 时，`leading-none` 可以让字符的占位更紧凑，视觉更容易居中
  
- `text-zinc-700 hover:text-zinc-900`（颜色 + hover）
  - zinc
    - 是化学元素**锌（Zn**
    - Zinc 是 Tailwind 内置的**中性冷灰色系**，偏冷静、偏工业感
  
  - `text-zinc-700`：默认文字颜色（偏灰，没那么抢眼）
  - `hover:text-zinc-900`：鼠标移入时变深色，给用户“可点击”的反馈
  - 这类写法通常搭配按钮/链接使用，属于最常见的“默认态 + hover态”模式
  





#### 搜索框的封装和实现

#### 集成redux

- 服务器有redux
- client也有的redux，client需要水合
  - 所以要多安装个库

#### 配置网络请求代码

#### 搜索框点击，和弹出框的实现

#### 弹出框里面的数据是服务器端返回，客户端的redux也保存了对应的数据



## 知识补充：网络请求是通过服务器发送然后保存到客户端的，所以客户端的network看不到请求过程

- 这句话 **大方向是对的**，但需要加上前提：

  - 只有当请求是 **在服务器端发起**（Server Component / Route Handler / Server Action / Node 侧 axios/fetch）时，浏览器 DevTools 的 Network 面板才 **看不到你请求后端接口的那条记录**
  - 因为那次 HTTP 请求发生在 **Node 服务器/Next 服务器**，不是发生在用户的浏览器里

- 你在浏览器 Network 里通常能看到哪些“请求”？

  - **客户端发起的请求一定看得到**
    - 例如在 Client Component 里 `useEffect(() => fetch(...))`
    - 或者点击按钮触发的 `axios.get(...)`
  - **Next 内部请求也可能看得到**（但它不是你直接请求后端接口）
    - 例如 App Router 客户端路由跳转时，会拉取 RSC 数据（常被称为 `flight` 数据）
    - 你看到的可能是对当前站点的请求（例如 `/?_rsc=...` 这类），而不是你真实的后端 API 地址

- 结合本项目（搜索建议 searchData）的理解方式：

  - 你在 `app/layout.tsx`（Server Component）里请求接口拿到 `searchData`
  - 然后把 `searchData` 当 props 传给 `NavBar/Search`（Client Component）去渲染
  - 所以：
    - 浏览器 Network **不会出现** “浏览器 -> 后端 API(/redwood/info)” 的请求
    - 但页面依然能渲染出数据，因为数据已经在服务端拿到并随 HTML/RSC 一起返回了

- 如果你希望“Network 里能看到请求”，就必须把请求放到客户端去做（Client Component 里发请求）。
  - 代价：首屏可能更慢/会闪烁（先空再填充），SEO 也可能更差
  - 好处：交互更灵活，Network 可见，调试更直观



# 3.看network的locathost

- 你会看到很多具体数据
  - 有利于seo优化





# 4.实现banner轮播图

### 数据库

#### 老师数据返回是和其他模块一起返回，怎么办

- 解决：老师的其他数据是不同表，然后通过查询把不同表凭借起来而已，所以你按需完成表就行



### 集成antsign

- 使用里面的走马灯Carousel
- 组件里面对点击下一张或上一张都内置好
  - 也就是你想要的都弄好了，你调用对应的api就行



### 背景图实现

```tsx
    <Carousel
      ref={bannerRef}
      autoplay
      autoplaySpeed={3000}
      fade
      dots={false}
      afterChange={onSwiperChange}
      className="-mx-[1000px] h-full"
    >
      {banners.map(item => (
        <div key={item.id} className="relative h-[400px]">
          <div
            className="absolute inset-0 -z-10 bg-center"
            style={{
              backgroundImage: `url(${item.backendPicStr})`,
              backgroundPosition: 'center center',
              backgroundSize: '10px auto'
            }}
          />
```

- `-mx-[1000px]` 解释
  - `mx` = 同时设置左右外边距（`margin-left` + `margin-right`）
  - `-mx-[1000px]` = `margin-left: -1000px; margin-right: -1000px;`
  - 作用：
    - 让轮播容器在视觉上“向两边扩张”，从而让**背景层**（那张模糊/拉伸的背景图）可以铺满更宽的区域
    - 但注意：外层一般需要 `overflow-hidden`，否则页面会出现横向滚动条
  - 也不是对bg元素设置，为什么有效果
    - 因为bg设置了inset-0,其大小宽度由父元素决定
- `inset-0` 解释
  - `inset-0` = `top: 0; right: 0; bottom: 0; left: 0;`
  - 你配合 `absolute` 使用时，就是“绝对定位并铺满父容器”的快捷写法
- `-z-10` 解释
  - `-z-10` = `z-index: -10`
  - 作用：让这个背景层在轮播前景图（`Image`）的后面
  - 前提：父容器要是一个定位上下文（一般父层 `relative` 即可），否则层级比较会变得不可控





### bg-red-500 那些没效果

- 真实原因通常不是 Tailwind 把 `bg-red-500` “设置没了”，而是：
  - 你的这个元素同时被**其他 CSS**（例如 antd reset、slick/Carousel 默认样式、全局样式）命中了
  - 并且对方的选择器更具体 / 加载顺序更靠后，从而把 `background-color` 覆盖掉了
  - 所以你看起来像是 `bg-red-500` 没生效

- 解决
  - 用 `!bg-red-500`
    - Tailwind 的 `!` 前缀相当于给这条规则加 `!important`
    - 能在“同属性被覆盖”的情况下强行生效
  - 如果不想用 `!`，就要回到 CSS 规则优先级的思路：
    - 让你的样式加载更靠后
    - 或者写更具体的选择器



# 6.为什么有些页面不用网络请求先把数据保存到redux，对应页面再去获取呢

#### redux 的作用（什么时候需要 / 什么时候不需要）

- Redux 更像是“客户端的全局状态仓库”，它擅长解决的是：
  - **跨组件共享状态**
    - 例如：NavBar/Search/Header/Footer 都要用到同一份 `searchSuggest`、用户登录态、购物车数量
  - **跨页面共享状态**（客户端路由切换后仍然要保留）
    - 例如：购物车列表、用户信息、播放列表等
  - **状态会被频繁更新**（不仅仅是一次性展示）
    - 例如：购物车加减、收藏、筛选条件、分页等
  - **避免 props 层层传递（prop drilling）**
    - App Router 里 server/client 混用时，props 传递还会带来“Server Component 不能把函数传给 Client”等限制

- 但 Redux 并不适合/没必要用于所有数据
  - **只在某一个页面用一次**，且不需要跨组件共享的列表数据
    - 例如：首页某个模块的“静态展示列表”
  - **强依赖 SSR/SEO** 的首屏数据
    - 这种更适合在 Server Component 里直接请求（`app/page.tsx` / `layout.tsx` server fetch），直接渲染出 HTML
  - **不会被修改** 的“纯展示数据”
    - 放到 Redux 只会增加复杂度：slice/thunk/selectors/Provider，以及客户端再请求一次的潜在开销

- 对应到当前项目的取舍（你现在做的方案）
  - banner（轮播图）
    - 更适合：`app/page.tsx` 服务端请求 -> 作为 props 传给 `TopSwiper`
    - 好处：首屏直接有图，SEO/体验更稳
  - searchSuggest（搜索建议）
    - 更适合：放到 Redux
    - 原因：它是 NavBar 全局模块的数据，很多页面都会用到；同时也方便后续做“缓存/只请求一次/条件刷新”等





# 7.实现categories页面

### 通过antisign里面的grid的row-col实现

```tsx
      <div className={classNames('wrapper', 'py-5')}>
        <Row gutter={[16, 16]}>
          {categorys.map(item => (
            <Col key={item.cid} xs={12} sm={8} md={6}>
              <div className="flex items-center gap-3 rounded-xl bg-white p-3 hover:bg-zinc-50">
                <Image
                  src={item.picStr}
                  alt="category"
                  width={48}
                  height={48}
                  unoptimized
                  className="h-12 w-12 shrink-0"
                />
              	<div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-zinc-900">{item.title}</div>
```

- `gutter` 解释
  - `Row` 的 `gutter` 用来控制栅格系统中：
    - 列与列之间的间距（横向间距）
    - 行与行之间的间距（纵向间距）
  - 写成数组：`gutter={[16, 16]}` 表示：
    - 第一项 `16`：横向间距 16px
    - 第二项 `16`：纵向间距 16px
  - 这样你不需要自己在 `Col` 上写 margin/padding，就能稳定得到规则的网格间距。

- `unoptimized` 解释
  - `next/image` 默认会走 Next 的图片优化（会把图片 URL 交给 Next 的 image optimizer 处理）
  - 但在一些场景（尤其是开发阶段）会遇到图片不显示/被拦截，例如：
    - 图片来自 `http://localhost:8000/...` 这类本地服务
    - 某些 Next 版本/配置下，会对私有地址、非标准环境导致的图片优化请求更敏感
  - `unoptimized` 的作用：
    - 告诉 Next：这张图不要走优化流程
    - 等价于把它当普通 `<img>` 来加载
  - 适用场景：
    - 本地开发阶段
    - 或者你确认图片已经在 CDN 做过优化、你不想再让 Next 处理
- `min-w-*`
  - `min-w-*` 这一类本质是在设置 `min-width`，但**不是所有 `min-w-*` 都等价于 `min-width: 0`**。
  - 在 Tailwind 里：
    - `min-w-0` 才等价于 `min-width: 0`
    - 其他常见的还有：`min-w-full` / `min-w-min` / `min-w-max` / `min-w-fit`（含义分别对应不同的最小宽度策略）
  - 为什么在这里强调的是 `min-w-0`：
    - 在 **flex 布局** 中，flex 子项默认的 `min-width` 往往接近 `auto`（倾向于“至少能放下内容”）
    - 结果就是：文字再长也不愿意缩小，反而把父容器撑开，导致溢出/布局被挤乱
    - 当你给右侧文字容器加上 `min-w-0` 后：
      - 它就允许自己在 flex 中被压缩
      - 才能配合 `truncate` 产生“省略号”效果

- `truncate`
  - 是 Tailwind 的组合类，等价于：
    - `overflow: hidden;`
    - `text-overflow: ellipsis;`
    - `white-space: nowrap;`
  - 作用：一行文字过长时，显示为 `...`
  - 生效前提：
    - 容器必须有“可被限制的宽度”（通常是父级有宽度，或者本身在 flex 中可以被压缩）
    - 在 flex 场景下，经常需要配合上面的 `min-w-0` 才能真正截断





# 8.实现grid-view 和 grid-view-item

### 先在type里面把接口返回的数据定义好，方便之后的使用

```js
export interface OppoInfoData {
  banners: OppoBanner[]
  navbars: OppoNavbar[]
  categorys: OppoCategory[]
}
....
```





### 一样使用antsign里面的grid分区里面的row和col



### 问题：怎么让后台返回的数据只显示每项中含有每个特定数组的数据

##### 靠稀释

```js
  const productSections = oppoCategorys.filter( 
    item => Boolean(item.titleForGrid) && Array.isArray(item.productDetailss) && item.productDetailss.length > 0 // 遍历得到item，然后按你的想法稀释
  );
```



### 具体部分代码解释

```tsx
      <div className="p-3">
        <div className="truncate text-sm font-medium text-zinc-900">{product.title}</div>
        <div className="mt-2 flex flex-wrap gap-1">
          {product.activityList?.slice(0, 2)?.map((a, idx) => (
            <span
              key={`${product.id}-${idx}`}
              className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600"
            >
              {a.activityInfo}
            </span>
          ))}
        </div>
        <div className="mt-3 text-base font-semibold text-red-600">
          {product.priceInfo.currencyTag}
          {product.priceInfo.buyPrice}
        </div>
      </div>
    </div>
  )
})

GridViewItem.displayName = 'GridViewItem'
```

- `px-2`
  - `p` = padding（内边距）
  - `x` = 水平方向（left + right）
  - `2` = Tailwind 的 spacing 级别
    - 在默认 spacing scale 中，`2` 通常对应 `0.5rem`，也就是 **8px**（如果根字体是 16px）
  - 所以 `px-2` 等价于：
    - `padding-left: 0.5rem;`
    - `padding-right: 0.5rem;`

- `py-0.5`
  - `y` = 垂直方向（top + bottom）
  - `0.5` 也是 Tailwind spacing 的一档
    - 默认对应 `0.125rem`，也就是 **2px**
  - 所以 `py-0.5` 等价于：
    - `padding-top: 0.125rem;`
    - `padding-bottom: 0.125rem;`
  - 用途：做“小胶囊标签/徽标”的上下留白，让标签更紧凑。

- `GridViewItem.displayName = 'GridViewItem'`
  - 作用：给组件设置一个“可读的名字”。
  - 为什么需要：
    - 组件用了 `memo(...)` 后，React DevTools 里经常显示成 `Memo` 或匿名函数名，不利于调试
    - 设置 `displayName` 后，DevTools/报错堆栈里会更清晰地显示为 `GridViewItem`
  - 常见场景：
    - `memo` / `forwardRef` 包裹过的组件
    - 匿名箭头函数组件





# 9.实现footer

### 当图片是雪碧图时

### 方案 A（推荐）：把图片移到 `public/`

把你的 sprite 文件放到：

- `09b_project-by-apptailwindcss/public/foot_enter.png`

不用改代码，立即生效。

### 方案 B：继续放 `assets/`，但要用 `import` 引入（不推荐用于 CSS sprite）

这种要改成 `import sprite from ...` 再拼 `style={{ backgroundImage: \`url(${sprite.src})` }}`，能用但对 sprite 背景图维护更麻烦。





# 知识补充next中客户端和服务器端获取url的query的不同

#### 设置

- 客户端（Pages Router）

  - `pages` 路由里，在组件（浏览器端）获取 query：用 `next/router` 的 `useRouter()`

  ```tsx
  import { useRouter } from 'next/router'
  
  const Detail: FC<IProps> = memo(props => {
    const router = useRouter()
    const { id } = router.query
  
    // 注意：首次渲染可能拿不到 query，需要判空
    // if (!id) return null
    return <div />
  })
  ```

- 客户端（App Router）

  - `app` 路由里，客户端组件获取 query：用 `next/navigation` 的 `useSearchParams()`

  ```tsx
  'use client'
  
  import { useSearchParams } from 'next/navigation'
  
  export default function DetailClient() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    return <div />
  }
  ```

#### 使用

- 服务器端（Pages Router）

  - `getServerSideProps` 只在服务端执行
  - query 从 `context.query` 读取

  ```tsx
  export const getServerSideProps: GetServerSideProps = async context => {
    const { id } = context.query
    return { props: {} }
  }
  ```

- 服务器端（App Router）

  - `app/xxx/page.tsx` 默认是 Server Component
  - Next 会把 query 通过 `searchParams` 传进来
  - 在你当前用的 Next（16.x）里，`searchParams` 可能是 Promise，需要先 `await` 再取字段

  ```tsx
  interface Props {
    searchParams?: Promise<{ id?: string }>
  }
  
  export default async function DetailPage(props: Props) {
    const sp = props.searchParams ? await props.searchParams : undefined
    const id = sp?.id
    return <div />
  }
  ```

  



# 10.详情页的展示

### 10.1.主要使用前面封装的grid-view



### 10.2.具体实现与代码解释

```tsx
<div className="group overflow-hidden rounded-2xl bg-white">
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-50">
        <Image
			。。。。
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        /> 
```

- group 的解释

  - `group` 是 Tailwind 的“分组 hover”工具类，本身**不负责样式**，主要作用是：
    - 给父元素打一个“标记”
    - 让子元素可以通过 `group-hover:*` 来感知父元素是否处于 hover 状态

  - 为什么需要：
    - hover 往往发生在卡片整体（父容器）上
    - 但实际要改变样式的是内部的图片、标题、按钮等（子元素）
    - 如果不用 `group`，你需要把 hover 写在每个子元素上，不好维护

  - 常见写法：
    - 父元素：`className="group ..."`
    - 子元素：`className="... group-hover:scale-105"` / `group-hover:text-red-500` 等

  - 举例（图片 hover 放大）：

  ```tsx
  <div className="group overflow-hidden rounded-2xl bg-white">
    <div className="relative aspect-square w-full overflow-hidden bg-zinc-50">
      <Image
        className="transition-transform duration-300 group-hover:scale-105"
        // ...
      />
    </div>
  </div>
  ```

  - 总结：
    - `group` = 父容器标记
    - `group-hover:*` = 子元素响应父容器 hover，做联动效果



### 10.3跳转link标签和div一样

```tsx
  <Link
    href={`/detail?tabIndex=${item.tabIndex + 1}`}
    className="flex items-center gap-3 rounded-xl bg-white p-3 hover:bg-zinc-50"
  >
```

- “看起来像 div” 的原因：
  - `Link` 最终会渲染成 `<a>`
  - `<a>` 同样是一个普通的 DOM 元素，所以可以像 `div` 一样加 `flex` / `gap` / `padding` / `hover:*` 等 Tailwind 样式

  

### 10.4.难点代码解释

```tsx
app/detail/page.tsx --- 由其他页面点击跳转过来
interface DetailPageProps { 
  searchParams?: Promise<{
    tabIndex?: string
  }>
} // 解释

async function getOppoCategorys(): Promise<OppoCategory[]> {
  try {
    const data = await getOppoInfo();
    const list = data?.data?.categorys;
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export default async function DetailPage(props: DetailPageProps) {
  const searchParams = props.searchParams ? await props.searchParams : undefined;  // 解释
  const tabIndexStr = searchParams?.tabIndex;
  const tabIndex = tabIndexStr ? Number(tabIndexStr) : NaN;
```

- `searchParams?: Promise<{ tabIndex?: string }>` 的解释
  - 在 App Router 里（`app/xxx/page.tsx`），页面组件默认是 **Server Component**
  - Next 会把 URL 上的 query 参数以 `searchParams` 的形式传给页面
  - 在你当前的 Next 版本（16.x + Turbopack）里，`searchParams` 属于“动态 API”，有时会以 Promise 的形式提供
    - 如果直接用 `props.searchParams.tabIndex` 同步读取，会触发报错：`searchParams is a Promise and must be unwrapped with await / React.use()`
  - 所以这里把类型写成 `Promise<...>`，并在使用时 `await` 解包
- `const searchParams = props.searchParams ? await props.searchParams : undefined` 的解释
  - 先判断 `props.searchParams` 是否存在
  - 存在则 `await` 拿到真正的对象
  - 不存在则用 `undefined`，避免访问属性时报错





#  11.搜索页的展示

### 跳转方式

1. 搜索框自定义输入，然后跳转对应页面
2. 下来框点击进入对应页面

- 1）搜索框自定义输入（Enter 触发）

  - 目标：把输入内容作为 query 参数带到搜索页
  - 跳转到：`/search?q=xxx`

  ```tsx
  const router = useRouter()

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      const value = event.currentTarget.value
      if (value) router.push(`/search?q=${encodeURIComponent(value)}`)
      setInputFocus(false)
    }
  }
  ```

- 2）下拉框点击进入（热门词点击）

  - 目标：把点击的某一项对应的 id 带到搜索页
  - 跳转到：`/search?id=1` / `/search?id=2` ...
  - 这里的 id 优先取 `item.id`（如果该项本身有 id），否则用 `index + 1` 兜底

  ```tsx
  function onItemClick(id?: number, name?: string) {
    if (!id) return
    if (name) setPlaceholder(name)
    router.push(`/search?id=${id}`)
  }

  {searchData?.configKey &&
    searchData.configKey.map((item: any, index: number) => {
      const key = String(index + 1)
      const name = item?.label ?? item?.[key]
      if (!name) return null
      const id = item?.id ?? index + 1
      return (
        <li key={item?.id ?? name} onMouseDown={() => onItemClick(id, name)}>
          {name}
        </li>
      )
    })}
  ```

- 搜索页（`app/search/page.tsx`）接参说明

  - `/search?id=...`：按 id 在 `/oppo/info` 的 `categorys` 里找到对应分类，渲染 `productDetailss`
  - `/search?q=...`：这是关键词模式（如果你要做“按关键词过滤”，需要在搜索页里实现对 q 的处理）



### setPlaceholder方法解释

- 使用代码

  ```tsx
  const [placeholder, setPlaceholder] = useState('蓝牙耳机')
  
  function onItemClick(id?: number, name?: string) {
    if (!id) return
    if (name) setPlaceholder(name)
    router.push(`/search?id=${id}`)
  }
  
  <input
    placeholder={searchData?.defaultKey ?? placeholder}
    // ...
  />
  ```

- 解释
  - `placeholder` 是 input 的“占位提示文本”（灰色提示字），不是输入框的 value
  - `setPlaceholder(name)` 的作用：当你点击下拉的热门词时，把该词设置成新的 placeholder
    - 这样用户回到输入框时能看到“你刚才点过的关键词”，体验更连贯

- `placeholder` 的最终显示逻辑：

  - 如果接口返回了 `searchData.defaultKey`，优先用它
  - 否则用本地 state 的 `placeholder`

- setPlaceholder是固定命名吗
-  const [inputFocus, setInputFocus] = useState<boolean>(false)解释

- setPlaceholder 是固定命名吗

  - 不是固定命名
  - `useState` 返回的是一对值：`[state, setState]`
    - 第一个是状态值（这里叫 `placeholder`）
    - 第二个是更新这个状态的函数（这里叫 `setPlaceholder`）
  - `setPlaceholder` 只是约定俗成的命名方式：`set` + 状态名（驼峰）
    - 你也可以命名成 `setPH` / `updatePlaceholder`，但团队里通常用 `setXxx` 更清晰

- `const [inputFocus, setInputFocus] = useState<boolean>(false)` 解释

  - 作用：用一个布尔值记录“输入框是否处于聚焦/展开状态”
    - `true`：输入框聚焦时，显示下拉框（热门搜索）
    - `false`：输入框失焦时，隐藏下拉框

  - 为什么初始值是 `false`
    - 页面刚进入时输入框默认不聚焦，因此下拉框默认不显示

  - 典型用法（对应你的 Search 组件）：
    - `onFocus`：`setInputFocus(true)`
    - `onBlur`：`setInputFocus(false)`
    - 渲染下拉框时根据 `inputFocus` 决定 `block/hidden`

### onMouseDown 和 onKeyDown的区别，以及其他类似方法补充

- `onMouseDown`（鼠标按下） vs `onClick`（点击完成）

  - 触发时机：
    - `onMouseDown`：按下鼠标那一刻触发（更早）
    - `onClick`：鼠标按下 + 松开后才触发（更晚）

  - 为什么搜索下拉建议常用 `onMouseDown`
    - 输入框失焦会触发 `onBlur`，通常会把下拉框隐藏
    - 如果你用 `onClick`，有可能出现流程：
      - 先 `onBlur` 隐藏下拉
      - 再触发 `onClick`，导致点击项拿不到 / 体验不稳定
    - 用 `onMouseDown` 可以在失焦之前先把“点击某项”的逻辑执行掉

- `onKeyDown` / `onKeyUp` / `onKeyPress`

  - `onKeyDown`：按键按下时触发（可用于监听 Enter、Esc、方向键等）
  - `onKeyUp`：按键松开时触发
  - `onKeyPress`：历史事件（更偏字符输入），在 React/浏览器里逐步不推荐使用

  - 你的搜索输入框里用 `onKeyDown` 监听 Enter 的原因：
    - 按下 Enter 就立刻响应跳转，交互更直接

- `onFocus` / `onBlur`（和下拉框显示隐藏的关系）

  - `onFocus`：输入框获得焦点（点击/Tab 进入）
  - `onBlur`：输入框失去焦点（点击到别处/Tab 离开）
  - 常见实现：
    - `onFocus => setInputFocus(true)` 显示下拉
    - `onBlur => setInputFocus(false)` 隐藏下拉



# 12.问题：后端接口怎么快速写完

## 解决：数据库

### 根据接口截图返回数据生成接口服务器

- 要求：

  - 参考controller，router，server里面接口生成规范生产接口
  - 然后发我生成表的sql语句以及数据插入语句（具体要和红木家具相关），查询返回语句那些放于server

  - 重述我的要求，可以向我提问