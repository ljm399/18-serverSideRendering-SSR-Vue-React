# 六。网络请求的封装

## axios + ts 的封装

目标：把 axios 的重复代码（baseURL、timeout、拦截器、类型推导）收敛到一个请求类里，页面里只写：

```ts
const res = await hyRequest.get<IResultData>("/homeInfo")
```

如果你是 Next 项目：

- Pages Router：可以放在 `service/` 或 `src/service/`
- App Router：也一样可以放在 `src/service/`，但要注意“在 Server 还是 Client 调用”（后面会讲）

### 2）封装 request 类（HYRequest）

`src/service/request/index.ts`

```ts
import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

const BASE_URL = "http://coderbca.com:9060/juanpi/api";
const TIME_OUT = 1000 * 60;

class HYRequest {
  instance: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);

    // 全局请求拦截
    this.instance.interceptors.request.use(
      (config) => {
        console.log("[request interceptor] 请求被拦截", config.url);
        return config;
      },
      (err) => err
    );

    // 全局响应拦截
    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        console.log("[response interceptor] 响应被拦截", res.config.url);
        return res;
      },
      (err) => err
    );
  }

  // 核心：用泛型 T 来约束返回值类型
  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      this.instance
        .request<any, AxiosResponse<T>>(config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  get<T = any>(url: string, params?: any): Promise<T> {
    return this.request<T>({ url, params, method: "GET" });
  }

  post<T = any>(url: string, data?: any): Promise<T> {
    return this.request<T>({ url, data, method: "POST" });
  }
}

export default HYRequest;

export const hyRequest = new HYRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
});
```

说明：

- `request<T>` 是关键：`T` 决定了 `await` 拿到的数据类型
- `resolve(res.data)`：返回“业务数据”而不是 axios 的完整响应对象（更常用）
  - 要是resolve(res)则返回的类型Promise< T> 要修改为Promise<AxiosResponse< T>>


### 3）统一导出实例

`src/service/index.ts`

```ts
export { hyRequest as default } from "./request";
```

（如果你不喜欢 `default`，也可以 `export { hyRequest }`，看团队习惯即可。）

### 4）页面中使用（带 TS 类型）

以 Pages Router 为例（截图里的写法类似）：

`pages/index.tsx`

```tsx
import hyRequest from "../service";

interface IResultData {
  code: number;
  data: any;
}

export default function Home() {
  async function getHomeInfo() {
    const res = await hyRequest.get<IResultData>("/homeInfo");
    console.log("getHomeInfo res =>", res);
  }

  return (
    <>
      <div>hello world</div>
      <button onClick={getHomeInfo}>getHomeInfo</button>
    </>
  );
}
```

补充建议（你先记住结论即可）：

- App Router 的 Server Component 里，官方更推荐直接用 `fetch`（支持缓存/去重等能力），axios 也能用但要注意运行环境
- 如果你要用 axios 并且想隐藏真实后端地址，通常会配合：
  - `app/api/**/route.ts` 做“BFF”中转
  - 或 `middleware + rewrite` 做同源代理（你前面笔记里已经讲过 rewrite/redirect 了）



# 七。开发后端接口

这里的“开发后端接口”，在 Next 里通常有两种写法：

- Pages Router：`pages/api/**`（API Routes）
- App Router（Next 13+）：`app/api/**/route.ts`（Route Handlers，更新的写法）

下面先按图片演示 **Pages Router** 的 API Routes。

## 1）Pages Router：API Routes（`pages/api/login.ts`）

路由规则：

- `pages/api/login.ts` 对应接口：`/api/login`

最小示例（截图同款：打印 `url/method/query/body`，只允许 POST）：

```ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.url);
  console.log(req.method);
  console.log(req.query);
  console.log(req.body);

  if (req.method === "POST") {
    const userInfo = {
      name: "liujun",
      age: 18,
      token: "aabbcc",
    };

    res.status(200).send(userInfo);
  } else {
    res.status(405).end();
  }
}
```

关键点：

- `req.query`：拿 URL 上的 query，例如 `/api/login?id=100`
- `req.body`：拿 POST body（axios POST 第二个参数传的对象）
- `405 Method Not Allowed`：告诉前端“这个接口不支持该 method”

