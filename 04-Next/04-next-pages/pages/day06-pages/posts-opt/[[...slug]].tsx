import { useRouter } from "next/router";

export default function PostOptionalSlugPage() {
  const router = useRouter();
  if (!router.isReady) return <p style={{ padding: 24 }}>Loading...</p>;

  const slug = router.query.slug;
  const parts = slug ? (Array.isArray(slug) ? slug : [String(slug)]) : [];

  return (
    <main style={{ padding: 24 }}>
      <h1>Optional slug parts</h1>
      <pre>{JSON.stringify(parts, null, 2)}</pre>
    </main>
  );
}
