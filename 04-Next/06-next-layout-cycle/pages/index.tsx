import Link from "next/link";

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>06-next-layout (Pages Router)</h1>
      <p>
        <Link href="/lifecycle-client">/lifecycle-client</Link>
      </p>
      <p>
        <Link href="/lifecycle-server">/lifecycle-server</Link>
      </p>
      <p>
        <Link href="/admin">/admin (getLayout 嵌套 Layout + DashboardLayout)</Link>
      </p>
    </main>
  );
}
