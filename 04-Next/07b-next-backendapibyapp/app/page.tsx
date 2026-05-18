import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>07b-next-backendapibyapp (App Router)</h1>
      <p>
        <Link href="/profile">/profile</Link>
      </p>
      <p>
        <a href="/api/login" target="_blank">
          /api/login
        </a>
      </p>
    </main>
  );
}
