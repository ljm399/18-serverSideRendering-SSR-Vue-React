import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>04-next-pages</title>
        <meta name="description" content="Next.js pages router demo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <h1>04-next-pages</h1>
        <div>
          <Link href="/day06-pages">Go day06-pages</Link>
        </div>
        <div>
          <Link href="/about">Go About</Link>
        </div>
        <div>
          <Link href="/cart?count=100" as="/profile_v3">Go Cart</Link>
        </div>
        <div>
          <Link href="/links">Go Links Demo</Link>
        </div>
        <div>
          <Link href="/as-demo">Go Link as / rewrites Demo</Link>
        </div>
        <div>
          <Link href="/profile_v2">Go /profile_v2 (rewrite)</Link>
        </div>

        <div>编程导航</div>
        <button onClick={() => router.push("/profile/3?id=1000")}>push</button>
        <button onClick={() => router.replace("/profile/4?id=1000")}>replace</button>
        <button onClick={() => router.back()}>back</button>
      </main>
    </>
  );
}
