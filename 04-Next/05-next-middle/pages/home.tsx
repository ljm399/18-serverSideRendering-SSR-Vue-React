import Link from "next/link";

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>/home</h1>
      <p>cookie exp=v2 时，会被 middleware rewrite 到 /v2/home（地址栏不变）。</p>
      <p>
        <Link href="/">Back</Link>
      </p>
    </main>
  );
}
