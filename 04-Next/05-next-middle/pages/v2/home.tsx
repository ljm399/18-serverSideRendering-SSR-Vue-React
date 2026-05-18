import Link from "next/link";

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>/v2/home</h1>
      <p>This is the v2 page.</p>
      <p>
        <Link href="/">Back</Link>
      </p>
    </main>
  );
}
