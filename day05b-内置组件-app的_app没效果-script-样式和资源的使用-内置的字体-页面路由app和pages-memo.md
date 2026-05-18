# 四。内置组件

## 1.Head

`Head` 用来往当前页面的 `<head>` 里添加内容（title/meta/link 等）。

### pages 路由体系写法

`pages/index.tsx`

```tsx
import Head from 'next/head'

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Next.js Head demo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main>
        <h1>Home</h1>
      </main>
    </>
  )
}
```

### app 路由体系写法（Next 13+ 推荐）

在 `app/` 体系里更推荐使用 `metadata`（静态）或 `generateMetadata`（动态）来设置 head：

`app/page.tsx`

```tsx
export const metadata = {
  title: 'Home',
  description: 'Next.js metadata demo'
}

export default function Page() {
  return <h1>Home</h1>
}
```

### 为什么要在 pages/ 或 app/ 目录下写页面？

因为 Next.js 用的是“约定式路由”（file-based routing）：

- 你把文件放在指定目录（`pages/` 或 `app/`）里，Next 会在启动/构建时**扫描这些目录**
- 扫描后会生成路由映射（可以理解为路由清单/manifest），并据此决定：

  - 访问某个 URL 时应该渲染哪个组件
  - 这条路由是 SSR/SSG/CSR，怎么打包成 chunk

所以：

- 你随便在 `src/xxx` 里新建一个 `Home.tsx`，Next **不会自动把它当成路由页面**
- 它只能作为普通组件被页面引用（例如被 `pages/index.tsx` 引用）

两套体系的“路由入口规则”不同：

- `pages/` 体系（Pages Router）

  - `pages/index.tsx` => `/`
  - `pages/about.tsx` => `/about`
  - `pages/posts/[id].tsx` => `/posts/:id`

- `app/` 体系（App Router，Next 13+ 推荐）

  - `app/page.tsx` => `/`
  - `app/about/page.tsx` => `/about`
  - `app/posts/[id]/page.tsx` => `/posts/:id`
  - 并且天然支持 `layout.tsx`、Server Components、Streaming 等能力



## 为什么 pages/_app.tsx “没效果”？

pages/_app.tsx **只对 Pages Router（`pages/` 目录下的路由）生效**，对 App Router（`app/` 目录下的路由）**完全不生效**。

你现在项目里同时有：

- app/page.tsx负责路由 /（App Router）
- pages/home.tsx负责路由 /home（Pages Router）
  - pages/_document.tsx也只负责pages下的路由，不负责app

所以：

- 你访问 `/` 时，只会走 **App Router**，不会经过 pages/_app.tsx

- 你访问 `/home` 时，才会走 **Pages Router**，这时 pages/_app.tsx才会包裹 pages/home.tsx，你写的 <Script .../>才会有机会执行

  



## 2.script

`Script` 用来更安全、可控地加载第三方脚本（例如统计、埋点、SDK），并支持加载策略。

常见策略（只记住最常用的两个就行）：

- `afterInteractive`：页面可交互后再加载（默认/常用）
- `lazyOnload`：浏览器空闲时再加载（不影响首屏）

`dangerouslySetInnerHTML`

- 表示：不是加载外部 `src`，而是直接把这段 JS 字符串当作脚本内容插进去执行

`id="script-demo"`

- Next 用它来**标识这段脚本**，避免重复插入/方便管理
- 对 inline script 来说通常建议加一个稳定的 `id`

`pages/_app.tsx`

```tsx
import Script from 'next/script'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script
        id="script-demo"
        src="https://example.com/sdk.js"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: "window.__SCRIPT_DEMO__ = 'loaded'",
        }} // 结果就是：你打开页面后，在浏览器控制台输入：console.log(window.__SCRIPT_DEMO__)你会看到 'loaded'
      />

      <Component {...pageProps} />
    </>
  )
}
```

提示：如果脚本依赖环境变量，记得只能在客户端用 `NEXT_PUBLIC_` 前缀的变量。

## 3.Image

`Image` 是 Next 的图片组件，主要目标：

- 自动优化图片（按需裁剪/压缩/响应式）
- 懒加载（默认）
- 解决图片布局抖动（需要提供尺寸或用 `fill`）

### 1) 使用 public 目录图片

`public/logo.png`

