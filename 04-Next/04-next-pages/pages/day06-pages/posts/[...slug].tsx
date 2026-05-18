import { useRouter } from "next/router";

export default function PostSlugPage() {
  const router = useRouter();
  if (!router.isReady) return <p style={{ padding: 24 }}>Loading...</p>;

  const slug = router.query.slug;
  const parts = Array.isArray(slug) ? slug : [String(slug)];

  return (
    <main style={{ padding: 24 }}>
      <h1>Slug parts (catch-all)</h1>
      <pre>{JSON.stringify(parts, null, 2)}</pre>
    </main>
  );
}
