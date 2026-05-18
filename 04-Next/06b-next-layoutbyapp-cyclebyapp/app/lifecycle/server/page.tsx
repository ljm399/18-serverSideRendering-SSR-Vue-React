export default function ServerLifecyclePage() {
  console.log("[app] Server Component render: 只在服务器执行（按请求或按缓存策略）");

  return (
    <div style={{ padding: 24 }}>
      <h1>App Router - Server Component</h1>
      <p>打开终端/服务端日志看输出</p>
    </div>
  );
}