`pages/index.tsx`

```tsx
import Image from 'next/image'

export default function HomePage() {
  return (
    <Image
      src="/logo.png"
      alt="logo"
      width={120}
      height={120}
      priority
    />
  )
}
```

### 2) 使用远程图片（需要配置域名白名单）

`next.config.js`

```js
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.example.com' }]
  }
}

module.exports = nextConfig
```

`pages/index.tsx`

```tsx
import Image from 'next/image'

export default function HomePage() {
  return (
    <Image
      src="https://images.example.com/banner.jpg"
      alt="banner"
      width={800}
      height={400}
    />
  )
}
```

## 4.document.jsx

这里说的 `document.jsx` 对应 Next.js 的 `pages/_document.tsx`（或 `_document.js`）。

它的作用：自定义 SSR 输出的 HTML 文档结构（`<html>`/`<head>`/`<body>`），只在服务端执行。

### pages 路由体系写法

`pages/_document.tsx`

```tsx
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="zh-CN">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

注意：

- 这里不要写业务组件，不要写事件绑定
- 如果你需要“每个页面不同的 title/meta”，应该用 `Head`（pages）或 `metadata`（app）来做，而不是写在 `_document` 里

### 建议使用：app 路由体系,而不是document.jsx

`app/` 体系里没有 `_document.tsx` 这个文件；

- HTML 外壳通常由 `app/layout.tsx` 负责
- head 建议用 `metadata`/`generateMetadata`





# 五。样式和资源的使用

Next.js 的样式方案常用三类：

- 全局样式（`globals.css` / `main.scss`）
- 局部样式（CSS Modules：`*.module.css` / `*.module.scss`）
- Sass（变量、mixin、函数等复用能力）

新版本（Next 13+）相对老版本的优势：

- `app/` 路由体系下可以用 `layout.tsx` 做全局样式入口（更接近“全局外壳”）
- 默认 Server Components，样式组织更自然（组件粒度更清晰）
- 仍然兼容 `pages/` 的写法（老项目无需一次性重构）

## 1.全局样式

全局样式的特点：

- 作用于整个网站（不做局部隔离）
- 适合：reset、全局字体、主题背景色、通用工具类

### pages 路由体系（老写法）

把全局样式引入到 `pages/_app.tsx`（或 `pages/_app.jsx`）：

`pages/_app.tsx`

```tsx
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

`styles/globals.css` 或 assets/globals.css

```css
html,
body {
  padding: 0;
  margin: 0;
}

.global-style1 {
  color: red;
}
```

### app 路由体系（Next 13+ 推荐）

把全局样式引入到 `app/layout.tsx`：

`app/layout.tsx`

```tsx
import '@/styles/globals.css'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
```

## 2.局部样式

局部样式推荐使用 CSS Modules：

- 文件名规则：`*.module.css` / `*.module.scss`
- 优点：类名会自动生成 hash，天然避免“全局样式污染”

`pages/index.module.scss`

```scss
.localStyle1 {
  font-size: 30px;
  color: red;
}

.localStyle2 {
  font-size: 30px;
  color: green;
}
```

`pages/index.tsx`

```tsx
import styles from './index.module.scss'

export default function HomePage() {
  return (
    <>
      <div className="global-style1">1.全局样式</div>
      <div className={styles.localStyle1}>2.局部样式 1</div>
      <div className={styles.localStyle2}>3.局部样式 2</div>
    </>
  )
}
```

## 3.Scss变量

### 3.1 安装 sass

Next.js 支持 Sass，但需要安装 `sass`：

```bash
npm i sass
```

### 3.2 变量与 mixin（推荐用 @use，替代旧的 @import）

这是“新知识点”相对 3 年前常见写法的优势：

- `@use` 更现代、更安全（避免全局变量污染）
- 作用域更清晰，团队协作时不容易冲突

`styles/variables.scss`

```scss
$fs30: 30px;
$primaryColor: orange;

@mixin border() {
  border: 1px solid #ddd;
}

:export {
  primaryColor: $primaryColor;
}
```

`pages/index.module.scss`

```scss
@use '../styles/variables.scss' as *;

.localStyle1 {
  font-size: $fs30;
  color: $primaryColor;
  @include border();
}
```

### 3.3 在 TS/JS 里使用 scss 导出的变量（可选技巧）

