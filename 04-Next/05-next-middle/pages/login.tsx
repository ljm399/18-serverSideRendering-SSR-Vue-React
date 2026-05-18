import { useEffect } from "react";

export default function LoginPage() {
  useEffect(()=>{
    document.cookie = "token=aabbcc; path=/"
    document.cookie = 'exp=v2;'
    console.log(document.cookie);
    console.log(location.origin, document.cookie);
  },[])  
  return (
    <main style={{ padding: 24 }}>
      <h1>Login</h1>
      <p>
        Demo login: open DevTools Console and run:
        <br />
        <code>document.cookie = "token=aabbcc; path=/"</code>
      </p>
    </main>
  );
}
