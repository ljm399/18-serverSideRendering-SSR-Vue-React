import Script from 'next/script'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script
        src="baidu.com"
        strategy="afterInteractive"
        onLoad={() => {
          // window.xxxSDK?.init()
        }}
      />

      <Component {...pageProps} />
    </>
  )
}