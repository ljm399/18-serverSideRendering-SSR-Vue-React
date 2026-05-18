import Link from "next/link";

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>App Router - Nav Index</h1>

      <p>
        <Link href="/nav/link-demo">/nav/link-demo</Link>
      </p>
      <p>
        <Link href="/nav/router-demo">/nav/router-demo</Link>
      </p>
      <p>
        <Link href="/nav/route-listener">/nav/route-listener</Link>
      </p>

      <p>
        <Link href="/dashboard">/dashboard (loading.tsx demo)</Link>
      </p>
    </main>
  );
}
