import Link from "next/link";

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>07-next-backendapi (Pages Router)</h1>
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
