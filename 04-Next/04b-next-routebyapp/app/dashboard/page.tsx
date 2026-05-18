import Link from "next/link";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function Page() {
  await sleep(1500);

  return (
    <main style={{ padding: 24 }}>
      <h1>/dashboard</h1>
      <p>This page is intentionally slow to show route-segment loading UI.</p>
      <p>
        <Link href="/">Back</Link>
      </p>
    </main>
  );
}
