import { useEffect } from "react";

export default function LifecycleClientPage() {
  console.log("[pages] render: 每次渲染都会执行（服务端也可能执行一次）");

  useEffect(() => {
    console.log("[pages] useEffect mount: 只会在浏览器执行一次");
    return () => {
      console.log("[pages] useEffect cleanup: 离开页面/组件卸载时执行（浏览器）");
    };
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Pages Router - Client lifecycle</h1>
      <p>打开控制台，看 render / useEffect 的输出顺序</p>
    </div>
  );
}