如果你在 `variables.scss` 里写了 `:export`，那么在 CSS Modules 导入后可以读到导出的值（适合在 JS 里做 inline style）：

`pages/index.tsx`

```tsx
import styles from './index.module.scss'

export default function HomePage() {
  return (
    <div style={{ color: styles.primaryColor }}>
      通过 scss :export 导出的变量：{styles.primaryColor}
    </div>
  )
}
```

提示：

- `:export` 属于“工程技巧”，常用在“样式变量也要给 JS 用”的场景
- 如果只是样式内部复用变量，用 `@use` + Sass 变量即可



## 4.静态资源

### 4.1 图片

#### 在 asset/assets（源码目录）

把图片放在源码目录里，例如：

- `src/assets/logo.png`

优点：

- 可以用“模块导入”的方式引用（更适合组件化复用）

示例（推荐配合 `next/image`）：

`src/assets/logo.png`

`pages/index.tsx`

```tsx
import Image from 'next/image'
import logoPng from '@/assets/logo.png'

export default function HomePage() {
  return <Image src={logoPng} alt="logo" />
}
```

注意：

- 这里的 `@/assets/logo.png` 取决于你是否在 `tsconfig.json` 配置了路径别名（例如 `@/* -> src/*`）
- 没配置别名也没关系，用相对路径即可

#### 在 public（静态托管目录）

把图片放在 `public/` 下，例如：

- `public/logo.png`

访问路径永远是以 `/` 开头：

- `src="/logo.png"`

示例：

`pages/index.tsx`

```tsx
import Image from 'next/image'

export default function HomePage() {
  return (
    <Image
      src="/logo.png"
      alt="logo"
      width={120}
      height={120}
      priority
    />
  )
}
```

#### 在 `pages/index.tsx` 中如何选择用法

- **public 图片**：用字符串路径 `"/xxx.png"`
- **assets 图片**：用 import 导入后 `src={logoPng}`

#### 导入只能通过 `~` 开头？`@` 和 `/` 不行？

- **Next.js 不需要 `~` 开头**（`~` 更像 Nuxt / 某些 Sass/Vite 的历史写法）
- `@`：能不能用，取决于你有没有配置别名（`tsconfig.json` 的 `paths`）
- `/`：在 Next 里通常表示 **public 根路径**（例如 `/logo.png`）

### 4.2 字体（next内置好了个字体），因为字体一般就全局用，固定不变的

#### next/font（全局）

- next/font**Next.js 内置的模块**，不是你自己写的，也不是浏览器原生的。

优势：

- 自动优化字体加载（自动 preload），减少布局抖动
- 更容易做到“按需加载”（只在需要的地方用）

示例（Google Fonts）：

`app/layout.tsx`

```tsx
import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";

// next/font 会在构建/渲染时自动做字体优化：生成字体文件、自动 preload、并产出一个可复用的 className
// subsets 用来声明你需要的字符子集（越小越好），这里只加载 latin 子集
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 把 next/font 生成的 className 挂到 html（或 body）上：让全站都继承该字体
    <html lang="zh-CN" className={inter.className}>
      {/* App Router 的 layout 相当于“全局外壳”，children 就是当前匹配到的 page.tsx 渲染结果 */}
      <body>{children}</body>
    </html>
  );
}

```

#### 要是你已经全局用了 Inter，某个局部想用“其他字体

##### 方式1) 用 `next/font/google`（Google Fonts）

- 前提：这个字体在 Google Fonts 里有（Next 已经把它做成了可导入的 API）
- 用法就是你现在写的 `import { Roboto } from "next/font/google"`

适合：

- 你想省事，不想自己放字体文件
- 网络可用/可接受依赖 Google Fonts（Next 会做优化，但本质字体来自 Google）

`app/page.tsx`

```tsx
import { Inter, Roboto } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });

export default function Page() {
  return (
    <main className={inter.className}>
      <div>默认 Inter</div>
      <h2 className={roboto.className}>这一段用 Roboto</h2>
    </main>
  );
}
```



### 2) 用 `next/font/local`（本地字体文件）

- 不依赖 Google Fonts
- 你把字体文件（`.woff2/.woff/.ttf`）放到项目里，然后：