前端调用接口（示例：`pages/profile.tsx`）

下面对应截图：请求 `/api/login?id=100`，body 里传账号密码，然后把返回的 `token` 写入 cookie。

```tsx
import axios from "axios";
import { setCookie } from "cookies-next";

export default function Profile() {
  function login() {
    axios
      .post("/api/login?id=100", {
        username: "admin",
        password: 123456,
      })
      .then((res) => {
        console.log(res.data);
        setCookie("token", res.data.token, {
          maxAge: 60,
        });
      });
  }

  return (
    <div className="profile">
      <div>Profile</div>
      <button onClick={login}>login</button>
    </div>
  );
}
```

说明：

- `axios.post(url, data)`
  - `url` 里带的 `?id=100` 会在接口端出现在 `req.query`
  - `data` 会在接口端出现在 `req.body`
- `cookies-next`
  - 适合 Next 项目里在客户端/服务端都更方便地操作 cookie
  - 如果你的项目没装，需要手动安装依赖后才能用



## 2）更新点：Next 13+ 更推荐 Route Handlers（App Router）

在 Next 13/14/15 的 App Router 下，官方更推荐用：

- `app/api/login/route.ts`

优势（相对 3 年前的 API Routes）：

- 更贴近 Web 标准：使用 `Request/Response`
- 和 Server Components 配合更自然（更方便做 BFF/中转）
- 更容易按“路由段”组织接口目录

最小示例（对照理解即可）：

```ts
export async function POST(req: Request) {
  const url = new URL(req.url);
  console.log(url.pathname);
  console.log(Object.fromEntries(url.searchParams.entries()));
	const query = Object.fromEntries(url.searchParams.entries());
    	entries() 是什么？
        url.searchParams 是一个 URLSearchParams 对象（表示 URL 上的查询参数，例如 ?a=1&b=2）。
        url.searchParams.entries() 会返回一个可迭代对象（iterator），里面每一项都是一个 [key, value] 二元数组：
        形状：IterableIterator<[string, string]>
        示例：[["a","1"], ["b","2"]]
    
    
        Object.fromEntries就是把 URL 查询参数从：
        URLSearchParams（迭代器形式） 变成：
        普通对象 query
        例如请求：
        /api/login?role=admin&from=web
        最终：
        // => { role: "admin", from: "web" }

  const body = await req.json();
  console.log(body);

  return Response.json({ name: "liujun", age: 18, token: "aabbcc" });
}
```

2. 前端页面调用（App Router，Client Component）

页面路径：`app/profile/page.tsx`

访问地址：`/profile`

```tsx
"use client";

import axios from "axios";
import { setCookie } from "cookies-next";

export default function ProfilePage() {
  function login() {
    axios
      .post("/api/login?id=100", {
        username: "admin",
        password: 123456,
      })
      .then((res) => {
        console.log(res.data);
        setCookie("token", res.data.token, {
          maxAge: 60,
        });
      });
  }

  return (
    <div className="profile">
      <div>Profile</div>
      <button onClick={login}>login</button>
    </div>
  );
}
```

注意：

- `app/profile/page.tsx` 必须是 Client Component（所以要写 `'use client'`），否则不能绑定点击事件
- `cookies-next` 如果项目没装，需要安装后才能用






# 八。渲染的模式

## 预渲染的介绍

默认情况下，Next 会对页面做“预渲染”（Pre-render）：


- 不是等浏览器下载完 JS 才把页面内容渲染出来
- 而是在 **服务端/构建阶段**就把页面对应的 HTML 先生成好

这样带来的好处：


- **首屏更快**：浏览器先拿到完整 HTML（不容易白屏）
- **SEO 更好**：搜索引擎更容易抓取到真实内容

当浏览器拿到 HTML 后，会再下载 JS，把页面“激活”为可交互页面，这个过程叫：


- **Hydration（水合）**：让按钮点击、事件、useEffect 等在浏览器生效

Next 常见的“预渲染方式”可以理解为：


- **SSG**：构建时生成 HTML（推荐，性能最好，CDN 友好）
  -  Content Delivery Network 内容分发网络
    - **CDN**：把这些静态文件全丢全球节点缓存

