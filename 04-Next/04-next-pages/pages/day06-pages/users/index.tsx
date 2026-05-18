import Link from "next/link";
import { useRouter } from "next/router";

export default function UsersPage() {
  const router = useRouter();

  return (
    <main style={{ padding: 24 }}>
      <h1>Users</h1>

      <h2>1) Link 跳转（推荐）</h2>
      <Link
        href={{ pathname: "/day06-pages/users/1000", query: { tab: "profile" } }}
      >
        Go /day06-pages/users/1000?tab=profile
      </Link>

      <h2>2) 编程导航</h2>
      <button
        onClick={() =>
          router.push({
            pathname: "/day06-pages/users/1000",
            query: { tab: "posts" },
          })
        }
      >
        router.push to /day06-pages/users/1000?tab=posts
      </button>

      <hr />
      <Link href="/day06-pages">Back</Link>
    </main>
  );
}
