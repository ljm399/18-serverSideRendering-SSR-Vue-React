"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  console.log('textRefresh功能');
  
  return (
    <main style={{ padding: 24 }}>
      <h1>App Router - Programmatic Navigation</h1>

      <button onClick={() => router.push("/profile?id=1000")}>push</button>
      <button onClick={() => router.replace("/profile?id=1000")}>replace</button>
      <button onClick={() => router.back()}>back</button>
      <button onClick={() => router.refresh()}>refresh</button>
    </main>
  );
}
