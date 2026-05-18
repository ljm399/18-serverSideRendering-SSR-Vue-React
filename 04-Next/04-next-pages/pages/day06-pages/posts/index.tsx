import Link from "next/link";

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Posts - catch-all / optional catch-all</h1>

      <h2>catch-all</h2>
      <p>
        <Link href="/day06-pages/posts/a">/day06-pages/posts/a</Link>
      </p>
      <p>
        <Link href="/day06-pages/posts/a/b/c">/day06-pages/posts/a/b/c</Link>
      </p>

      <h2>optional catch-all</h2>
      <p>
        <Link href="/day06-pages/posts-opt">/day06-pages/posts-opt</Link>
      </p>
      <p>
        <Link href="/day06-pages/posts-opt/a/b">/day06-pages/posts-opt/a/b</Link>
      </p>

      <hr />
      <Link href="/day06-pages">Back</Link>
    </main>
  );
}
