import Link from "next/link";

export default function Demo() {
  return (
    <main style={{ padding: 24 }}>
      <h1>day06 (1) - Link Demo (Pages Router)</h1>

      <Link href="/day06-pages/profile?id=1000">Go Profile (query)</Link>
      <br />
      <Link href="/day06-pages/users/1000">Go User Detail (dynamic route)</Link>

      <hr />
      <Link href="/day06-pages">Back</Link>
    </main>
  );
}
