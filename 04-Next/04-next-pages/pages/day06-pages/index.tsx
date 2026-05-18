import Link from "next/link";

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>day06 - Pages Router demos</h1>

      <h2>(1) 编程导航</h2>
      <p>
        <Link href="/day06-pages/nav/link-demo">/day06-pages/nav/link-demo</Link>
      </p>
      <p>
        <Link href="/day06-pages/nav/router-demo">/day06-pages/nav/router-demo</Link>
      </p>
      <p>
        <Link href="/day06-pages/nav/as-demo">/day06-pages/nav/as-demo</Link>
      </p>

      <h2>(3) 动态路由</h2>
      <p>
        <Link href="/day06-pages/users">/day06-pages/users</Link>
      </p>
      <p>
        <Link href="/day06-pages/posts">/day06-pages/posts</Link>
      </p>

      <h2>(2) 路由监听</h2>
      <p>
        已在 <code>pages/_app.tsx</code> 全局监听 <code>router.events</code>。
        点击上面任意 Link 或按钮跳转，观察控制台输出。
      </p>
    </main>
  );
}
