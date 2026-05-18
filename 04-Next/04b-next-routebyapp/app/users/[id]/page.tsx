import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main style={{ padding: 24 }}>
      <h1>/users/[id]</h1>
      <p>params id: {id}</p>
      <p>
        <Link href="/">Back</Link>
      </p>
    </main>
  );
}
