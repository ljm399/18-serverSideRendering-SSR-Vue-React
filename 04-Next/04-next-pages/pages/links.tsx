import Link from "next/link";

export default function LinksPage() {
  return (
    <main>
      <h1>Links Demo</h1>

      <h2>External Link (recommended: use &lt;a&gt;)</h2>
      <div>
        <a href="https://www.jd.com" target="_blank" rel="noopener noreferrer">
          jd.com
        </a>
      </div>

      <h2>External Link (using Link is ok, but still add target/rel)</h2>
      <div>
        <Link href="https://www.jd.com" target="_blank" rel="noopener noreferrer">
          jd.com (Link)
        </Link>
      </div>

      <h2>Internal Link</h2>
      <div>
        <Link href="/">Back Home</Link>
      </div>
    </main>
  );
}
