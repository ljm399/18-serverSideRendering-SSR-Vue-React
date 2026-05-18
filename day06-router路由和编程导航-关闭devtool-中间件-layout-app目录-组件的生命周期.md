

# 关闭浏览器图标

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 关闭开发模式指示器
  devIndicators: false,
};

module.exports = nextConfig;
```



# 一。编程导航，路由监听 和 动态路由

## (1)编程导航

### 1.优先使用 Link，其次才是编程导航（看day05)

在 Next.js 里，页面跳转优先使用 `<Link />`，需要在事件中跳转（点击按钮、提交表单成功后跳转等）再使用编程导航。

- **Link 的优势**
  - **预取（prefetch）**：在合适条件下会提前拉取页面资源，切页更快
  - **语义更清晰**：更像“链接”，可访问性更好
  - **更利于维护**：减少手写跳转逻辑

#### 案例：Link（Pages/App 都通用）

```tsx
import Link from "next/link";

export default function Demo() {
  return (
    <main>
      <Link href="/profile?id=1000">Go Profile (query)</Link>
      <br />
      <Link href="/users/1000">Go User Detail (dynamic route)</Link>
    </main>
  );
}
```



### 2.Pages Router（pages 目录）编程导航（旧）

适用：项目使用 `pages/` 目录（例如你当前 `04-next-pages/pages/...`）。

导入：

```ts
import { useRouter } from "next/router"
```

常用 API：

- **router.push(url)**
  - 新增一条历史记录并跳转
- **router.replace(url)**
  - 替换当前历史记录并跳转（不会产生“返回到上一页”的那条记录）
- **router.back()**
  - 返回上一页
- **router.prefetch(url)**
  - 预取某个路由资源（可选）

#### 案例：编程导航 push / replace / back（Pages Router）

```tsx
import { useRouter } from "next/router";

export default function NavDemoPage() {
  const router = useRouter();

  return (
    <main>
      <button onClick={() => router.push("/profile?id=1000")}>push</button>
      <button onClick={() => router.replace("/profile?id=1000")}>replace</button>
      <button onClick={() => router.back()}>back</button>
    </main>
  );
}
```

### 补充：旧写法 href + as（“伪装/美化 URL”）

你当前打开的 `as-demo.tsx` 属于这类用法：

```tsx
import Link from "next/link";

export default function AsDemoPage() {
  return (
    <main>
      <Link href="/profile?id=1000" as="/profile_v2">
        Go profile_v2 (as)
      </Link>
    </main>
  );
}
```

理解：

- **href**：真实要匹配的页面路由（内部使用）
- **as**：浏览器地址栏显示的路径（对用户“伪装/美化”）

为什么说它“旧”：

- 这类“遮罩路径”的可读性和可维护性一般，团队里很容易造成路由对应关系混乱
- 现在更推荐用 **动态路由**（以及必要时用 middleware/rewrites）来实现“更干净的 URL”
- 在 App Router 体系下也不会用这套思路做路由设计



#### 推荐：用动态路由替代 as（Pages Router）

方案一：把 query 改成动态路由参数

- 目录结构：`pages/profile/[id].tsx`
- 跳转：

```tsx
import Link from "next/link";

export default function Demo() {
  return <Link href="/profile/1000">Go /profile/1000</Link>;
}
```

方案二：如果你只是想“更短/更语义”的路径

- 直接设计成你想要的路径（例如 `pages/profile_v2.tsx` 或 `pages/profile-v2.tsx`）
- 或者使用 Next 的 **rewrites**（属于路由层配置，不建议靠 `as` 在组件里到处写）



### 3.App Router（app 目录，Next 13+ 主推）编程导航（新）

适用：项目使用 `app/` 目录（Next 13/14/15 主推）。

导入：

```ts
import { useRouter } from "next/navigation"
```

常用 API：

- **router.push(url)**
- **router.replace(url)**
- **router.back()**
- **router.refresh()**
  - 刷新当前路由对应的 Server Components 数据（这是新体系常用能力）

配套获取路由信息：

- **usePathname()**：当前路径（pathname）
- **useSearchParams()**：查询参数（`?a=1`）

#### 案例：编程导航 push / replace / back / refresh（App Router）

注意：App Router 中用到 hooks 的组件必须是 Client Component。

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function NavDemo() {
  const router = useRouter();

  return (
    <main>
      <button onClick={() => router.push("/profile?id=1000")}>push</button>
      <button onClick={() => router.replace("/profile?id=1000")}>replace</button>
      <button onClick={() => router.back()}>back</button>
      <button onClick={() => router.refresh()}>refresh</button>
    </main>
  );
}
```



## (2)路由监听

### 1.Pages Router：使用 router.events

在 Pages Router 下，可以通过 `router.events` 监听客户端路由切换（常用来做埋点、统计、Loading 进度条）。

常见事件：

- **routeChangeStart**：开始切换
- **routeChangeComplete**：切换完成
- **routeChangeError**：切换出错

注意点：

- **一定要在 cleanup 即return中取消监听**，避免重复订阅
- 这套监听主要针对 **客户端路由切换**（例如点击 Link 或 push/replace）

#### 案例：在 pages/_app.tsx 里做全局路由监听（Pages Router）

```tsx
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const onStart = (url: string) => {
      console.log("routeChangeStart =>", url);
    };
    const onDone = (url: string) => {
      console.log("routeChangeComplete =>", url);
    };

    router.events.on("routeChangeStart", onStart);
    router.events.on("routeChangeComplete", onDone);
    return () => {
      router.events.off("routeChangeStart", onStart);
      router.events.off("routeChangeComplete", onDone);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
}
```

### 2.App Router：没有 router.events（新变化）

在 App Router 里，不再提供 `router.events` 事件总线。

推荐方式变为“监听状态变化”：

- **usePathname() 变化**：可以认为路由已切换到新页面
- **useSearchParams() 变化**：可以认为 query 发生变化

相对旧的 events 的优势：

