import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

export const getServerSideProps: GetServerSideProps<{ time: string }> = async (ctx) => {
  console.log("[pages] getServerSideProps: 只在服务器执行", {
    url: ctx.resolvedUrl,
  });

  return {
    props: {
      time: new Date().toISOString(),
    },
  };
};

export default function LifecycleServerPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  console.log("[pages] page render: 服务器会渲染一次，浏览器水合也会再渲染一次");

  return (
    <div style={{ padding: 24 }}>
      <h1>Pages Router - Server lifecycle</h1>
      <p>server time: {props.time}</p>
    </div>
  );
}