```react
import { Inter } from "next/font/google";
import localFont from "next/font/local";
 
const inter = Inter({ subsets: ["latin"] });
 
const myLocalFont = localFont({
  src: "./fonts/MyFont.woff2",
});
 
export default function Page() {
  return (
    <main className={inter.className}>
      <div>默认 Inter</div>
      <h2 className={myLocalFont.className}>这一段用本地字体</h2>
    </main>
  );
}
```

适合：

- 你要用公司品牌字体、中文字体、商业字体等（不在 Google Fonts）
- 你希望字体资源完全跟项目一起发布、离线可用





### 补充：图片引用只能“模块导入”吗？能不能 `src="./路径"`？

不是只能模块导入，要分情况：

- **public 目录的图片**：可以直接写字符串路径（注意是以 `/` 开头，不是 `./`）

  - `public/logo.png` => `src="/logo.png"`

- **源码目录的图片（assets）**：推荐用模块导入

  - `import logo from '@/assets/logo.png'`

为什么在 Next 里不推荐 `src="./logo.png"`：

- `./` 相对路径对浏览器来说是“相对 URL”，它不等价于源码文件路径
- 你的源码文件并不会原样出现在浏览器可访问目录里

如果你要在页面里用 `<img>`（不使用 `next/image`），正确方式通常是：

`pages/index.tsx`

```tsx
export default function HomePage() {
  return <img src="/logo.png" alt="logo" />
}
```

如果你要用 `next/image`这种形式导入导出：

- `src` 要么用 `"/logo.png"`（public）
- 要么用 `import` 导入的图片对象（assets）

# 六。新建页面

## 前提知识

### 1) Next 的“页面”是什么

- 在 Next.js 里，“页面”不是你随便写一个 React 组件就行。
- 它必须放在 Next 规定的目录结构里，才能被框架识别成路由入口：

  - 旧体系：`pages/`（Pages Router）
  - 新体系（Next 13+ 推荐）：`app/`（App Router）

### 2) pages 体系（3 年前常见）路由规则速记

- `pages/index.tsx` => `/`
- `pages/about.tsx` => `/about`
- `pages/blog/index.tsx` => `/blog`
- `pages/blog/post.tsx` => `/blog/post`
- 动态路由：

  - `pages/blog/[slug].tsx` => `/blog/:slug`
  - `pages/user/[id].tsx` => `/user/:id`

要求：页面文件需要 `export default` 导出一个 React 组件。



### 3) app 体系（Next 13+）对应规则（新知识点的优势）

优势（相对旧的 pages 体系）：

- 默认 Server Components：更自然地做 SSR、读取服务端数据/环境变量
- 原生支持 `layout.tsx`：更适合做多层布局（比 pages 体系的“手写 Layout 包裹”更规范）
- 支持 Streaming、并发特性等（更现代的渲染模型）

路由规则：

- `app/page.tsx` => `/`
- `app/about/page.tsx` => `/about`
- 动态路由：`app/blog/[slug]/page.tsx` => `/blog/:slug`

同样要求：页面文件需要 `export default` 导出组件。

## 配置用户代码片段

```json
{
  "Next Page (TSX)": {
    "prefix": "hynext",
    "body": [
      "import type { NextPage } from 'next'",
      "import { memo } from 'react'",
      "",
      "type Props = {",
      "  // TODO: define props",
      "}",
      "",
      "const ${TM_FILENAME_BASE}: NextPage<Props> = function ${TM_FILENAME_BASE}(props) {",
      "  return (",
      "    <main>",
      "      <h1>${TM_FILENAME_BASE}</h1>",
      "    </main>",
      "  )",
      "}",
      "",
      "export default memo(${TM_FILENAME_BASE})",
      ""
    ],
    "description": "Create a Next.js page component (TSX)"
  }
}
```

你在新建的页面文件里输入 `hynext` 回车，就会生成模板。



## 组件实现路由导航

### pages 体系：用 Link 组件跳转

`pages/index.tsx`

```tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <main>
      <Link href="/about">Go About</Link>
    </main>
  )
}
```

`pages/about.tsx`

```tsx
export default function AboutPage() {
  return <h1>About</h1>
}
```

### app 体系：Link 同样可用

`app/page.tsx`

```tsx
import Link from 'next/link'

export default function Page() {
  return <Link href="/about">Go About</Link>
}
```