- 更贴合 React 数据流：监听“状态”而不是订阅“事件”
- 更利于组件拆分：哪里需要感知路由变化就在哪里监听
- 与 Server Components/Streaming 等模型更一致

#### 案例：监听 pathname/searchParams 变化（App Router）

```tsx
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function RouteListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log("pathname changed =>", pathname);
  }, [pathname]);

  useEffect(() => {
    console.log("searchParams changed =>", searchParams.toString());
  }, [searchParams]);

  return null;
}

export default function Page() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <main style={{ padding: 24 }}>
          
      <RouteListener />
       {/* 
       		<RouteListener /> 是 React 组件的使用方式（JSX 写法），意思是“把 RouteListener 这个组件渲染到这里”。

它会执行 RouteListener 函数里的逻辑（包括 usePathname / useSearchParams / useEffect），但它不是你手动去“调用函数”的那种调用方式。
       */}
    </main>
  );
}
```

##### `useEffect(..., [pathname])` 第二个参数的作用

第二个参数叫 **依赖数组（dependency array）**，它决定这个 `useEffect` **什么时候执行**。

```
useEffect(() => {
  console.log("pathname changed =>", pathname);
}, [pathname]);
```

含义是：

- **组件首次渲染后会执行一次**（mount 后执行）
- 之后**只有当 `pathname` 的值发生变化**时才会再次执行
- 如果你只是更新了别的 state，但 `pathname` 没变，这个 effect **不会重复执行**

------

###### 对比几种常见写法

- **不写第二个参数**：`useEffect(fn)`
  - 每次渲染后都执行（任何 state/props 变化都会触发重新渲染，从而 effect 也会跑）
- **空数组**：`useEffect(fn, [])`
  - 只在首次渲染后执行一次（类似“只在组件挂载时做一次事情”）
- **有依赖**：`useEffect(fn, [pathname])`
  - 首次执行一次 + 依赖变了才执行（你这个就是“监听 pathname 变化”）





### 3.App Router 下更推荐的 Loading 处理方式

App Router 提供了更框架化的加载体验，很多场景**不再需要你自己写“路由开始/结束”事件**。

- **app/loading.tsx**：为某个路由段提供加载 UI
- **Suspense**：配合异步组件/数据加载呈现占位

#### 案例：app/loading.tsx

把下面文件放在对应路由段目录下（例如 `app/dashboard/loading.tsx`），当进入该路由段加载时会自动展示。

```tsx
export default function Loading() {
  return <p>Loading...</p>;
}
```

```tsx
app/dashboard/pages.tsx
import Link from "next/link";
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function Page() {
  await sleep(1500);

  return (
    <main style={{ padding: 24 }}>
      <h1>/dashboard</h1>
      <p>This page is intentionally slow to show route-segment loading UI.</p>
      <p>
        <Link href="/">Back</Link>
      </p>
    </main>
  );
}
```

- 测试：进入http://localhost:3000/dashboard，会先loading，1500ms后才进入app/dashboard（即http://localhost:3000/dashboard）



## (3)动态路由 

### 1.Pages Router（pages 目录）动态路由 

文件名约定：

- `pages/users/[id].tsx` 对应 `/users/123` 
- `pages/posts/[...slug].tsx` 对应 `/posts/a/b/c`（catch-all）
- `pages/posts/[[...slug]].tsx` 对应 `/posts` 或 `/posts/a/b`（optional catch-all）
- 注意
  - http://localhost:3000/day06-pages/users 跳转的完整路径是http://localhost:3000/day06-pages/users/index.tsx


###### **路由匹配规则的优先级**

同一个目录下如果同时存在“固定路由 / 动态路由 / 捕获所有路由”，匹配优先级一般是：

- **固定路由（预定义）优先于动态路由**
  - 例如：`pages/post/create.tsx` 会优先匹配 `/post/create`
- **动态路由优先于捕获所有路由**
  - 例如：`pages/post/[pid].tsx` 会匹配 `/post/1`、`/post/abc`
- **捕获所有路由兜底匹配**
  - 例如：`pages/post/[...slug].tsx` 会匹配 `/post/1/2`、`/post/a/b/c`

###### catch-all（`[...slug]`）到底匹配哪些路径

- `pages/post/[...slug].tsx`（注意是三个点）
  - 匹配：`/post/a`、`/post/a/b`、`/post/a/b/c`
  - **不匹配**：`/post`（因为至少要有一个片段）
- 如果你希望 `/post` 也能被同一个页面匹配，要使用：`pages/post/[[...slug]].tsx`

###### **`slug` 参数的类型**

- 对于 `[...slug]` / `[[...slug]]`：`router.query.slug` 通常是 `string[] | undefined`
- 例如：
  - 访问 `/post/a`，`slug` 类似 `['a']`
  - 访问 `/post/a/b`，`slug` 类似 `['a', 'b']`
- `slug` 这个名字只是习惯写法，你也可以用其它名称：`[...param].tsx`

###### 404 页面（Pages Router）

- 推荐方式：在 **`pages/404.tsx`** 定义 404 页面（只支持放在 `pages` 根目录）
- 另外也支持 `pages/500.tsx` 作为 500 错误页

案例：pages/404.tsx （**直接写404**就行）

```tsx
export default function NotFoundPage() {
  return (
    <main>
      <h1>404 Not Found</h1>
      <p>你访问的页面不存在</p>
    </main>
  );
}
```

获取路由参数：

- `const router = useRouter()` 
- `router.query.id` 

注意：

- 初次渲染时 `router.query` 可能为空，需要判空
- TS 下 `router.query.id` 的类型通常是 `string | string[] | undefined`

###### 动态参数 vs 查询参数

- **动态路由参数（path params）**：来自文件名里的 `[id]`，例如 `/users/123` 里的 `123`
- **查询参数（query string）**：来自 URL 的 `?a=1&b=2`
- 在 Pages Router 里，它们最后都会合并到 `router.query` 里
- 获取：const { a，b, id } =router.query

###### 同名参数覆盖问题

