import { useRouter } from "next/router";

export default function UserDetailPage() {
  const router = useRouter();
  if (!router.isReady) return <p style={{ padding: 24 }}>Loading...</p>;

  const id = router.query.id;
  const tab = router.query.tab;

  return (
    <main style={{ padding: 24 }}>
      <h1>User id: {String(id)}</h1>
      <p>tab: {tab ? String(tab) : "(none)"}</p>
    </main>
  );
}
