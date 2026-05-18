import Link from "next/link";

export default function AsDemoPage() {
  return (
    <main>
      <h1>Link as Demo</h1>

      <h2>Old style: href + as</h2>
      <div>
        <Link href="/profile?id=1000" as="/profile_v2">
          Go profile_v2 (as)
        </Link>
      </div>

      <h2>Recommended: dynamic route</h2>
      <div>
        <Link href="/profile/1000">Go /profile/1000</Link>
      </div>

      <h2>Recommended: rewrites (configured in next.config.ts)</h2>
      <div>
        <Link href="/profile_v2">Go /profile_v2 (rewrite to /profile/1000)</Link>
      </div>

      <div style={{ marginTop: 12 }}>
        <Link href="/">Back Home</Link>
      </div>
    </main>
  );
}
