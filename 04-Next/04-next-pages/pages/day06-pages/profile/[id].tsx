import { useRouter } from "next/router";

export default function ProfileIdPage() {
  const router = useRouter();

  if (!router.isReady) return <p style={{ padding: 24 }}>Loading...</p>;

  const id = router.query.id;

  return (
    <main style={{ padding: 24 }}>
      <h1>Profile (dynamic)</h1>
      <p>id: {id ? String(id) : "(missing)"}</p>
    </main>
  );
}
