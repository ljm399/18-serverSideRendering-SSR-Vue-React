import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";

type Post = { id: string; title: string };

async function fetchPostIds(): Promise<string[]> {
  return ["1", "2", "3"];
}

async function fetchPostDetail(id: string): Promise<Post> {
  return { id, title: `post-${id}` };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const ids = await fetchPostIds();
  return {
    paths: ids.map((id) => ({ params: { id } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{ post: Post }> = async (ctx) => {
  const id = ctx.params?.id as string;
  const post = await fetchPostDetail(id);
  return {
    props: { post },
  };
};

export default function PostDetailPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <div style={{ padding: 24 }}>
      <h1>{props.post.title}</h1>
      <p>id: {props.post.id}</p>
    </div>
  );
}
