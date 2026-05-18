import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const onStart = (url: string) => {
      console.log("routeChangeStart =>", url);
    };
    const onDone = (url: string) => {
      console.log("onrouteChangeComplete =>", url);
    };

    const offonStart = (url: string) => {
      console.log("offrouteChangeStart =>", url);
    };
    const offonDone = (url: string) => {
      console.log("offrouteChangeComplete =>", url);
    };

    router.events.on("routeChangeStart", onStart);
    router.events.on("routeChangeComplete", onDone);
    return () => {
      router.events.off("routeChangeStart", offonStart);
      router.events.off("routeChangeComplete", offonDone);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
}
