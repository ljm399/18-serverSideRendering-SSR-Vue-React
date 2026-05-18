import Image from "next/image";
import Script from "next/script";

export default function Page() {
  return (
    <main>
      <h1>02-next-components</h1>
      <div>
        metadata title/description is defined in <code>app/layout.tsx</code>
      </div>

      <h2>Script</h2>
      <Script
        id="script-demo"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: "window.__SCRIPT_DEMO__ = 'loaded'",
        }}
      />

      <h2>Image (local from public)</h2>
      <Image src="/next.svg" alt="Next" width={120} height={24} />

      <h2>Image (remote)</h2>
      <Image
        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60"
        alt="Unsplash"
        width={400}
        height={240}
      />
    </main>
  );
}