- 如果动态参数名和 query 参数名相同（都叫 `id`），`router.query.id` 只会给你一个值, 动态路由会取代查询参数
- 实战中建议：
  - 动态参数用 `id`，query 用 `tab`/`from` 这种不同名字，避免混淆

###### 为什么要用 router.isReady

- 在某些情况下（尤其是第一次进入页面 / 还在 hydration 过程中），`router.query` 可能暂时是空对象
- 推荐用 `router.isReady` 来确保参数已就绪，再读取 `router.query`

#### 案例：pages/users/[id].tsx（Pages Router）

```tsx
import { useRouter } from "next/router";

export default function UserDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return <p>Loading...</p>;
  return <h1>User id: {String(id)}</h1>;
}
```

#### 更稳的写法：配合 router.isReady（推荐初学者使用）

```tsx
import { useRouter } from "next/router";

export default function UserDetailPage() {
  const router = useRouter();

  if (!router.isReady) return <p>Loading...</p>;

  const id = router.query.id;
  if (!id) return <p>Missing id</p>;

  return <h1>User id: {String(id)}</h1>;
}
```

#### 案例：从列表页跳到动态路由 + 携带 query

页面：`pages/users/index.tsx`

```tsx
import Link from "next/link";
import { useRouter } from "next/router";

export default function UsersPage() {
  const router = useRouter();

  return (
    <main>
      <h1>Users</h1>

      <h2>1) Link 跳转（推荐）</h2>
      <Link href={{ pathname: "/users/1000", query: { tab: "profile" } }}>
        Go /users/1000?tab=profile
      </Link>

      <h2>2) 编程导航</h2>
      <button
        onClick={() =>
          router.push({ pathname: "/users/1000", query: { tab: "posts" } })
        }
      >
        router.push to /users/1000?tab=posts
      </button>
    </main>
  );
}
```

目标页读取 query：`pages/users/[id].tsx`

```tsx
import { useRouter } from "next/router";

export default function UserDetailPage() {
  const router = useRouter();
  if (!router.isReady) return <p>Loading...</p>;

  const id = router.query.id;
  const tab = router.query.tab;

  return (
    <main>
      <h1>User id: {String(id)}</h1>
      <p>tab: {tab ? String(tab) : "(none)"}</p>
    </main>
  );
}
```

#### 案例：catch-all 路由 pages/posts/[...slug].tsx

匹配：

- `/posts/a`
- `/posts/a/b/c`

```tsx
import { useRouter } from "next/router";

export default function PostSlugPage() {
  const router = useRouter();
  if (!router.isReady) return <p>Loading...</p>;

  const slug = router.query.slug;
  const parts = Array.isArray(slug) ? slug : [String(slug)];

  return (
    <main>
      <h1>Slug parts</h1>
      <pre>{JSON.stringify(parts, null, 2)}</pre>
    </main>
  );
}
```

#### 案例：optional catch-all 路由 pages/posts/[[...slug]].tsx

匹配：

- `/posts`
- `/posts/a/b`（也具有和[...slug]一样的功能）

```tsx
import { useRouter } from "next/router";

export default function PostOptionalSlugPage() {
  const router = useRouter();
  if (!router.isReady) return <p>Loading...</p>;

  const slug = router.query.slug;
  const parts = slug ? (Array.isArray(slug) ? slug : [String(slug)]) : [];

  return (
    <main>
      <h1>Optional slug parts</h1>
      <pre>{JSON.stringify(parts, null, 2)}</pre>
    </main>
  );
}
```

### 2.App Router（app 目录）动态路由（新）

目录约定：

- `app/users/[id]/page.tsx` 对应 `/users/123`
- `app/posts/[...slug]/page.tsx` 对应 `/posts/a/b/c`

获取参数：

- 在 Server Component 里通常通过 `page` 的入参 `params` 获取
- 在 Client Component 里可以用 `useParams()`（来自 `next/navigation`）

#### 案例：app/users/[id]/page.tsx（Server Component，App Router）

```tsx
type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  return <h1>User id: {params.id}</h1>;
}
```

#### 案例：在 Client Component 里 useParams（App Router）

```tsx
"use client";

import { useParams } from "next/navigation";

export default function UserIdClient() {
  const params = useParams<{ id: string }>();
  return <p>User id: {params.id}</p>;
}
```

- 这里可以不用"use client"

  - ##### 什么时候才需要 `"use client"`？

    只要你在组件里用到了 **只能在浏览器运行的能力**，就必须写 `"use client"`，典型包括：

    - `useState` / `useEffect` / `useRef` 等 React Hooks
    - `useRouter()` / `usePathname()` / `useSearchParams()`（`next/navigation` 这些 hooks）
    - DOM 事件：`onClick`、`onChange`、`window`、`document` 等

优势：

- 路由段（segment）组织更清晰
- 更适合做嵌套路由与布局复用（layout 能力更强）



## nuxt是route，next是router（有r）





# 二。中间件和匹配



##  位置 项目名/middle.ts

## `middleware.ts` 里的 `console.log()` **只能在服务器端看到**，客户端（浏览器 DevTools Console）**看不到**。

------

### 为什么

- **运行环境**：Next.js `middleware` 运行在 **服务端（Edge Runtime / Server Runtime）**，不运行在浏览器里。

## 1.路由拦截

中间件（Middleware）是什么：

- 它是在 **请求到达路由处理之前** 执行的一段代码
- 可以用来做：

- **鉴权/登录拦截**
  - 目的：保护 `/admin`、`/profile` 等页面，未登录用户不能访问
  - 做法：在 middleware 里读 cookie/header，没有就 `redirect('/login')`
- **AB 测试 / 灰度**
  - 目的：把一部分用户分配到 B 版本页面/接口（例如 10% 用户进入新功能）
  - 做法：根据 cookie/header/随机数等打标，然后 `rewrite` 到 `/v2/...` 或不同后端
