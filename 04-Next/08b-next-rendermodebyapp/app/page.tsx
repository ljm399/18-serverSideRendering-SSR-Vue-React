import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>08b-next-rendermodebyapp (App Router)</h1>
      <p>
        <Link href="/books-ssg">/books-ssg (default cache)</Link>
      </p>
      <p>
        <Link href="/posts/1">/posts/1 (generateStaticParams)</Link>
      </p>
      <p>
        <Link href="/books-ssr">/books-ssr (no-store)</Link>
      </p>
      <p>
        <Link href="/books-isr">/books-isr (revalidate=5)</Link>
      </p>
      <p>
        <Link href="/books-csr">/books-csr (client component)</Link>
      </p>
    </main>
  );
}
