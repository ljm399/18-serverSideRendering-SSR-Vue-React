import Link from "next/link";

export default function AsDemoPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>day06 (1) - href + as (old style)</h1>

      <Link href="/day06-pages/profile?id=1000" as="/day06-pages/profile_v2">
        Go profile_v2 (as)
      </Link>

      <hr />
      <Link href="/day06-pages">Back</Link>
    </main>
  );
}
