import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const id = typeof sp.id === "string" ? sp.id : Array.isArray(sp.id) ? sp.id[0] : undefined;

  return (
    <main style={{ padding: 24 }}>
      <h1>/profile</h1>
      <p>query id: {id ?? "(empty)"}</p>
      <p>
        <Link href="/">Back</Link>
      </p>
    </main>
  );
}
