import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>06b-next-layoutbyapp (App Router)</h1>
      <p>
        <Link href="/lifecycle/client">/lifecycle/client</Link>
      </p>
      <p>
        <Link href="/lifecycle/server">/lifecycle/server</Link>
      </p>
      <p>
        <Link href="/admin">/admin (admin/layout.tsx 嵌套布局)</Link>
      </p>
    </main>
  );
}
