import Link from "next/link";

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>/wall</h1>
      <p>
        This path is protected by middleware. No token will redirect to
        /wall/login.
      </p>
      <p>
        <Link href="/wall/area">Go /wall/area</Link>
      </p>
      <p>
        <Link href="/">Back</Link>
      </p>
    </main>
  );
}
