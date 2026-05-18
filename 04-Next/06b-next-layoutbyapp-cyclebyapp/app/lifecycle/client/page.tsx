"use client";

import { useEffect, useState } from "react";

export default function ClientLifecyclePage() {
  console.log("[app] Client Component render: 浏览器渲染时会执行");
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("[app] useEffect mount: 浏览器执行");
    return () => {
      console.log("[app] useEffect cleanup: 离开页面/组件卸载（浏览器）");
    };
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>App Router - Client Component</h1>
      <button onClick={() => setCount((c) => c + 1)}>count: {count}</button>
    </div>
  );
}
