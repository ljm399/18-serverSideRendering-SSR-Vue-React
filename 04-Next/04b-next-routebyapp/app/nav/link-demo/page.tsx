import Link from "next/link";

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>App Router - Link Demo</h1>

      <Link href="/profile?id=1000">Go Profile (query)</Link>
      <br />
      <Link href="/users/1000">Go User Detail (dynamic route)</Link>

      <hr />
      <Link href="/nav/router-demo">Go router demo</Link>
    </main>
  );
}