`app/about/page.tsx`

```tsx
export default function AboutPage() {
  return <h1>About</h1>
}
```

### Link 组件的“新版本”要点

#### 1) 不需要再手动包一层 `<a>`（默认就是可点击链接）

现在常见写法就是你上面这种：

```tsx
import Link from 'next/link'

export default function Page() {
  return <Link href="/about">Go About</Link>
}
```

说明：早期 Next 示例里经常看到 `<Link><a>...</a></Link>`，那是历史写法。现在一般**直接把文本/元素作为 children** 即可。

#### 2) 预取（prefetch）带来的优势：跳转更快

`Link` 在**生产环境**会对视口内的链接进行预取（prefetch），使得用户点击时更快。

你可以手动关闭：

```tsx
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/about" prefetch={false}>
      Go About
    </Link>
  )
}
```

#### 3) `replace` / `scroll` 等常用属性

- `replace`：不新增历史记录（替换当前记录）。适合“登录后跳转”“表单成功页”等不希望用户回退到上一页的场景
- `scroll`：跳转后是否滚动到顶部（默认会滚到顶部）

```tsx
import Link from 'next/link'

export default function Page() {
  return (
    <main>
      <Link href="/about" replace>
        replace 跳转
      </Link>

      <Link href="/about" scroll={false}>
        保持滚动位置
      </Link>
    </main>
  )
}
```

#### 4) 带 Query 参数的跳转：推荐用字符串（最直观）

`pages` 和 `app` 两套体系里，最直观、最不容易踩坑的写法是字符串：

```tsx
import Link from 'next/link'

export default function Page() {
  return <Link href="/cart?count=100">Go Cart</Link>
}
```

补充：你可能在旧教程里见到过 `href={{ pathname, query }}` 这种对象写法。

- `pages` 体系里，这种写法更常见
- `app` 体系里也能用，但对初学者来说**字符串**更简单（并且更容易和 `useSearchParams` 配套理解）

#### 5) 外链要不要用 Link？

外链（`https://...`）一般建议直接用原生 `<a>`（语义更清晰）：

```tsx
export default function Page() {
  return (
    <a href="https://www.jd.com" target="_blank" rel="noreferrer">
      jd.com
    </a>
  )
}
```

如果你确实用 `Link` 包外链，也要记得同样加 `target` / `rel`。

##### 解释 `rel`（为什么外链常写 `rel="noopener noreferrer"`）

当你写：

```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">link</a>
```

这里的含义（初学者版）：

- `target="_blank"`
  - 在新标签页打开
  - **风险点**：新打开的页面默认可能通过 `window.opener` 反向控制你的原页面（安全问题）
- `rel="noopener"`
  - 禁止新页面访问 `window.opener`
  - **作用**：更安全，也可能带来一点点性能收益
- `rel="noreferrer"`
  - 浏览器在跳转时不发送 `Referer`（来源页面地址）
  - 同时也隐含了 `noopener` 的效果（在多数现代浏览器里）

补充解释：`window.opener` 和 `noopener` 到底是什么关系？

- **`window.opener` 是什么**
  - 当你在页面 A 里用 `target="_blank"` 打开页面 B 时：
    - 在页面 B 里，`window.opener` 会指向“打开它的那个页面”（页面 A 的 window 对象）
  - 这会让页面 B 有能力影响页面 A（例如让页面 A 跳转到别的地址）

- **为什么这有风险（tabnabbing）**
  - 假设你打开了一个外部网站 B
  - 如果 B 是恶意页面，它可以执行类似：

```js
// 在新打开的页面（B）里运行
if (window.opener) {
  window.opener.location.href = 'https://fake-login.example.com'
}
```

  - 结果：你原来的页面 A 可能在你没注意时被“换成钓鱼登录页”（这类攻击常叫 tabnabbing）

- **`rel="noopener"` 的效果**
  - 浏览器会让新页面 B **拿不到 `window.opener`**（通常会变成 `null`）
  - 等价于“切断 A 和 B 的脚本连接”，B 就不能再控制 A 了

小结：

- `target="_blank"`：新开标签页
- `noopener`：防止新页面通过 `window.opener` 反控原页面（更安全）

推荐记法：

- 只要你写了 `target="_blank"`，就尽量配上 `rel="noopener noreferrer"`