- **国际化（i18n）**
  - 目的：根据用户语言自动切换路由（例如 `/en`、`/zh`）
  - 做法：读取 `accept-language` 或 cookie，必要时 `redirect('/en/...')`
- **请求日志**
  - 目的：记录访问了哪些路径、耗时、来源等（用于排查问题/统计）
  - 做法：打印 `req.nextUrl.pathname`，或把日志上报到日志服务（注意不要影响性能）
- **简单安全策略**
  - 目的：快速拦截某些路径、限制某些请求方式、屏蔽可疑请求
  - 做法：命中规则后直接返回 `new NextResponse('Forbidden', { status: 403 })`

###### 案例：AB/灰度（极简示例：把一部分用户 rewrite 到 /v2）

```ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const isV2 = req.cookies.get("exp")?.value === "v2";

  if (isV2 && req.nextUrl.pathname === "/home") {
    return NextResponse.rewrite(new URL("/v2/home", req.nextUrl.origin));
  } //  req.nextUrl.origin 比如http://locathostxx那些

  return NextResponse.next(); // 
}

export const config = {
  matcher: ["/home"],
};
```

###### 案例：简单安全策略（极简示例：拦截 /admin/secret）

```ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin/secret")) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

### 最新写法（Next 13/14/15 通用）

- 文件名：项目根目录下 `middleware.ts`（或 `middleware.js`）
- 导入：从 `next/server` 导入 `NextRequest` / `NextResponse`
- 运行环境：默认是 **Edge Runtime**（和传统 Node 环境不同）

相对 3 年前旧资料的更新点/优势：

- **运行在 Edge**：更靠近用户，请求处理更快（适合轻量逻辑）
- `req.nextUrl` 更好用：可以方便地读写 pathname/searchParams
- `config.matcher` 更灵活：只让中间件作用在你关心的路由上（减少性能开销）

### 使用案例和注意点

- Middleware **不适合做重计算**、也不适合直接访问 Node 专有能力（如 `fs`）
- 可以用 `fetch` 调后端接口做校验，但要注意性能
- 不要把敏感逻辑只放在 middleware（它更像“第一道门”），关键鉴权建议服务端也校验

###### 案例 1：最小可用 middleware（打印访问 URL）

`middleware.ts`

```ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  console.log("middleware =>", req.nextUrl.pathname);
  return NextResponse.next();
}
```

###### matcher：只拦截指定路由（推荐）

不写 matcher 会导致很多请求（页面、静态资源等）都进 middleware。

```ts
export const config = {
  matcher: ["/admin/:path*", "/profile"],
};
```

###### 案例 2：登录拦截（未登录跳转 /login）

约定：用 cookie `token` 代表登录态。

`middleware.ts`

```ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value;

  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

说明：

- `req.nextUrl.clone()`：复制一份 URL，避免直接改原对象
- `redirect`：返回 302，让浏览器跳转

###### 案例 3：拦截/保护 API 路由（简单示例）

比如：禁止外部直接访问 `/api/private/*`（示例用 header 校验）。

```ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const key = req.headers.get("x-api-key");
  if (key !== "demo") {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/private/:path*"],
};

pages/index.tsx 或 app/page.tsx
  <p>
    <Link href="/api/private/ping">/api/private/ping (需要 header x-api-key=demo)</Link>
  </p>
点击是返回结果，不是“跳转到页面”
```

###### 排除 _next/static、api、favicon 

```ts
export const config = {
  matcher: ["/((?!_next/static|api|favicon.ico).*)"],
};
```

它的作用：

- 使用 **负向前瞻** 排除某些路径
- 避免静态资源/特定路由也进入 middleware

更推荐的思路（新版本优势点）：

- **能精确匹配就精确匹配**（例如只拦 `/admin/:path*`）
- 只有在你确实要“全站拦截，但排除静态资源”等情况，才使用这种正则 matcher



###### 补充：rewrite 和 redirect 的区别（图片里也用到了）

- **NextResponse.redirect(url)**：浏览器地址栏会变，发起一次新的请求（302/307 等）
- **NextResponse.rewrite(url)**：浏览器地址栏不变，把本次请求“内部改写”到另一个地址处理（用户无感知）

使用建议（新版本思路）：

- 需要“让用户跳转到登录页/新页面”用 **redirect**
- 想做“接口代理/路径映射/灰度”这类“对用户透明”的能力，用 **rewrite**



###### 补充：Next 中间件拦截和 Nuxt 相比，多了哪些/有什么不同

- Next Middleware 更像是“**请求入口层**”的第一道关卡：请求进来后，在到页面/接口处理前就能先拦一遍
- 默认跑在 **Edge Runtime**：更靠近用户（适合轻量逻辑），但也意味着不能随意使用 Node 专有 API
- `config.matcher` 让你能更精确地控制：
  - 哪些页面要拦截
  - 哪些 API 要拦截
  - 是否排除静态资源（`_next/static` 等）
- `NextRequest/NextResponse` 提供了更统一的请求/响应操作：
  - `req.nextUrl` 读写 pathname、searchParams 很方便
  - `cookies`、`headers`、`redirect/rewrite/next` 更“框架化”



###### 补充：rewrite/redirect 是否可以解决跨域问题（CORS）

结论：

- **rewrite 通常可以绕过浏览器跨域限制（常用来做接口代理）**
- **redirect 通常不能解决跨域**

原因：

- 浏览器跨域限制发生在：前端 JS 直接请求“不同域名/端口”的接口
- 使用 **rewrite** 时，前端只请求你自己站点的同域路径（例如 `/juanpi/api/homeInfo`），不会触发浏览器跨域
- Next 在服务器/边缘层把这次请求内部转发到远程域名处理，浏览器看不到“跨域目标”

注意：

- rewrite 不是万能的：目标服务如果有鉴权/限流/Referer 校验，仍可能失败
- 复杂代理建议考虑：API Route/Route Handler 或网关/Nginx；middleware 更适合轻量规则和简单转发



###### 案例 4：接口代理（rewrite），把本地 /juanpi/api 转发到远程

