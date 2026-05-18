"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function RouteListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log("pathname changed =>", pathname);
  }, [pathname]);  

  useEffect(() => {
    console.log("searchParams changed =>", searchParams.toString());
  }, [searchParams]);

  return null;
}

export default function Page() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <main style={{ padding: 24 }}>
      <RouteListener />

      <h1>App Router - Route Listener</h1>
      <p>Open DevTools Console and click the links below.</p>

      <p>
        Current pathname: <code>{pathname}</code>
      </p>
      <p>
        Current searchParams: <code>{searchParams.toString()}</code>
      </p>

      <hr />

      <p>
        <Link href="/nav/route-listener?a=1">Same pathname, change query a=1</Link>
      </p>
      <p>
        <Link href="/nav/route-listener?a=2">Same pathname, change query a=2</Link>
      </p>
      <p>
        <Link href="/nav/link-demo">Go /nav/link-demo (change pathname)</Link>
      </p>
      <p>
        <Link href="/">Back</Link>
      </p>
    </main>
  );
}
