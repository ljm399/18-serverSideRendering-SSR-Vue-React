import { useRouter } from "next/router";

export default function ProfilePage() {
  const router = useRouter();
  const id = router.query.id;

  return (
    <main style={{ padding: 24 }}>
      <h1>Profile (query)</h1>
      <p>id: {id ? String(id) : "(none)"}</p>
    </main>
  );
}