场景：

- 前端请求：`http://localhost:3000/juanpi/api/homeInfo`
- 希望中间件把它转发到：`http://codercba.com:9060/juanpi/api/homeInfo`

`middleware.ts`

```ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/juanpi/api")) {
    const targetUrl = new URL('oppo/info',`http://localhost:8000`);
    return NextResponse.rewrite(targetUrl);
      
  	// 或者直接
	return NextResponse.rewrite('http://localhost:8000/oppo/info');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/juanpi/api/:path*"],
};
```

说明：

- `new URL(pathname, base)` 会自动拼接成完整 URL
- `rewrite` 适合做“对用户无感”的代理/改写



###### 页面发请求（axios 示例）

页面：`pages/index.tsx`

```tsx
import axios from "axios";

export default function Home() {
  async function getHomeInfo() {
    const res = await axios.get("/juanpi/api/homeInfo");
    console.log(res.data);
  }

  return (
    <main>
      <div>hello world</div>
      <button onClick={getHomeInfo}>getHomeInfo</button>
    </main>
  );
}
```

为什么推荐这样写：

- 页面只关心“本地路径”`/juanpi/api/...`
- 代理目标域名/端口集中在 middleware 中维护，迁移环境更方便





###### 案例 5：路由保护（redirect），未登录跳登录页

下面示例和图片思路一致：没有 token 并且访问的不是 `/login` 时，强制跳转。

```ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

补充：

- 这个 matcher 是“全站拦截 + 排除静态资源”，适合做“站点登录墙”
- 如果你只想保护少量页面，仍然建议用精确 matcher（性能更好）

页面：`pages/login.tsx`

```tsx
import { useEffect } from "react";

export default function LoginPage() {
  useEffect(()=>{ // 保证他在客户端执行，document才有效，否则document报错
    document.cookie = "token=aabbcc; path=/"
    document.cookie = 'exp=v2;'
    console.log(document.cookie);
    console.log(location.origin, document.cookie);
  },[])  
  return (
    <main style={{ padding: 24 }}>
      <h1>Login</h1>
      <p>
        Demo login: open DevTools Console and run:
        <br />
        <code>document.cookie = "token=aabbcc; path=/"</code>
      </p>
    </main>
  );
}

```



## 2.重定向（1上面有）

重定向（Redirect）是什么：

- 让浏览器从 A 地址跳到 B 地址
- **地址栏会变化**，并且通常会发起一次新的请求

常见使用场景：

- 未登录访问受保护页面 -> 跳转 `/login`
- 旧链接迁移 -> 新链接
- 规范化 URL（例如 `/home` -> `/`）

### 在哪里做 redirect（两种常见位置）

###### 1）在 Middleware 里 redirect（动态、可读 cookie/header）

适合：鉴权、按 cookie/header/地区 等动态条件跳转。

```ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

###### 2）在 next.config.js 里 redirects（配置式、适合固定规则）

适合：永久迁移、固定路径变更，不依赖 cookie/header。

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/old",
        destination: "/new",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
```

补充：

- `permanent: true` 通常会返回 308（语义是永久重定向）
- 这种方式不需要写 middleware，也更适合 SEO 迁移

## 3.URL的重写（1上面有）

URL 重写（Rewrite）是什么：

- 把请求从 A 路径“内部映射”到 B 路径/地址
- **地址栏不变**（用户无感）

常见使用场景：

- **接口代理**：前端请求同域 `/api/...`，服务端转发到远程域名
- **路径映射**：让用户访问更短的 URL，但内部仍由另一个路由处理
- **灰度/AB**：不同用户请求被改写到不同后端

### 在哪里做 rewrite（两种常见位置）

###### 1）在 Middleware 里 rewrite（动态、可读 cookie/header）

适合：按用户状态做不同 rewrite，或你需要在请求入口层做“有条件的代理”。

```ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/juanpi/api")) {
    return NextResponse.rewrite(
      new URL(req.nextUrl.pathname, "http://codercba.com:9060")
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/juanpi/api/:path*"],
};
```

###### 2）在 next.config.js 里 rewrites（配置式、适合固定规则）

适合：固定代理/固定映射。

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/juanpi/api/:path*",
        destination: "http://codercba.com:9060/juanpi/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
