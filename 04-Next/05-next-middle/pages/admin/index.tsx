import Link from "next/link";

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>/admin</h1>
      <p>If you have no cookie token, middleware will redirect you to /login.</p>
      <p>
        <Link href="/">Back</Link>
      </p>
    </main>
  );
}
