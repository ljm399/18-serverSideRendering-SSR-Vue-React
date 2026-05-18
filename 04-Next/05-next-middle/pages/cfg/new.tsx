import Link from "next/link";

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>/cfg/new</h1>
      <p>
        This page is used to test next.config.ts redirects from <code>/cfg/old</code>.
      </p>
      <p>
        <Link href="/">Back</Link>
      </p>
    </main>
  );
}