```



### rewrite 是否能解决跨域（再强调一遍）

- **通常能**：因为浏览器只请求你站点同域的 `/juanpi/api/...`
- **本质**：跨域请求发生在服务器侧转发，浏览器不会因为“前端跨域”而拦截



# 三。自定义布局Layout

## 1.Layout的实现

Layout 是什么：

- 用来复用页面的“公共结构”，例如：Header / Footer / 侧边栏 / 导航栏

在 Next.js 里要分清两套体系：

- **Pages Router（pages 目录）**：需要你在 `pages/_app.tsx` 或每个页面里手动包裹 Layout
- **App Router（app 目录）**：天然支持 `layout.tsx`，并且支持自动嵌套

#### Pages Router：方式 1（全局统一 Layout）

适合：所有页面都长得一样（都有 header/footer）。

`components/Layout.tsx`

```tsx
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div>
      <header>header</header>
      {children}
      <footer>footer</footer>
    </div>
  );
}
```

`pages/_app.tsx`

```tsx
import type { AppProps } from "next/app";
import Layout from "../components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
```

补充：`Component` 和 `pageProps` 是什么

- **Component**
  - 当前 URL 命中的“页面组件”（例如 `/cart` 对应 `pages/cart.tsx` 导出的组件）
  - `_app.tsx` 通过渲染 `<Component />` 来渲染当前页面
- **pageProps**
  - Next.js 准备给当前页面的 props
  - 主要来自 `getStaticProps` / `getServerSideProps` 返回的 `props`
  - 页面没写这两个函数时，`pageProps` 通常是 `{}`





#### Pages Router：方式 2（推荐）每个页面自定义 Layout：getLayout

这是一种更现代、更可维护的做法：

- 不用在 `_app.tsx` 里写一堆 if/else 判断（例如根据 `Component.displayName` 来决定包不包 Layout）
- 每个页面自己声明“我需要什么布局”

`pages/_app.tsx`

```tsx
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return getLayout(<Component {...pageProps} />);
}
```

- 解释

`type ... = NextPage<P, IP> & { ... }`

- `NextPage<P, IP>`：Next.js 提供的“页面组件类型”
  - `P`：页面最终拿到的 props 类型（例如 `getServerSideProps` 返回的 `props`）
  - `IP`：initial props（历史遗留，通常不用管；默认用 `P` 就行）
- `& { ... }`：**交叉类型**（intersection）
  - 意思是：这个页面类型 = “Next 页面组件” **并且** 还多了一些你自定义的属性

`P = {}, IP = P`

- 这是**泛型默认值**

- 不传的时候：

  - `P` 默认是 `{}`（表示页面没 props 也行）
  - `IP` 默认等于 `P`

  

`getLayout?: (page: ReactElement) => ReactNode`

- `getLayout?`：**可选属性**
  - 有些页面有 layout，有些页面没有 layout，所以是可选
- 参数 `page: ReactElement`
  - 传进来的是“页面组件渲染出来的 React 元素”
  - 也就是你写的 `<Component {...pageProps} />`
- 返回 `ReactNode`
  - 返回任何可渲染内容（常见就是 `<Layout>{page}</Layout>`）



`AppProps` 是什么

- Next.js 给 `_app.tsx` 的 props 类型：

  - `Component`：当前路由命中的页面组件
  - `pageProps`：给页面的 props
  - 还有一些其它字段

  

为什么要 `& { Component: NextPageWithLayout }`

默认的 `AppProps` 里：

- `Component` 的类型是比较“普通”的页面类型（不认识你自定义的 `getLayout` 属性）

你把它改成：

- `Component: NextPageWithLayout`

这样 TS 才知道：

- `Component.getLayout` 这个东西**可能存在**，访问时不会报错



`??` 叫 **Nullish coalescing operator（空值合并运算符）**：

- 左边如果是 `null` 或 `undefined`，就用右边
- 否则用左边

这里的含义是：

- 如果页面定义了 `Component.getLayout`，就用它
- 如果页面没定义（是 `undefined`），就用默认函数：`(page) => page`
  - 默认函数就是“什么 layout 都不包”，直接返回页面本身



某个页面：`pages/cart.tsx`

```tsx
import type { ReactElement } from "react";
import Layout from "../components/Layout";
import type { NextPageWithLayout } from "./_app";

const CartPage: NextPageWithLayout = () => {
  return <div>cart</div>;
};

CartPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CartPage;
```

`const CartPage: NextPageWithLayout = () => ...`

- 把 `CartPage` 声明成 `NextPageWithLayout`

- 好处：

  - TS 允许你后面给 `CartPage` 挂 `getLayout`
  - TS 能检查 `getLayout` 的入参/返回值类型

  

`CartPage.getLayout = function getLayout(page) { ... }`

- 这是给函数对象（组件函数）**挂一个属性**
- React 组件本质上就是 JS 函数，函数是对象，所以可以挂属性
- `_app.tsx` 运行时拿到的 `Component` 就是这个 `CartPage` 函数
  - 所以 `_app.tsx` 可以读到 `Component.getLayout`

然后 `_app.tsx` 这句：

```ts
return getLayout(<Component {...pageProps} />);
```

就等价于：

- 先把页面渲染成 `page`
- 再交给页面自定义的 `getLayout` 包一层 Layout
- 返回包裹后的结果



某个页面不需要 Layout：`pages/index.tsx`

```tsx
export default function HomePage() {
  return <div>home</div>;
}
```



##### 连起来解释

#### 1) pages/_app.tsx：总入口，负责“执行页面的 getLayout”

##### (1) 关键类型：NextPageWithLayout

```
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};
```

含义：

- `NextPage<P, IP>`：Next.js 的“页面组件类型”
- `& { getLayout?: ... }`：在页面组件上**额外挂一个可选属性** getLayout
  - 可选是因为：有些页面不需要 Layout

##### (2) 为什么要改 `AppProps` 的 `Component` 类型

```
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
```

Next 默认的 `AppProps.Component` 并不知道你给页面加了 

getLayout 这个属性。
改完后 TS 才允许你写：

Component.getLayout

##### (3) 最核心的渲染逻辑

```
export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return getLayout(<Component {...pageProps} />);
}
```

这段做了 2 件事：

- **先把“当前页面”渲染成 React 元素**

  - `<Component {...pageProps} />`

- **再交给 getLayout 包装**

  - 如果页面没有定义 

    getLayout

    ，就用默认

    函数 

    ```
    (page) => page
    ```

    ，等于“不包布局

    ”

    

所以 

_app.tsx 的职责是：**统一调度**，把“布局决定权”交给每个页面。



------

#### 2) pages/admin/index.tsx：一个页面，通过 getLayout 声明“我要嵌套布局”

它本质上是一个函数组件（页面组件）：

```
const AdminHome: NextPageWithLayout = () => {
  return (
    <div>
      <h1>admin home</h1>
      ...
    </div>
  );
};
```

然后重点来了：给这个函数对象挂一个属性 

getLayout

```
AdminHome.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <DashboardLayout>{page}</DashboardLayout>
    </Layout>
  );
};
```

这里的 `page` 是什么？

- 就是 

  _app.tsx

   里

  先创建出来的

   

  ```
  <Component {...pageProps} />
  ```

  

- 对当前路由来说，`Component` 就是 

  AdminHome

  

- 所以 `page` 等价于：`<AdminHome />` 渲染出来的 React 元素

最终返回的结构是“从外到内”：

- `<Layout>`（外层：header/footer）
  - `<DashboardLayout>`（内层：sidebar + section）
    - `{page}`（页面内容：admin home）

这就实现了“嵌套布局”。





### App Router（最新推荐）：app/layout.tsx（具体看2.布局嵌套）

在 App Router 中，Layout 是“路由系统的一部分”，不需要 `getLayout` 也不需要 `_app.tsx`。

`app/layout.tsx`

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>
        <header>header</header>
        {children}
        <footer>footer</footer>
      </body>
    </html>
  );
}
```

