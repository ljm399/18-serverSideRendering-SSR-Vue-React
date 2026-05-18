import Link from "next/link";

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>05-next-middle (Pages Router) - Middleware demos</h1>

      <h2>基础</h2>
      <p>
        <Link href="/mw-log">/mw-log (middleware log)</Link>
      </p>

      <h2>AB/灰度 (rewrite)</h2>
      <p>
        <Link href="/home">/home (cookie exp=v2 时会 rewrite 到 /v2/home)</Link>
      </p>
      <p>
        <Link href="/v2/home">/v2/home</Link>
      </p>

      <h2>简单安全策略</h2>
      <p>
        <Link href="/admin/secret">/admin/secret (403)</Link>
      </p>

      <h2>登录拦截 (redirect)</h2>
      <p>
        <Link href="/admin">/admin (无 token 会跳 /login?from=/admin)</Link>
      </p>
      <p>
        <Link href="/login">/login</Link>
      </p>

      <h2>保护 API</h2>
      <p>
        <Link href="/api/private/ping">/api/private/ping (需要 header x-api-key=demo)</Link>
      </p>

      <h2>接口代理 (rewrite)</h2>
      <p>
        <Link href="/juanpi/api/homeInfo">
          /juanpi/api/homeInfo (middleware rewrite 到 localhost:8000/oppo/info)
        </Link>
      </p>

      <h2>全站登录墙示例 (排除静态资源那种 matcher 思路)</h2>
      <p>
        <Link href="/wall">/wall (无 token 会跳 /wall/login)</Link>
      </p>
      <p>
        <Link href="/login">login</Link>
      </p>

      <h2>next.config 配置式</h2>
      <p>
        <Link href="/cfg/old">/cfg/old (redirects)</Link>
      </p>
      <p>
        <Link href="/cfg/new">/cfg/new</Link>
      </p>
      <p>
        <Link href="/cfg/juanpi/api/homeInfo">/cfg/juanpi/api/homeInfo (rewrites)</Link>
      </p>
    </main>
  );
}
