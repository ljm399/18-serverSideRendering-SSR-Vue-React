import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { memo } from "react";

type Book = { id: number; name: string };

async function fetchBooks(count: number) {
  const books: Book[] = [];
  for (let i = 0; i < count; i++) {
    books.push({ id: i + 1, name: `book-${i + 1}` });
  }
  return { data: { books } };
}

export const getServerSideProps: GetServerSideProps<{ books: Book[] }> = async (
  context
) => {
  console.log("getServerSideProps");
  console.log(context.query);

  const count = parseInt((context.query.count as string) || "1");
  const res = await fetchBooks(count);

  return {
    props: {
      books: res.data.books,
    },
  };
};

const BooksSSR = memo(function BooksSSR(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return (
    <div style={{ padding: 24 }}>
      <div>BooksSSR</div>
      <ul>
        {props.books.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
});

export default BooksSSR;