- **SSR**：每次请求时生成 HTML（数据强实时）
- **ISR**：在 SSG 的基础上，按一定时间后台重新生成（兼顾性能和更新）
- **CSR**:客户端渲染
  - **测试**：到浏览器查看源代码，没有网页显示的数据就是CSR,有就是上面的3种写法



## 1.SSG

SSG（Static Site Generation，静态生成）：


- 在执行 `next build` (即构建阶段）时，把页面对应的 HTML 直接生成出来
- 生成后的 HTML 可以被复用、缓存、上 CDN

### 方式一：

生成**不带外部数据**的静态页面（最简单）。


特点：


- 不写 `getStaticProps`，也能是 SSG
- 适合：about、文档、纯静态介绍页

示例（`pages/about.tsx`）：


```tsx
export default function About() {
  return <div>About</div>;
}
```



### 方式二

#### 情况一

页面**内容**取决于外部数据（但是路由路径是固定的），用：


- `getStaticProps`

执行时机：


- 只在 **构建时**执行（Node 环境）
- 不会在浏览器执行

示例（和你图里一致的写法，`pages/books-ssg/index.tsx`）：


```tsx
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { memo } from "react";

type Book = { id: number; name: string };

async function fetchBooks() {
  // 这里用你自己的请求方法即可（axios/fetch/hyRequest）
  // return hyRequest.get<{ data: { books: Book[] } }>("/books");
  return { data: { books: [{ id: 1, name: "book1" }] } };
}

export const getStaticProps: GetStaticProps<{ books: Book[] }> = async () => {
  // 只在构建时执行：build 阶段拉数据
  const res = await fetchBooks();
  return {
    props: {
      // 返回的 props 会注入到页面组件
      books: res.data.books,
    },
  };
};

const BooksSSG = memo(function BooksSSG(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { books } = props;
  return (
    <div className="home">
      <div>BooksSSG</div>
      <ul>
        {books?.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
});

export default BooksSSG;
```


一句话：


- `getStaticProps` 拉数据
- return 的 `props` 注入到组件里渲染
- 构建阶段生成一份静态 HTML

  - 可以再.next文件夹里面可以看到对应的html

补充：`npm run dev` 会不会去 `.next` 里拿到对应 HTML？

- `npm run dev`（`next dev`）
  - 开发模式为了热更新/调试，会做**按需编译**
  - 页面更多是“实时渲染/实时编译”的结果
    - 你刚写/刚改的页面文件会被**即时编译**，并把“开发用的编译产物”输出到 `.next/`（用于 dev server 运行）
    - 这里的 `.next/` 更像是**开发缓存/临时编译结果**，不是 `next build` 那种“面向生产的打包产物”
  - 虽然也会生成 `.next/` 目录存放一些开发产物，但它不是简单地“直接读取构建好的静态 HTML 文件”
- 生产模式下，才更贴近“构建阶段生成静态 HTML”的概念：
  - `next build`：生成 `.next` 里的生产构建产物
  - `next start`：启动生产服务，SSG 的缓存/复用效果更明显（也更容易被 CDN 缓存）




#### 情况二

页面的 **paths（路径）** 也取决于外部数据（常见于动态路由），用：


- `getStaticPaths` + `getStaticProps`

它俩的分工（重点）：

- `getStaticPaths`
  - **决定要生成哪些路径**（例如要生成 `/posts/1`、`/posts/2`…）
  - 你需要在这里先拿到所有的 `id` 列表，然后 return 给 Next
- `getStaticProps`
  - **决定每个路径页面的内容数据**
  - Next 会对 `paths` 里的每一个 `id`，调用一次 `getStaticProps({ params: { id } })`
  - 你在这里根据 `id` 拉详情数据，return `props` 给页面

构建阶段的执行顺序：

- 先执行一次 `getStaticPaths` 生成所有 `paths`
- 再对每个 path 执行一次 `getStaticProps`

例子：文章详情页 `/posts/[id]`：


- 你需要先从后端拿到有哪些 `id`
- 把这些 `id` 作为 paths
- 再针对每个 `id` 在 `getStaticProps` 拉对应详情数据

  - 生成多个html页面


示例：


文件路径：`pages/posts/[id].tsx`


```tsx
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";

type Post = { id: string; title: string };

async function fetchPostIds(): Promise<string[]> {
  return ["1", "2", "3"]; // 模拟
}

async function fetchPostDetail(id: string): Promise<Post> {
  return { id, title: `post-${id}` }; // 模拟
}

export const getStaticPaths: GetStaticPaths = async () => {
  // 1）构建阶段：先决定“要生成哪些 /posts/[id]”
  const ids = await fetchPostIds();
  return {
    // 这些 params 会对应到动态路由文件名 [id]
    paths: ids.map((id) => ({ params: { id } })),
    // false 表示：不在 paths 里的路由一律 404
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{ post: Post }> = async (ctx) => {
  // 2）构建阶段：对每个 id 再拉一次详情数据
  const id = ctx.params?.id as string;
  const post = await fetchPostDetail(id);
  return {
    // 返回给页面组件的 props
    props: { post },
  };
};

export default function PostDetailPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <div>
      <h1>{props.post.title}</h1>
      <p>id: {props.post.id}</p>
    </div>
  );
}
```





### 更新点：Next 13/14/15（App Router）下的“SSG 思维”

3 年前很多课是以 `getStaticProps/getStaticPaths` 为核心讲 SSG（这是 Pages Router 的模型）。


在 App Router 下（更推荐的路由系统），对应的核心点变成：


- **默认 Server Component** + `fetch` 默认会走缓存（在很多场景下天然接近 SSG）
- 动态路由的静态参数：`generateStaticParams`（类似 `getStaticPaths`）
- 需要定时更新：`revalidate`（ISR 思维）

最小对照（只看概念即可）：


```ts
// app/posts/[id]/page.tsx
export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }];
}

export default async function PostPage({ params }: { params: { id: string } }) {
  // const res = await fetch(`https://.../posts/${params.id}`, {
  //   next: { revalidate: 60 },
  // });
  return <div>post id: {params.id}</div>;
}
```



### SSG应用场景

建议：**在可能的情况下尽量使用静态生成 SSG（无论有无数据）**。

原因：

- 静态页面只需要在构建时生成一次
- 后续请求可以复用，并且非常适合 CDN 分发（性能/稳定性最好）

适合用 SSG 的页面类型（常见）：

- 营销页、官网主页
- 博客文章、作品集/个人简历
- 电商商品列表页（对实时性要求不高）
- 帮助中心、文档

怎么判断该不该用 SSG（核心标准）：

- 如果在**用户请求之前**就可以把页面预渲染出来（数据不需要强实时），优先选 SSG
- 如果页面展示的是**经常变化、并且每次访问都必须最新**的数据，那么纯 SSG 就不适合

当数据更新很频繁时，常见两种替代方案：

#### 1）SSG + 客户端请求（混合使用）

- 页面主体用 SSG（保证首屏快、SEO 好）
- 部分“强实时数据”交给客户端用 JS 再请求更新（例如在 `useEffect` 里请求）

注意：客户端请求填充出来的内容，SEO 不如服务端预渲染稳定。

#### 2）SSR（服务器端渲染 / 动态渲染）

- 每次请求都在服务器重新生成 HTML
- 优点：数据更新更及时
- 缺点：不如 SSG/CDN 友好，性能更依赖服务器

补充（Next 13/14/15 的更新点）：

- App Router 下，更多是通过 `fetch` 的缓存策略来决定“更像 SSG 还是 SSR”
- 需要定时更新可以用 `revalidate`（ISR 思维）
- 需要隐藏后端/鉴权/拼装数据，常配合 `app/api/**/route.ts` 做 BFF 中转



## 2.SSR

SSR（Server Side Rendering，服务器端渲染，也叫动态渲染）：

- 如果页面使用 SSR，那么 Next 会在**每次页面请求（request）**时，重新生成该页面的 HTML
- 在 Pages Router 中，要启用 SSR，你需要导出一个 `getServerSideProps`（async 函数）

### 方式：getServerSideProps

文件示例：`pages/books-ssr/index.tsx`

```tsx
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { memo } from "react";