#### 6) `Link` 的 `as` 参数（写别名，以及解决跨域问题）

你在一些 3 年前的教程里会看到：

```tsx
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/profile?id=1000" as="/profile_v2">
      profile
    </Link>
  )
}
```

`as` 的历史作用：

- **让浏览器地址栏显示“别名 URL”**（用户看到的是 `as`），但内部实际路由匹配用 `href`
- 早期常用于“美化 URL”“掩码 query”“配合动态路由显示更友好的路径”

**现在更推荐**的做法（更符合 Next 13+ 的思路）：

- **动态路由就写动态段**（最直观）

`pages` 体系：

```tsx
// pages/profile/[id].tsx  -> /profile/1000
import Link from 'next/link'

export default function Page() {
  return <Link href="/profile/1000">profile 1000</Link>
}
```

`app` 体系：

```tsx
// app/profile/[id]/page.tsx -> /profile/1000
import Link from 'next/link'

export default function Page() {
  return <Link href="/profile/1000">profile 1000</Link>
}
```

- **如果你是“路径重写/短链/别名”需求**，更推荐用 `next.config.js` 的 `rewrites`（统一在路由层解决），而不是在每个 `Link` 里写 `as`。

`next.config.js` 示例（rewrites）：

```js
<div>
  <Link href="/profile_v2">Go /profile_v2 (rewrite)</Link>
</div>

// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // 1) 短链/别名：用户访问 /profile_v2，实际渲染 /profile/1000
      // 地址栏仍然显示 /profile_v2（这是 rewrites 的特点）
      {
        source: '/profile_v2',
        destination: '/profile/1000',
      },

      // 2) 常见：本地开发时做 API 代理，避免跨域
      // 访问 /api/xxx -> 转发到后端服务 https://api.example.com/xxx
      {
        source: '/api/:path*',
        destination: 'https://api.example.com/:path*',
      },
    ]
  },
}

module.exports = nextConfig
```

配合上面的短链例子，你就可以在页面里写：

```tsx
import Link from 'next/link'

export default function Page() {
  return <Link href="/profile_v2">profile v2</Link>
}
```

##### `rewrites` vs `redirects`（一句话区分）

- `rewrites`：**地址栏不变**，但内部转到另一个 destination 去渲染（更像“内部映射/代理”）
- `redirects`：**地址栏会变**，浏览器真的跳转到新地址（更像“改门牌号/301/302”）





## 编程式导航（代码里跳转）

#### 1) pages 体系：`next/router`

`pages/index.tsx`

```tsx
import { useRouter } from 'next/router'

export default function HomePage() {
  const router = useRouter()

  return (
    <main>
      <button onClick={() => router.push('/about')}>Go About</button>
      <button onClick={() => router.replace('/about')}>Replace About</button>
    </main>
  )
}
```

#### 2) app 体系（Next 13+）：`next/navigation`

注意：这段必须写在 **Client Component**（因为要用点击事件 + hook），所以要加 `'use client'`。

`app/page.tsx`

```tsx
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <main>
      <button onClick={() => router.push('/about')}>Go About</button>
      <button onClick={() => router.replace('/about')}>Replace About</button>
    </main>
  )
}
```

app 体系下读取 query 参数，推荐：

`app/cart/page.tsx`

```tsx
'use client'

import { useSearchParams } from 'next/navigation'

export default function CartPage() {
  const searchParams = useSearchParams()
  const count = searchParams.get('count')

  return <div>count: {count}</div>
}
```

优势总结（相对旧教程的“更新点”）：

- `app/` 体系把“布局（layout）”变成一等公民，更自然地复用公共 UI
- `next/navigation` 与 Server/Client Components 的边界更清晰：
  - 需要交互（点击跳转、hook） -> Client Component
  - 纯展示/数据渲染 -> Server Component



## 注意在next中，不用想nuxt放置< router-view>占位符 直接就可以使用

### 1) 为什么 Nuxt/Vue 需要 `<router-view>`，而 Next 不需要？

- **Vue / Nuxt（Vue Router）**：你要在模板里放一个“路由出口”（`<router-view>`）。路由匹配到的组件，最终会渲染到这个出口里。
- **Next.js（文件系统路由）**：Next 会根据 `pages/` 或 `app/` 目录扫描生成路由表，然后**框架在内部决定把页面渲染到哪里**，你不需要手写一个“路由出口组件”。

