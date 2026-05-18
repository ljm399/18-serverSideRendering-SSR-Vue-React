import type { GetServerSideProps } from "next";
import Link from "next/link";

type Props = {
  id: string;
};

export default function ProfilePage(props: Props) {
  return (
    <main>
      <h1>Profile</h1>
      <div>id: {props.id}</div>
      <div>
        <Link href="/as-demo">Go as-demo</Link>
      </div>
      <div>
        <Link href="/">Back Home</Link>
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const id = String(ctx.params?.id ?? "");
  return {
    props: {
      id,
    },
  };
};