type Book = { id: number; name: string };

async function fetchBooks(count: number) {
  // 这里模拟“从后端根据 count 获取数据”
  return { data: { books: [{ id: 1, name: `book-${count}` }] } };
}

export const getServerSideProps: GetServerSideProps<{ books: Book[] }> = async (
  context
) => {
  // 只在服务端运行：每次请求这个页面都会执行一次
  console.log("getServerSideProps");
  // query 参数：例如 /books-ssr?count=10
  console.log(context.query);

  // 从 query 中取 count（注意类型是 string | string[] | undefined）
  const count = parseInt((context.query.count as string) || "1");
  const res = await fetchBooks(count);

  return {
    props: {
      // 返回的 props 会注入到页面组件
      books: res.data.books,
    },
  };
};

const BooksSSR = memo(function BooksSSR(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  // memo：减少“相同 props 导致的重复渲染”（这里更多是演示写法）
  return (
    <ul>
      {props.books.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
});

export default BooksSSR;
```

### SSR 的运行时机（注意事项）

- `getServerSideProps` **只在服务器运行**，不会在浏览器运行
- **每次请求都会执行一次**（所以数据更“新”）
- 触发请求的方式包括：
  - 直接在地址栏输入 URL / 刷新页面
  - 使用 `next/link` 或 `router.push` 做页面跳转（Next 会向服务器发请求，服务端仍会执行 `getServerSideProps`）

### 什么时候用 SSR

- 页面数据必须在**每次请求时获取**（强实时）
  - 例如：用户个性化数据、订单状态、后台管理实时看板

### SSR 的缺点

- 不能像 SSG 那样“构建一次、CDN 复用”，性能更依赖服务器
- 页面默认不缓存（或需要你自己做缓存策略）

### 更新点：Next 13/14/15（App Router）的对应思路

3 年前的 SSR 基本都围绕 `getServerSideProps`（Pages Router）。

在 App Router 下，更常见的“SSR/动态渲染”触发方式是：

- 在 Server Component 里使用 `fetch(url, { cache: 'no-store' })`（不缓存，每次请求都拿最新）
- 或者使用 `cookies()` / `headers()`（Next 会把该路由段视为动态渲染）

代码案例 1：`fetch + no-store`（每次请求都拿最新）

文件路径：`app/books-ssr/page.tsx`

```tsx
// 默认是 Server Component（不写 'use client'）

type Book = { id: number; name: string };

export default async function BooksSSRPage() {
  // cache: 'no-store' 表示不走缓存 => 更像 Pages Router 的 SSR
  // 每次请求该页面都会重新请求接口，拿到“最新数据”
  const res = await fetch("https://example.com/api/books", {
    cache: "no-store",
  });

  const data = (await res.json()) as { books: Book[] };

  return (
    <ul>
      {data.books.map((b) => (
        <li key={b.id}>{b.name}</li>
      ))}
    </ul>
  );
}
```

代码案例 2：使用 `cookies()` / `headers()` 触发动态渲染

文件路径：`app/profile/page.tsx`

```tsx
import { cookies, headers } from "next/headers";

export default async function ProfilePage() {
  // 只要你在 Server Component 里读取 cookies/headers
  // Next 会把这个路由段视为“动态渲染”（更像 SSR）
  const token = (await cookies()).get("token")?.value;

  // 读取 headers 也是同理（这里演示一下）
  const ua = (await headers()).get("user-agent");

  return (
    <div>
      <div>token: {token || "(empty)"}</div>
      <div>ua: {ua || "(empty)"}</div>
    </div>
  );
}
```

对比记忆：

- Pages Router：用 `getServerSideProps` 表达“每次请求都跑服务端”
- App Router：用数据缓存策略（`no-store`/`revalidate`）表达“更像 SSR 还是更像 SSG/ISR”


## 3.ISR

ISR（Incremental Static Regeneration，增量静态再生）：

- Next 除了支持 SSG/SSR，还允许你在网站构建完成后，**按一定间隔“重新生成”静态页面**
- 你可以把 ISR 理解为：
  - 平时像 SSG（快、可缓存、可 CDN）
  - 到了时间窗口又能更新（不必每次都 SSR）

### Pages Router 写法：`getStaticProps` + `revalidate`

核心：在 `getStaticProps` 返回值里增加 `revalidate`（单位：秒）。

文件示例：`pages/books-isr/index.tsx`

```tsx
import type { GetStaticProps, InferGetStaticPropsType } from "next";

type Book = { id: number; name: string };

async function fetchBooks(count: number) {
  return {
    data: {
      books: Array.from({ length: count }).map((_, i) => ({
        id: i + 1,
        name: `book-${i + 1}`,
      })),
    },
    // Array.from({ length: 3 })返回[undefined, undefined, undefined]
    // map((_, i) => ({ 里面的_ 只是为了占位符罢了
        
  };
}

export const getStaticProps: GetStaticProps<{ books: Book[]; count: number }> =
  async () => {
    // 为了观察 ISR 是否在更新，这里用随机数模拟“每次生成的数据不同”
    const count = Math.floor(Math.random() * 10 + 1);
    const res = await fetchBooks(count);

    return {
      props: {
        books: res.data.books,
        count,
      },
      // 关键：单位是秒
      // 表示这个页面“最多”5 秒更新一次（到期后下一次请求会触发再生成）
      revalidate: 5,
    };
  };

export default function BooksISRPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <div>
      <div>count(from build): {props.count}</div>
      <ul>
        {props.books.map((b) => (
          <li key={b.id}>{b.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### ISR 触发规则（非常重要）

- `revalidate: 5` 不是“每隔 5 秒自动生成一次”
- 更准确是：
  - 页面生成后，在 5 秒内访问都复用旧的静态内容
  - 超过 5 秒后，**下一次访问**会触发页面在后台重新生成（完成后后续访问用新内容）

### 什么时候用 ISR

- 页面希望“尽量快 + 可 CDN”，但数据又需要定时更新
  - 例如：新闻列表、活动页、榜单、商品列表（分钟级更新就够）

### 更新点：Next 13/14/15（App Router）对应写法

App Router 下不再写 `getStaticProps`，更常见的写法是在 `fetch` 上配置：

```ts
ssg的情况二
type Book = { id: number; name: string };

export const revalidate = 5;

export default async function Page() {
  const time = new Date().toISOString();

  return (
    <div style={{ padding: 24 }}>
      <h1>BooksISR (App Router revalidate=5)</h1>
      <p>看时间有无变化判断isr有无生效---time(from server component): {time}</p>
    </div>
  );
}

/*	测试：
	npm run dev 下很多东西更偏“每次请求都重新算”，并不会像生产环境那样严格按 ISR 缓存/重建流程表现出来。
    请用：
    npm run build
    npm run start
    打开 http://localhost:3000/books-isr
*/
```


## 4.CSR

CSR（Client Side Rendering，客户端渲染）：

- 页面主要在**浏览器端**通过 JS 获取数据并渲染
- 特点是：首屏可能先返回一个“壳”（HTML 内容少），等 JS 执行后才把数据渲染出来

优点：

- 交互灵活，适合强交互页面（表单、管理后台）
- 业务逻辑很多在前端，开发体验接近传统 SPA

缺点：

- **SEO 不友好**：搜索引擎不一定等你的请求完成
- **首屏可能白屏/慢**：要先下载 JS 再渲染

### Pages Router 示例：`useEffect` 在客户端获取数据

文件路径：`pages/books-csr/index.tsx`

```tsx
import { memo, useEffect, useState } from "react";

type Book = { id: number; name: string };

async function fetchBooks(count: number) {
  return {
    data: {
      books: Array.from({ length: count }).map((_, i) => ({
        id: i + 1,
        name: `book-${i + 1}`,
      })),
    },
  };
}

const BooksCSR = memo(function BooksCSR() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    // 只在浏览器执行：CSR 的数据获取
    const count = Math.floor(Math.random() * 10 + 1);
    fetchBooks(count).then((res) => {
      console.log(res.data.books);
      setBooks(res.data.books);
    });
  }, []);

  return (
    <div className="home">
      <div>BooksCSR</div>
      <ul>
        {books.map((b) => (
          <li key={b.id}>{b.name}</li>
        ))}
      </ul>
    </div>
  );
});

export default BooksCSR;
```

### 什么时候用 CSR

- 页面不依赖 SEO
- 数据必须在客户端拿（依赖浏览器能力/只对登录用户可见）
- 典型：管理后台、强交互的页面模块

### 更新点：Next 13/14/15（App Router）下的 CSR

App Router 下要做 CSR，本质上就是把组件声明为 Client Component：

- 写 `'use client'`
- 再用 `useEffect` / `useState` 拉数据渲染

示例路径：`app/books-csr/page.tsx`

```tsx
"use client";

import { useEffect, useState } from "react";

type Book = { id: number; name: string };

export default function BooksCsrPage() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetch("/api/books")
      .then((r) => r.json())
      .then((data) => setBooks(data.books));
  }, []);

  return (
    <ul>
      {books.map((b) => (
        <li key={b.id}>{b.name}</li>
      ))}
    </ul>
  );
}
```

补充建议：

- App Router 下“尽量把渲染放到服务端组件”，把交互放到客户端组件
- 需要做客户端数据请求时，工程上常会用 SWR/React Query 统一管理缓存与 loading/error（比手写 `useEffect` 更舒服）



# 九。为什么不直接用 Vue 或 React，反而选择用 Nuxt 或 Next？

## 1）最核心的区别：纯 Vue/React 通常是“只做客户端渲染（CSR）”

你直接用 `create-vue`（或 Vite + Vue）/ 纯 React（例如 Vite React、CRA）创建的项目，默认更偏向 SPA/CSR：

- 首屏可能是一个空壳，主要靠浏览器下载 JS 后再渲染内容
- **SEO 较弱**（搜索引擎不一定等待你的客户端请求完成）
- **首屏体验可能更慢**（白屏时间更长）
- 路由、打包优化、SSR/SSG、接口中转、部署策略等，需要你自己组合选型与配置

这就是“纯前端 SPA”常见的痛点。

---

## 2）为什么要用 Nuxt / Next（它们是 Meta-framework）

Nuxt（Vue 生态）/ Next（React 生态）本质上是：

- 在 Vue/React 之上提供一整套“工程化 + 渲染模式 + 路由 + 全栈能力”的解决方案

### ① 开箱即用的渲染模式（SSR / SSG / ISR）

- **SSG**：构建时生成 HTML（适合官网、文档、博客）
- **SSR**：每次请求生成 HTML（适合强实时、个性化）
- **ISR**：静态页按时间增量更新（兼顾性能与更新）

这些能力让你更容易做：

- 首屏更快
- SEO 更友好

### ② 文件系统路由（零/低配置）

- Nuxt：`pages/` 基本就是路由
- Next：
  - Pages Router：`pages/` 基本就是路由
  - App Router（Next 13+ 更推荐）：`app/` 基本就是路由 + 布局

不用手写一大堆路由配置。

### ③ 内置数据获取与“服务端优先”的能力

- Nuxt：`useFetch`/`useAsyncData` 等
- Next：
  - Pages Router：`getStaticProps`/`getServerSideProps`
  - App Router：Server Components + `fetch` 缓存策略（`no-store`/`revalidate`）

优势：更容易把“数据获取 + 渲染”放在服务端完成，客户端只负责交互。

### ④ 内置工程化与性能优化

通常会内置或更容易接入：

- 代码分割
- 资源压缩
- TypeScript / ESLint
- 图片优化（Next 的 `next/image` 等）

### ⑤ 更顺手的部署与运行时能力

- 一套命令即可构建/启动
- 更容易部署到常见平台（Node/Serverless/Edge 等，取决于你的部署方案）

### ⑥ “全栈/BFF”能力（能写接口、做中转）

- Next：`pages/api/**`（旧）/ `app/api/**/route.ts`（新）
- Nuxt：server routes（Nuxt 3 的 Nitro）

常用于：

- 隐藏后端真实地址
- 统一鉴权
- 拼装多个后端接口的数据

---

## 3）什么时候不需要 Nuxt / Next

- 纯后台系统，SEO 完全不重要，且主要是强交互
- 项目非常小（单页活动页/内嵌页），用 SPA 足够
- 团队不希望引入服务端概念，或暂时没有部署服务端的条件

一句话：

- 需要 **SEO/首屏/多渲染模式/全栈中转**：优先 Nuxt/Next
- 只做 **纯交互 SPA**：Vue/React + Vite 也很好