相对旧资料（Pages Router 手动包裹 Layout）的优势：

- Layout 自动生效，代码更少
- 天然支持嵌套 layout（下一节）
- 布局在路由切换时可以保持（很多情况下不需要重复卸载/重建）



## 2.布局的嵌套

“布局嵌套”就是：外层布局 + 内层布局 + 页面内容。

##### Pages Router：用 getLayout 组合实现嵌套（推荐写法）

外层：`components/Layout.tsx`（全站 header/footer）

内层：`components/DashboardLayout.tsx`（后台页面才有侧边栏）

`components/Layout.tsx`

```tsx
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div>
      <header>header</header>
      {children}
      <footer>footer</footer>
    </div>
  );
}
```

`components/DashboardLayout.tsx`

```tsx
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <div>
      <aside>sidebar</aside>
      <section>{children}</section>
    </div>
  );
}
```

页面：`pages/admin/index.tsx`

```tsx
import type { ReactElement } from "react";
import Layout from "../../components/Layout";
import DashboardLayout from "../../components/DashboardLayout";
import type { NextPageWithLayout } from "../_app";

const AdminHome: NextPageWithLayout = () => {
  return <div>admin home</div>;
};

AdminHome.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <DashboardLayout>{page}</DashboardLayout>
    </Layout>
  );
};

export default AdminHome;
```

`pages/_app.tsx`（配合 getLayout 才能生效）

```tsx
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return getLayout(<Component {...pageProps} />);
}
```



##### **App Router：天然嵌套 layout（更推荐）**

目录结构示例：

- `app/layout.tsx`（全站布局）
- `app/admin/layout.tsx`（admin 路由段专属布局）
- `app/admin/page.tsx`（admin的页面）
  - app/page.tsx(是全局首页)
  - app/header.tsx(是全局的head，方便做seo优化)


`app/layout.tsx`

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>
        <header>header</header>
        {children} // 即app/pages.tsx
        <footer>footer</footer>
      </body>
    </html>
  );
}
```

`app/admin/layout.tsx`

```tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <aside>sidebar</aside>
      <section>{children}</section>
    </div>
  );
}
```

`app/admin/page.tsx`

```tsx
export default function AdminPage() {
  return <div>admin home</div>;
}
```

它最终的嵌套效果（从外到内）大概是：

- `app/layout.tsx`（header + children + footer）
  - `app/admin/layout.tsx`（sidebar + children）
  - `app/admin/page.tsx`（页面内容）

相对 Pages Router 的优势：

- 不需要手动组合 getLayout
- “布局属于路由段”，结构更直观
- 切换 admin 内部子页面时，外层布局可持续存在，体验更好







# 四。app目录解释和使用

### 内置文件夹和问价名

真正“固定/有特殊意义”的是这些**文件名**（不是文件夹名）：

- `page.tsx`：页面
- `layout.tsx`：布局
- `loading.tsx`：加载态
- `error.tsx`：错误边界（通常需要 client）
- `not-found.tsx`：404
- `route.ts`：API Route Handler（app router 的接口）
- `template.tsx`：类似 layout，但切换时会重新创建



这里的 `app/` 指的是 Next 13+ 的 **App Router**（新路由系统）。

核心记忆：

- **文件系统即路由**：目录结构决定 URL
- `page.tsx` 才是“一个路由页面”
- `layout.tsx` 用来包裹同目录以及子目录下的页面（天然支持嵌套）

下面给你一个“从一级路由到二级路由”的最小可跑通示例：

- 2 个文件夹：`app/`、`app/admin/`
- 共 6 个文件（示例用）：`header.tsx`、`layout.tsx`、`page.tsx`、`not-found.tsx`、`admin/layout.tsx`、`admin/page.tsx`

目录结构（2 个文件夹 + 6 个文件）：

```txt
app/
  header.tsx
  layout.tsx
  page.tsx
  not-found.tsx
  admin/
    layout.tsx
    page.tsx
```

路由对应关系：

- 一级路由：`/` -> `app/page.tsx`
- 二级路由：`/admin` -> `app/admin/page.tsx`

## 1）app/header.tsx（普通组件，不是 Next 特殊文件）

注意：

- 你写的 `header.tsx` 只是“组件文件名”，**不会自动做 SEO**
- 真正做 SEO 的常用方式是：
  - `metadata`（在 `layout.tsx`/`page.tsx` 导出）
  - 或 `head.tsx`（Next 的特殊文件）

`app/header.tsx`

```tsx
import Link from "next/link";

export default function Header() {
  return (
    <header>
      <Link href="/">home</Link>
      <span> | </span>
      <Link href="/admin">admin</Link>
    </header>
  );
}
```

## 2）app/layout.tsx（全站根布局：包住所有路由段）

`app/layout.tsx`

```tsx
import type { Metadata } from "next";
import Header from "./header";