你只要把页面文件放在约定的位置即可：

- **pages 体系**
  - `pages/index.tsx` -> `/`
  - `pages/about.tsx` -> `/about`
  - 框架会把当前页面组件，自动插入到 `pages/_app.tsx` 的 `Component` 位置（你也不需要写 `<router-view>`）

`pages/_app.tsx`（理解为全局外壳）：

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

- **app 体系（Next 13+）**
  - `app/page.tsx` -> `/`
  - `app/about/page.tsx` -> `/about`
  - 框架会把匹配到的 `page.tsx`，自动插入到最近一层 `layout.tsx` 的 `{children}` 位置

`app/layout.tsx`（理解为路由“公共布局 + 出口”）：

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        {/* 这就是 app 体系的“页面渲染位置” */}
        {children}
      </body>
    </html>
  )
}
```

对比一下：

- **Vue Router 的“出口”**：`<router-view>`（你手写）
- **Next pages 的“出口”**：`pages/_app.tsx` 里的 `Component`（框架约定 + 你可自定义外壳）
- **Next app 的“出口”**：`layout.tsx` 里的 `{children}`（框架约定 + 支持嵌套路由布局）

所以你会感觉“Next 里不用像 Nuxt 一样放占位符”：本质是 **Next 的路由渲染出口已经被框架固定在入口文件中**（`_app` / `layout`），你只需要按目录规则写页面。

## 解释memo函数

### 1) `memo` 是干什么的？

`React.memo` 的目标：**当父组件重新渲染时，如果子组件的 props 没变，就跳过子组件的重新渲染**。

- 这是一种“性能优化”，不是功能必需品
- 它是对“组件”的记忆化（memoization）

```tsx
import { memo } from 'react'

type Props = {
  title: string
}

function TitleView({ title }: Props) {
  console.log('TitleView render')
  return <h2>{title}</h2>
}

export default memo(TitleView)
```

### 2) 什么时候该用 / 不该用？（初学者规则）

建议你先记住下面几条：

- **该用**
  - 子组件渲染“很重”（列表、图表、复杂 UI），并且父组件会频繁更新
  - 子组件 props 很稳定（基本类型、稳定引用），确实能命中“没变就不渲染”
- **不该滥用**
  - 组件很简单，渲染代价很低（`memo` 自身也有比较 props 的开销）
  - props 每次都是“新引用”，导致 `memo` 形同虚设（最常见）

### 3) 最常见的“memo 没生效”原因

父组件每次 render 都创建了新对象/新函数，导致子组件 props 看起来“变了”：

```tsx
import { memo } from 'react'

const Child = memo(function Child(props: { onClick: () => void }) {
  console.log('Child render')
  return <button onClick={props.onClick}>child</button>
})

export default function Parent() {
  // 每次 render 都是一个新函数引用 -> props 变化 -> Child 还是会 render
  const onClick = () => {
    console.log('click')
  }

  return <Child onClick={onClick} />
}
```

要让 `memo` 真正发挥作用，通常需要配合 `useCallback`（让函数引用稳定）：

```tsx
import { memo, useCallback } from 'react'

const Child = memo(function Child(props: { onClick: () => void }) {
  console.log('Child render')
  return <button onClick={props.onClick}>child</button>
})

export default function Parent() {
  const onClick = useCallback(() => {
    console.log('click')
  }, [])

  return <Child onClick={onClick} />
}
```

### 4) `memo` / `useMemo` / `useCallback` 区别（一句话版）

- `memo(Component)`：记忆化**组件渲染结果**（props 不变就不重渲染）
- `useMemo(fn)`：记忆化**某个计算结果**（避免重复做昂贵计算）
- `useCallback(fn)`：记忆化**函数引用**（常用于配合 `memo`，避免子组件 props 里的函数每次都变）

### 5) 在 Next 13+（app）里的小提醒

- **Server Component**：默认在服务端渲染，不存在浏览器里那种频繁 setState 引发的“组件树反复重渲染”问题，`memo` 的收益通常更小。
- **Client Component（写了 `'use client'`）**：才更常出现“父组件 state 变化导致子组件重复渲染”的场景，`memo` 更常用在这里。
