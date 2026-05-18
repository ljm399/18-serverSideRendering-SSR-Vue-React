import Link from "next/link";

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>day06 (1) - 推荐：用动态路由替代 as</h1>

      <p>
        <Link href="/day06-pages/profile/1000">Go /day06-pages/profile/1000</Link>
      </p>

      <p>
        <Link href="/day06-pages">Back</Link>
      </p>
    </main>
  );
}