// 往header里面加数据，用于seo优化
export const metadata: Metadata = {
  title: "App Router Demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>
        <Header />
        <main>{children}</main>// 即app/page.tsx
      </body>
    </html>
  );
}
```

## 3）app/page.tsx（一级路由 /）

`app/page.tsx`

```tsx
export default function HomePage() {
  return <div>home page</div>;
}
```

## 4）app/not-found.tsx（全站 404）

`app/not-found.tsx`

```tsx
export default function NotFound() {
  return <div>404 not found</div>;
}
```

## 5）app/admin/layout.tsx（二级路由段布局：只影响 /admin 下页面）

`app/admin/layout.tsx`

```tsx
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <aside>admin sidebar</aside>
      <section>{children}</section>
    </div>
  );
}
```

## 6）app/admin/page.tsx（二级路由 /admin）

`app/admin/page.tsx`

```tsx
export default function AdminPage() {
  return <div>admin page</div>;
}
```

最终渲染结构（从外到内）：

- `app/layout.tsx`
  - `app/page.tsx`（访问 `/`）
  - `app/admin/layout.tsx`
    - `app/admin/page.tsx`（访问 `/admin`）





# 五。组件的生命周期

## pages

### client

在 **Pages Router**（`pages/`）里：

- 组件第一次渲染通常会经历：
  - **服务端先渲染一份 HTML**（如果是 SSR/SSG 页面）
  - 浏览器拿到 HTML 后，再下载 JS 进行 **hydrate（水合）**
  - 水合完成后，才会进入 React 的“客户端生命周期”（`useEffect`/事件绑定等）

你在客户端最常用来“观察生命周期”的就是：

- `useEffect(() => { ... }, [])`
  - **只在浏览器执行**（不会在服务端执行）
  - 适合打印“页面已挂载”、请求浏览器 API、订阅事件
- `useEffect(() => { return () => ... }, [])`
  - 组件卸载时执行（例如路由切换离开页面）

最小可运行示例（`pages/lifecycle-client.tsx`）：

```tsx
import { useEffect } from "react";

export default function LifecycleClientPage() {
  console.log("[pages] render: 每次渲染都会执行（服务端也可能执行一次）");

  useEffect(() => {
    console.log("[pages] useEffect mount: 只会在浏览器执行一次");
    return () => {
      console.log("[pages] useEffect cleanup: 离开页面/组件卸载时执行（浏览器）");
    };
  }, []);

  return (
    <div>
      <h1>Pages Router - Client lifecycle</h1>
      <p>打开控制台，看 render / useEffect 的输出顺序</p>
    </div>
  );
}
```

你会看到：

- 首屏访问时：先出现一次（或多次）`render`，然后才出现 `useEffect mount`
- 通过 `next/link` 切走再回来：会触发 cleanup，再次 mount

### server

Pages Router 里，“服务端生命周期”本质上不是 React 的生命周期（因为 React 在服务端不会跑 `useEffect`），而是 **Next 的数据获取函数**在服务端运行：

- `getServerSideProps`：**每次请求**都会在服务器执行（典型 SSR）
- `getStaticProps`：**构建时**执行（SSG）
- `getStaticPaths`：配合动态路由生成静态页面

最小示例（`pages/lifecycle-server.tsx`）：

```tsx
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

export const getServerSideProps: GetServerSideProps<{ time: string }> = async (
  ctx
) => {
  console.log("[pages] getServerSideProps: 只在服务器执行", {
    url: ctx.resolvedUrl,
  });

  return {
    props: {
      time: new Date().toISOString(),
    },
  };
};

export default function LifecycleServerPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>// 拿到getServerSideProps里面的props
) {
  console.log("[pages] page render: 服务器会渲染一次，浏览器水合也会再渲染一次");

  return (
    <div>
      <h1>Pages Router - Server lifecycle</h1>
      <p>server time: {props.time}</p>
    </div>
  );
}
```

观察点：

- `getServerSideProps` 的 log 在 **终端/服务器日志**
- 组件函数里的 `console.log`：
  - SSR 首屏会在 **服务器**打印一次
  - 之后在 **浏览器**也可能打印（因为要水合/渲染）

## app

从 Next 13+ 开始，`app/` 默认使用 **App Router**。

这里和 3 年前很多教程最大的不同是：

- App Router 下组件默认是 **Server Component（服务端组件）**
  - 组件代码在服务端执行渲染
  - **不能使用** `useEffect` / `useState` / 浏览器 API（因为不在浏览器跑）
- 只有写了 `'use client'` 的组件才是 **Client Component（客户端组件）**
  - 才能用 `useEffect`/`useState`

### server（默认）

最小示例（`app/lifecycle/server/page.tsx`不是固定文件夹）：

```tsx
export default function ServerLifecyclePage() {
  console.log("[app] Server Component render: 只在服务器执行（按请求或按缓存策略）");

  return (
    <div>
      <h1>App Router - Server Component</h1>
      <p>打开终端/服务端日志看输出</p>
    </div>
  );
}
```

你会发现：

- 这个 `console.log` **不会出现在浏览器控制台**（因为它在服务端渲染）

### client（需要 'use client'）

最小示例（`app/lifecycle/client/page.tsx`）：

```tsx
"use client";

import { useEffect, useState } from "react";

export default function ClientLifecyclePage() {
  console.log("[app] Client Component render: 浏览器渲染时会执行");
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("[app] useEffect mount: 浏览器执行");
    return () => {
      console.log("[app] useEffect cleanup: 离开页面/组件卸载（浏览器）");
    };
  }, []);

  return (
    <div>
      <h1>App Router - Client Component</h1>
      <button onClick={() => setCount((c) => c + 1)}>count: {count}</button>
      为什么点击这个，  console.log("[app] Client Component render: 浏览器渲染时会执行");这个会执行
          点击按钮时发生的事情是：
            onClick 在浏览器触发（事件发生在客户端）
            执行 setCount((c) => c + 1)，count 变了
            React 会把这个组件标记为需要更新
            React 重新执行这个组件函数（也就是再次运行 ClientLifecyclePage()）
    </div>
  );
}
```

### 相对“旧知识点”的更新与优势（App Router）

老的认知里经常把“服务端生命周期”理解为：只有 `getServerSideProps` / `getStaticProps` 这些函数才算服务端逻辑。

在 App Router 的新模型下，优势是：

- **默认服务端渲染更彻底**
  - 不需要为了 SSR 专门写 `getServerSideProps` 才“上服务端”
  - 组件默认就在服务端执行（除非你声明 `'use client'`）
- **客户端 JS 更少**
  - 只有 Client Components 会进入浏览器 bundle
  - 首屏更轻，交互部分才下发 JS
- **更自然的分层**
  - 数据获取/渲染：Server Component
  - 交互/状态/副作用：Client Component（`useState`/`useEffect`）





