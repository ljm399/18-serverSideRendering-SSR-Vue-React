import { useRouter } from "next/router";

export default function NavDemoPage() {
  const router = useRouter();

  return (
    <main style={{ padding: 24 }}>
      <h1>day06 (1) - Programmatic Navigation (Pages Router)</h1>

      <button onClick={() => router.push("/day06-pages/profile?id=1000")}>
        push
      </button>
      <button onClick={() => router.replace("/day06-pages/profile?id=1000")}>
        replace
      </button>
      <button onClick={() => router.back()}>back</button>

      <hr />
      <button
        onClick={() =>
          router.prefetch("/day06-pages/profile?id=1000").then(() => {
            console.log("prefetch done");
          })
        }
      >
        prefetch /day06-pages/profile?id=1000
      </button>

      <hr />
      <button onClick={() => router.push("/day06-pages")}>Back</button>
    </main>
  );
}
