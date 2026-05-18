import Link from "next/link";

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>08-next-rendermode (Pages Router)</h1>
      <p>
        <Link href="/about">/about (SSG no data)</Link>
      </p>
      <p>
        <Link href="/books-ssg">/books-ssg (SSG getStaticProps)</Link>
      </p>
      <p>
        <Link href="/posts/3">ssg情况3的/posts/3 (SSG getStaticPaths)
        测试：不断的修改http://localhost:3000/posts/1 后面的1为其他数字
        </Link>
      </p>
      <p>
        <Link href="/books-ssr?count=3">/books-ssr?count=3 (SSR getServerSideProps)</Link>
      </p>
      <p>
        <Link href="/books-isr">/books-isr (ISR revalidate=5)</Link>
      </p>
      <p>
        <Link href="/books-csr">/books-csr (CSR useEffect)</Link>
      </p>

    </main>
  );
}
